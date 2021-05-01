// o2ndgyt test code
'use strict';
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
const  Schema = mongoose.Schema;

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const issue = new Schema({
    project: {type: String, required: true},
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    status_text: {type: String},
    assigned_to: {type: String},
    created_on: {type: Date, default: new Date().toString()},
    updated_on: {type: Date, default: new Date().toString()},
    open: {type: Boolean, default: true}
});

const Issue = mongoose.model('Issue', issue);

module.exports = function (app) {

  app.route('/api/issues/:project')

    .get((req, res) => {
      // CHECK THAT REQ BODY CONTAINS ALL REQUIRED FIELDS
        if (!req.params.project) {
            res.json({
                error: 'required field(s) missing'
            });
        } else {
            let filter = {};
            filter.project = req.params.project;
            for (var propName in req.query)
                if (req.query.hasOwnProperty(propName))
                    filter[propName] = req.query[propName];
        // GET VALID SELECTED FIELDS
            Issue.find(filter, (err, items) => {
                if (err)
                    res.json({
                        error: err
                    });
                res.json(items);
            });
        }
    })
    // CHECK THAT REQ BODY CONTAINS ALL REQUIRED FIELDS
    .post((req, res) => {
        if (!req.params.project || !req.body.issue_title || !req.body.issue_text || !req.body.created_by) {
            res.json({
                error: 'required field(s) missing'
            });
        } else {
            let tmp = new Issue({
                project: req.params.project,
                issue_title: req.body.issue_title,
                issue_text: req.body.issue_text,
                created_by: req.body.created_by,
                status_text: req.body.status_text || "",
                assigned_to: req.body.assigned_to || "",
            });
            tmp.save((err, doc) => {
                if (err)
                    res.json({
                        error: err
                    });
                res.json(doc);
            });
        }
    })

    .put((req, res) => {
      // CHECK THAT REQ BODY CONTAINS _id FIELD
        if (!req.params.project || !req.body._id) {
          res.json({
            error: 'missing _id'
            });
        } else {
          let user = {
            issue_title: "",
            issue_text: "",
            created_by: "",
            status_text: "",
            assigned_to: ""
        };
        let newObj = {};
        newObj.updated_on = new Date().toString();
        Object.keys(user).forEach((prop) => {
          if (req.body[prop])
              newObj[prop] = req.body[prop];
          });
          // CHECK THAT REQ BODY CONTAINS FIELDS TO UPDATE
          if (Object.keys(newObj).length == 1) {
            res.json({
                error: 'no update field(s) sent',
                _id: req.body._id
            });
          } else {
            try {
              Issue.findOneAndUpdate({
                _id: mongoose.Types.ObjectId(req.body._id),
                project: req.params.project
            }, newObj, {
                new: true
            }, (err, newitem) => {

              res.json(newitem ? {
                // CONFIRM SUCCESSFUL UPDATE
                  result: 'successfully updated',
                  _id: req.body._id
              }: {
                // CONFIRM ERROR FROM FAILED UPDATE REQUEST
                  error: 'could not update',
                  _id: req.body._id
              } );

            });
          } catch {
            res.json({
              error: 'could not update',
                _id: req.body._id
            });
          }
        }
      }
    })

    .delete((req, res) => {
      // CHECK THAT REQ BODY CONTAINS _id FIELD
        if (!req.params.project || !req.body._id) {
            res.json({
                error: 'missing _id'
            });
        } else {
            try {
              // FIND ISSUE AND DELETE
              Issue.findOneAndDelete({
                _id: mongoose.Types.ObjectId(req.body._id),
                project: req.params.project
              }, (err, docs) => {
                  res.json(docs ?

                {
                  // CONFIRM SUCCESSFUL DELETION
                  result: 'successfully deleted',
                  '_id': req.body._id
                } : {
                  // ERROR NOTIFICATION IF DELETE REQUEST FAILS
                  error: 'could not delete',
                  '_id': req.body._id
                }
            );
            });
            } catch {
              res.json({
                // ERROR NOTIFICATION IF DELETE REQUEST FAILS DUE TO OTHER ERROR
                error: 'could not delete',
                  '_id': req.body._id
              });
            }
        }

    });

}



