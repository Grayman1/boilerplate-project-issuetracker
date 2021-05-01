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
// CREATE NEW SCHEMA
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
            for (var idProp in req.query)
                if (req.query.hasOwnProperty(idProp))
                    filter[idProp] = req.query[idProp];
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
