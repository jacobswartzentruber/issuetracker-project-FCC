'use strict';

const { update } = require('../models/issue');

module.exports = function (app) {

  const Issue = require('../models/issue');

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let queryObj = {project: req.params.project};

      if(req.query._id) queryObj._id = req.query._id;
      if(req.query.issue_title) queryObj.issue_title = req.query.issue_title;
      if(req.query.issue_text) queryObj.issue_text = req.query.issue_text;
      if(req.query.created_on) queryObj.created_on = req.query.created_on;
      if(req.query.updated_on) queryObj.updated_on = req.query.updated_on;
      if(req.query.created_by) queryObj.created_by = req.query.created_by;
      if(req.query.assigned_to) queryObj.assigned_to = req.query.assigned_to;
      if(req.query.open) queryObj.open = req.query.open;
      if(req.query.status_text) queryObj.status_text = req.query.status_text;

      Issue.find(queryObj, (err, issues) => {
          if(err) return res.json({error: "Cannot find project or parameters not correct"});

          let resObj = issues.length > 0 ? issues : "Cannot find any issues for that project name"

          res.json(resObj);
        })
    })
    
    .post(function (req, res){
      let project = req.params.project;

      let issue = new Issue({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text
      });

      issue.save((err, data) => {
        if(err) return res.json({error: 'required field(s) missing'});
        
        res.json(data);
      })
    })
    
    .put(function (req, res){
      let updateFields = Object.entries(req.body);
      updateFields = updateFields.filter(prop => prop[1] != '' && prop[0] != '_id');
      updateFields = Object.fromEntries(updateFields);

      //Send error response if no id in request
      if(!req.body._id){
        res.json({error: 'missing _id'});
      }
      //Send error if no update fields in request
      else if(Object.keys(updateFields).length == 0){
        res.json({error: 'no update field(s) sent', _id: req.body._id});
      }
      //Handle update when id and update fields present
      else{
        updateFields.updated_on = Date.now();

        Issue.findByIdAndUpdate(req.body._id, updateFields, (err, issue) => {
          if(err || !issue){
            res.json({error: 'could not update', _id: req.body._id});
          }else{
            res.json({result: 'successfully updated', _id: issue._id});
          }
        })
      }
    })
    
    .delete(function (req, res){   
      if(!req.body._id){
        res.json({error: 'missing _id'});
      }else{
        Issue.findByIdAndDelete(req.body._id, (err, issue) => {
          if(err || !issue){
            res.json({error: 'could not delete', _id: req.body._id});
          }else{
            res.json({result: 'successfully deleted', _id: issue._id});
          } 
        });
      } 
    });
    
};