/*
"use strict";
var expect = require("chai").expect;
let mongodb = require("mongodb");
let mongoose = require("mongoose");

module.exports = function(app) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  let issueSchema = new mongoose.Schema({
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    assigned_to: String,
    status_text: String,
    open: { type: Boolean, required: true },
    created_on: { type: Date, required: true },
    updated_on: { type: Date, required: true },
    project: String
  });

  let Issue = mongoose.model("Issue", issueSchema);

  app
    .route("/api/issues/:project")

    .get(function(req, res) {
      let project = req.params.project;
      let queryObj = Object.assign(req.query);
      queryObj.project = project;

      Issue.find(queryObj, (err, arrayObj) => {
        if (!err && arrayObj) {
          return res.json(arrayObj);
        }
      });
    })

    .post(function(req, res) {
      let project = req.params.project;

      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }

      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project //req.params.project
      });

      newIssue.save((err, savedIssue) => {
        if (!err && savedIssue) {
          return res.json(savedIssue);
        }
      });
    })

    .put(function(req, res) {
      let project = req.params.project;
      let updatedObject = {};

      Object.keys(req.body).forEach(key => {
        if (req.body[key] != "") {
          updatedObject[key] = req.body[key];
          updatedObject.updated_on = new Date().toUTCString();
        }
      });

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      if (
        !req.body.issue_title &&
        !req.body.issue_text &&
        !req.body.created_by &&
        !req.body.assigned_to &&
        !req.body.status_text &&
        !req.body.open
      ) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id
        });
      }

      
      Issue.findByIdAndUpdate(
        req.body._id,
        updatedObject,
        { new: true },
        (err, updatedIssue) => {
          if (err || !updatedIssue) {
            return res.json({ error: "could not update", _id: req.body._id });
          } else {
            return res.json({
              result: "successfully updated",
              _id: req.body._id
            });
          }
        }
      );
    })

    .delete(function(req, res) {
      let project = req.params.project;

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      Issue.findByIdAndRemove(req.body._id, (err, deletedIssue) => {
        if (err || !deletedIssue) {
          return res.json({ error: "could not delete", _id: req.body._id });
        } else {
          return res.json({
            result: "successfully deleted",
            _id: req.body._id
          });
        }
      });
    });
};
*/

/*
"use strict";
var expect = require("chai").expect;
// DB CONNECTION
let mongodb = require("mongodb");
let mongoose = require("mongoose");

module.exports = function(app) {
  // DB CONNECTION STRING
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  // CREATE AN ISSUE SCHEMA
  let issueSchema = new mongoose.Schema({
    project: {type: String},
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_by: { type: String, required: true },
    created_on: { type: Date, default: new Date().toString()},
    updated_on: { type: Date, default: new Date().toString()},
    assigned_to: String,
    status_text: String,
    open: { type: Boolean, default: true}    
    
  });
  // CREATE A NEW MODEL
  let Issue = mongoose.model("Issue", issueSchema);

  app
    .route("/api/issues/:project")
// GET FUNCTION
    .get(function(req, res) {
      let project = req.params.project;
      let queryObj = Object.assign(req.query);
      queryObj.project = project;

      Issue.find(queryObj, (err, resObj) => {
        if (!err && resObj) {
          return res.json(resObj);
        }
      });
    })

// POST FUNCTION
    .post(function(req, res) {
      let project = req.params.project;
    // CHECK IF ANY REQUIRED FIELDS MISSING
      if (
        !req.body.issue_title ||
        !req.body.issue_text ||
        !req.body.created_by
      ) {
        return res.json({ error: "required field(s) missing" });
      }
    // CREATE NEW INSTANCE OF MODEL USING REQ BODY DATA
      let newIssue = new Issue({
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to || "",
        status_text: req.body.status_text || "",
        open: true,
        created_on: new Date().toUTCString(),
        updated_on: new Date().toUTCString(),
        project: project //req.params.project
      });
    // SAVE THE MODEL TO JSON RESPONSE
      newIssue.save((err, savedIssue) => {
        if (!err && savedIssue) {
          return res.json(savedIssue);
        }
      });
    })


    .put(function(req, res) {
      let project = req.params.project;
      let updatedObject = {};

      Object.keys(req.body).forEach(key => {
        if (req.body[key] != "") {
          updatedObject[key] = req.body[key];
          updatedObject.updated_on = new Date().toUTCString();
        }
      });

      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      if (
        !req.body.issue_title &&
        !req.body.issue_text &&
        !req.body.created_by &&
        !req.body.assigned_to &&
        !req.body.status_text &&
        !req.body.open
      ) {
        return res.json({
          error: "no update field(s) sent",
          _id: req.body._id
        });
      }

      
      Issue.findByIdAndUpdate(
        req.body._id,
        updatedObject,
        { new: true },
        (err, updatedIssue) => {
          if (err || !updatedIssue) {
            return res.json({ error: "could not update", _id: req.body._id });
          } else {
            return res.json({
              result: "successfully updated",
              _id: req.body._id
            });
          }
        }
      );
    })


   .delete(function(req, res) {
      let project = req.params.project;
    // CHECK THAT REQ BODY CONTAINS _id FIELD
      if (!req.body._id) {
        return res.json({ error: "missing _id" });
      }

      Issue.findByIdAndRemove(req.body._id, (err, deletedIssue) => {
        // RETURN FAILURE JSON MESSAGE IF ERROR OR MISSING ISSUE FIELDS
        if (err || !deletedIssue) {
          return res.json({ error: "could not delete", _id: req.body._id });
        } else {
          // RETURN JSON OFR SUCCESSFUL DELETION
          return res.json({
            result: "successfully deleted",
            _id: req.body._id
          });
        }
      });
    });
};
*/