const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IssueSchema = new Schema({
    project: {type: String, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_on: {type: Date, default: Date.now()},
    updated_on: {type: Date, default: Date.now()},
    created_by: {type: String, required: true},
    assigned_to: {type: String, default: ""},
    open: {type: Boolean, default: true},
    status_text: {type: String, default: ""}
})

//export model
module.exports = mongoose.model('Issue', IssueSchema);