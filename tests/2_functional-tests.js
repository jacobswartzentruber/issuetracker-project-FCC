const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  let testID;

  test('Create an issue with every field: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .post('/api/issues/testProject')
      .send(
        {
          issue_title: 'testTitle',
          issue_text: 'testText',
          created_by: 'testCreator',
          assigned_to: 'testAssignee',
          status_text: 'testStatus'
        }
      )    
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'testTitle');
        assert.equal(res.body.issue_text, 'testText');
        assert.equal(res.body.created_by, 'testCreator');
        assert.equal(res.body.assigned_to, 'testAssignee');
        assert.equal(res.body.status_text, 'testStatus');
        assert.isTrue(res.body.open);
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        done();
      });
  });

  test('Create an issue with only required fields: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .post('/api/issues/testProject')
      .send(
        {
          issue_title: 'testTitle',
          issue_text: 'testText',
          created_by: 'testCreator',
        }
      ) 
      .end(function(err, res) {
        testID = res.body._id;

        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.issue_title, 'testTitle');
        assert.equal(res.body.issue_text, 'testText');
        assert.equal(res.body.created_by, 'testCreator');
        assert.equal(res.body.assigned_to, '');
        assert.equal(res.body.status_text, '');
        assert.isTrue(res.body.open);
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        done();
      });
  });

  test('Create an issue with missing required fields: POST request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .post('/api/issues/testProject')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.equal(res.body.error, 'required field(s) missing');

        done();
      });
  });
  
  test('View issues on a project: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .get('/api/issues/testProject')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, "application/json");
        assert.isArray(res.body);
        assert.property(res.body[res.body.length-1], '_id');
        assert.property(res.body[res.body.length-1], 'issue_title');
        assert.property(res.body[res.body.length-1], 'issue_text');
        assert.property(res.body[res.body.length-1], 'assigned_to');
        assert.property(res.body[res.body.length-1], 'status_text');
        assert.property(res.body[res.body.length-1], 'created_by');
        assert.property(res.body[res.body.length-1], 'created_on');
        assert.property(res.body[res.body.length-1], 'updated_on');
        assert.property(res.body[res.body.length-1], 'open');
        done();
      });
  });
  
  test('View issues on a project with one filter: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .get('/api/issues/testProject')
      .query({status_text: 'testStatus'})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isArray(res.body);
        assert.property(res.body[res.body.length-1], '_id');
        assert.property(res.body[res.body.length-1], 'issue_title');
        assert.property(res.body[res.body.length-1], 'issue_text');
        assert.property(res.body[res.body.length-1], 'assigned_to');
        assert.property(res.body[res.body.length-1], 'status_text');
        assert.property(res.body[res.body.length-1], 'created_by');
        assert.property(res.body[res.body.length-1], 'created_on');
        assert.property(res.body[res.body.length-1], 'updated_on');
        assert.property(res.body[res.body.length-1], 'open');
        assert.equal(res.body[res.body.length-1].status_text, 'testStatus');
        done();
      });
  });
  
  test('View issues on a project with multiple filters: GET request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .get('/api/issues/testProject')
      .query({
        status_text: 'testStatus',
        issue_title: 'testTitle',
        issue_text: 'testText'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.isArray(res.body);
        assert.property(res.body[res.body.length-1], '_id');
        assert.property(res.body[res.body.length-1], 'issue_title');
        assert.property(res.body[res.body.length-1], 'issue_text');
        assert.property(res.body[res.body.length-1], 'assigned_to');
        assert.property(res.body[res.body.length-1], 'status_text');
        assert.property(res.body[res.body.length-1], 'created_by');
        assert.property(res.body[res.body.length-1], 'created_on');
        assert.property(res.body[res.body.length-1], 'updated_on');
        assert.property(res.body[res.body.length-1], 'open');
        assert.equal(res.body[res.body.length-1].status_text, 'testStatus');
        assert.equal(res.body[res.body.length-1].issue_title, 'testTitle');
        assert.equal(res.body[res.body.length-1].issue_text, 'testText');
        done();
      });
  });
  
  test('Update one field on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .put('/api/issues/testProject')
      .send({_id: testID, issue_title: 'newTestTitle'})
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testID);
        done();
      });
  });
  
  test('Update multiple fields on an issue: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .put('/api/issues/testProject')
      .send({
        _id: testID,
        issue_title: 'newTestTitle',
        status_text: 'newTestStatus'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id, testID);
        done();
      });
  });
  
  test('Update an issue with missing _id: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .put('/api/issues/testProject')
      .send({
        issue_title: 'newTestTitle',
        status_text: 'newTestStatus'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      });
  });
  
  test('Update an issue with no fields to update: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .put('/api/issues/testProject')
      .send( {_id: testID} )
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'no update field(s) sent');
        done();
      });
  });
  
  test('Update an issue with an invalid _id: PUT request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .put('/api/issues/testProject')
      .send({
        _id: 123456789,
        issue_title: 'newTestTitle'
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not update');
        done();
      });
  });
  
  test('Delete an issue with an invalid _id: DELETE request to /api/issues/{project}', function(done) {

    let invalidID = 123456789;

    chai
      .request(server)
      .delete('/api/issues/testProject')
      .send( {_id: invalidID} )
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id, invalidID)
        done();
      })
  });
  
  test('Delete an issue with missing _id: DELETE request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .delete('/api/issues/testProject')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.error, 'missing _id');
        done();
      })
  });

  test('Delete an issue: DELETE request to /api/issues/{project}', function(done) {
    chai
      .request(server)
      .delete('/api/issues/testProject')
      .send({
        _id: testID
      })
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.type, 'application/json');
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id, testID);
        done();
      })
  });
});
