// o2ndgyt test code
var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let updateid1;
let updateid2;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  
  suite('POST /api/issues/{project} => object with issue data', function() {
  // FUNCTIONAL TEST #1 -- EVERY FIELD ON FORM FILLED IN    
    test('#1-Create an issue with every field: POST', function(done) {
      chai.request(server)
      .post('/api/issues/test1')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
        assigned_to: 'Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Title');
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
        assert.equal(res.body.assigned_to, 'Chai and Mocha');
        assert.equal(res.body.status_text, 'In QA');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.equal(res.body.open, true);
        assert.property(res.body, '_id');
        updateid1=res.body._id;
        done();
      });
    });
  // FUNCTIONAL TEST #2 -- REQUIRED FIELD ON FORM FILLED IN    
    test('#2-Create an issue with only required fields: POST', function(done) {
      chai.request(server)
      .post('/api/issues/test1')
      .send({
        issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Title');
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
        assert.property(res.body, 'created_on');
        assert.property(res.body, 'updated_on');
        assert.equal(res.body.open, true);
        assert.property(res.body, '_id');
        updateid2=res.body._id;
        done();
      });
    });

  // FUNCTIONAL TEST #3 -- TEST IF REQUIRED FIELDS MISSING
    test('#3-Create an issue with missing required fields: POST', function(done) {
      chai.request(server)
      .post('/api/issues/test3')
      .send({
        // issue_title: 'Title',
        issue_text: 'text',
        created_by: 'Functional Test - Every field filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
    });    
  });
  //   >>>>>>     END POST TESTS     <<<<<<

  //   >>>>>>     START GET TESTS     <<<<<<  
  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
  // FUNCTIONAL TEST #4 -- GET REQUEST WITH NO FILTERS
    test('#4-View issues on a project: GET request ', function(done) {
      chai.request(server)
      .get('/api/issues/test1')
      .query({})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
  
  // FUNCTIONAL TEST #5 -- GET REQUEST WITH ONE FILTER
    test('#5-View issues on a project with one filter: GET', function(done) {
      chai.request(server)
      .get('/api/issues/test1')
      .query({assigned_to: 'Chai and Mocha'})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });
  
  // FUNCTIONAL TEST #6 -- GET REQUEST WITH MULTIPLE FILTERS
    test('#6-View issues on a project with multiple filters: GET', function(done) {
        chai.request(server)
      .get('/api/issues/test1')
      .query({issue_title:"Title",issue_text: "text"})
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body);
        assert.property(res.body[0], 'issue_title');
        assert.property(res.body[0], 'issue_text');
        assert.property(res.body[0], 'created_on');
        assert.property(res.body[0], 'updated_on');
        assert.property(res.body[0], 'created_by');
        assert.property(res.body[0], 'assigned_to');
        assert.property(res.body[0], 'open');
        assert.property(res.body[0], 'status_text');
        assert.property(res.body[0], '_id');
        done();
      });
    });    
  });  
  //   >>>>>>     END GET TESTS     <<<<<<

  //   >>>>>>     START PUT TESTS     <<<<<<
  suite('PUT /api/issues/{project} => text', function() {
      // FUNCTIONAL TEST #7 -- ONE FIELD TO UPDATE
    test('#7-Update one field on an issue: PUT', function(done) {
      chai.request(server)
      .put('/api/issues/test1')
      .send({
        _id:updateid2,
        issue_title: 'Title12-modified',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id,updateid2);
        done();
      });
    });

  // FUNCTIONAL TEST #8 -- MULTIPLE FIELDS TO UPDATE  
    test('#8-Update multiple fields on an issue: PUT', function(done) {
      chai.request(server)
      .put('/api/issues/test1')
      .send({
        _id:updateid2,
        issue_text: 'text-modified',
        created_by: '(modified) Functional Test - Every field filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully updated');
        assert.equal(res.body._id,updateid2);
        done();
      });
    });
      
  // FUNCTIONAL TEST #9 -- PUT REQUEST WITH MISSING ID
    test('#9-Update an issue with missing _id: PUT', function(done) {
        chai.request(server)
      .put('/api/issues/test1')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
// FUNCTIONAL TEST #10 -- NO FIELDS TO UPDATE
  // MY ORIGINAL CODE
    test('#10-Update an issue with no fields to update: PUT', function(done) {
        chai.request(server)
      .put('/api/issues/test1')
      .send({
        _id:updateid2,
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'no update field(s) sent');
        assert.equal(res.body._id,updateid2);
        done();
      });
    });
  // FUNCTIONAL TEST #11 -- PUT REQUEST WITH INVALID ID    
    test('#11-Update an issue with an invalid _id: PUT', function(done) {
        chai.request(server)
      .put('/api/issues/test1')
      .send({
        _id:"invalidid",
        issue_text: 'text-modified',
        created_by: '(modified) Functional Test - Every field filled in',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not update');
        assert.equal(res.body._id,"invalidid");
        done();
      });
    });      
  });
  //   >>>>>>     END PUT TESTS     <<<<<<

  //   >>>>>>     START DELETE TESTS     <<<<<< 
  suite('DELETE /api/issues/{project} => text', function() {
  // FUNCTIONAL TEST #12 -- DELETE REQUEST WITH VALID _ID  
    test('#12-Delete an issue: DELETE', function(done) {
      chai.request(server)
      .delete('/api/issues/test1')
      .send({
        _id:updateid2,
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.result, 'successfully deleted');
        assert.equal(res.body._id,updateid2);
        done();
      });
    });

  // FUNCTIONAL TEST #13 -- DELETE REQUEST WITH INVALID _ID     
    test('#13-Delete an issue with an invalid _id: DELETE', function(done) {
      chai.request(server)
      .delete('/api/issues/test1')
      .send({
        _id:"invalid",
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'could not delete');
        assert.equal(res.body._id,"invalid");
        done();
      });
    });
      
  // FUNCTIONAL TEST #14 -- DELETE REQUEST WITH MISSING _ID
    test('#14-Delete an issue with missing _id: DELETE', function(done) {
        chai.request(server)
      .delete('/api/issues/test1')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'missing _id');
        done();
      });
    });
  });
});



/*
const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

id1 = "606f522dcf5f8014276f6349";

chai.use(chaiHttp);

let deleteId;

suite("Functional Tests", function() {
  suite("post request test", () => {
    test("Create an issue with every field", done => {
      chai
        .request(server)
        .post("/api/issues/project")
        .send({
          issue_title: "issue",
          issue_text: "functional test",
          created_by: "Yuchan",
          assigned_to: "Chai and Mocha",
          status_text: "testing"
        })
        .end((err, res) => {
          deleteId = res.body._id;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "issue");
          assert.equal(res.body.issue_text, "functional test");
          assert.equal(res.body.created_by, "Yuchan");
          assert.equal(res.body.assigned_to, "Chai and Mocha");
          assert.equal(res.body.status_text, "testing");
          done();
        });
    });

    test("Create an issue with only required fields", done => {
      chai
        .request(server)
        .post("/api/issues/project")
        .send({
          issue_title: "issue",
          issue_text: "functional test",
          created_by: "Yuchan",
          assigned_to: "",
          status_text: ""
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "issue");
          assert.equal(res.body.issue_text, "functional test");
          assert.equal(res.body.created_by, "Yuchan");
          assert.equal(res.body.assigned_to, "");
          assert.equal(res.body.status_text, "");
          done();
        });
    });

    test("Create an issue with missing required fields", done => {
      chai
        .request(server)
        .post("/api/issues/project")
        .send({
          issue_title: "issue",
          issue_text: "",
          created_by: "Yuchan",
          assigned_to: "",
          status_text: ""
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });

  suite("GET request test", () => {
    test("View issues on a project", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body[0], "_id");
          assert.property(res.body[0], "issue_title");
          assert.property(res.body[0], "issue_text");
          assert.property(res.body[0], "created_on");
          assert.property(res.body[0], "updated_on");
          assert.property(res.body[0], "created_by");
          assert.property(res.body[0], "assigned_to");
          assert.property(res.body[0], "open");
          assert.property(res.body[0], "status_text");
          done();
        });
    });

    test("View issues on a project with one filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ created_by: "YI" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          res.body.forEach(result => {
            assert.equal(result.created_by, "YI");
          });
          done();
        });
    });
    
    test("View issues on a project with multiple filters", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ open: true, created_by: "YI" })
        .end((err, res) => {
        assert.equal(res.status, 200);
        res.body.forEach(result => {
            assert.equal(result.open, true);
            assert.equal(result.created_by, "YI");
          });
        done();
      })
    });
    
    
  });
  
  suite("PUT request test", () => {
    test("Update one field on an issue", done => {
/*      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        _id: "606f522dcf5f8014276f6349",
        issue_title: "test - updated issue title"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, "606f522dcf5f8014276f6349");
        assert.equal(res.body.result, "successfully updated");
        done();
      });
    });
*/
/*      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: id1, ///"606f522dcf5f8014276f6349",
          issue_title: 'new_title_added_1_issue'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });

    
    test("Update multiple fields on an issue", done => {
      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        _id: "606f522dcf5f8014276f634b",
        issue_title: "test - updated issue title",
        issue_text: "test - update issue text"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, "606f522dcf5f8014276f634b");
        assert.equal(res.body.result, "successfully updated");
        done();
      });
    });


    test("Update an issue with missing _id", done => {
      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        issue_title: "test - updated issue title",
        issue_text: "test - update issue text"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
    });
    
    test("Update an issue with no fields to update", done => {
      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        _id: "606f522dcf5f8014276f634b"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, "606f522dcf5f8014276f634b");
        assert.equal(res.body.error, "no update field(s) sent")
        done();
      });
    });
    
    test("Update an issue with an invalid _id", done => {
      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        _id: "invalid",
        issue_title: "test - updated issue title",
        issue_text: "test - update issue text"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");
        done();
      });
    })
    
    
    
  });
  
  suite("DELETE request test", () => {
    test("Delete an issue", done => {
      chai.request(server)
      .delete("/api/issues/fcc-project")
      .send({ _id: deleteId })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        done();
      });
    });
    
    test("Delete an issue with an invalid _id", done => {
      chai.request(server)
      .delete("/api/issues/fcc-project")
      .send({ _id: "invalid ID" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        done();
      });
    });
    
    test("Delete an issue with missing _id", done => {
      chai.request(server)
      .delete("/api/issues/fcc-project")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
    });
    
    
    
  });
   
  
});
*/

/*
// ORIGINAL SOLUTION - ERRORS ON PUT TESTS
const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const mongoose = require('mongoose');

chai.use(chaiHttp);

let deleteId;
let newId = '56cb91bdc3464f14678934ca';
let id1 = "";
let id2 = "";

suite('Functional Tests', function() {

  suite("Post => /api/issues/{project}", function() {
//   >>>>>>     START POST TESTS     <<<<<<
  // FUNCTIONAL TEST #1 -- EVERY FIELD ON FORM FILLED IN
    test('#1 - Every field filled in', function(done) {
      chai
      .request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'new issue Title',
        issue_text: 'new issue Text',
        created_by: 'new issue creator',
        assigned_to: 'assigned to Chai and Mocha',
        status_text: 'In QA'
      })
      .end(function(err, res){
        id1 = res.body._id;
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'new issue Title')
        assert.equal(res.body.issue_text, 'new issue Text')
        assert.equal(res.body.created_by, 'new issue creator')
        assert.equal(res.body.assigned_to, 'assigned to Chai and Mocha')
        assert.equal(res.body.status_text, 'In QA')
        assert.equal(res.body.project, 'test')
        
   //     console.log('id 1 has been set as ' + id1)
        done();
      });
    });
    
    // FUNCTIONAL TEST #2 -- REQUIRED FIELD ON FORM FILLED IN
    test('#2 - Only Required fields filled in', function(done) {
      chai
        .request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha Joe',
          status_text: 'In QA'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        // REQUIRED FIELDS
        assert.equal(res.body.issue_title, 'Title')
        assert.equal(res.body.issue_text, 'text')
        assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
        // OPTIONAL FIELDS
        assert.equal(res.body.assigned_to, 'Chai and Mocha Joe')
        assert.equal(res.body.status_text, 'In QA')
      //  assert.equal(res.body.project, 'test')
        id2 = res.body._id
        console.log('id 2 has been set as ' + id2)
        done();
      });
    });
    
    // FUNCTIONAL TEST #3 -- TEST IF REQUIRED FIELDS MISSING
    test('#3 - Missing fields', function(done) {
      chai.request(server)
      .post('/api/issues/test')
      .send({
        issue_title: 'Title'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'required field(s) missing');
        done();
      });
    });
  }); 
  
  // END POST TESTS 
  
  
  //      >>>>>>   START GET TESTS     <<<<<<
  suite("GET => /api/issues/{project}", function() {
     // FUNCTIONAL TEST #4 -- GET REQUEST WITH NO FILTERS
    test('#4 - No filter', function(done) {
      chai
        .request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title' );
          assert.property(res.body[0], 'issue_text' );
          assert.property(res.body[0], 'created_on' );
          assert.property(res.body[0], 'updated_on' );
          assert.property(res.body[0], 'created_by' );
          assert.property(res.body[0], 'assigned_to' );
          assert.property(res.body[0], 'open' );
          assert.property(res.body[0], 'status_text' );
          assert.property(res.body[0], '_id' );
          
        })
        done();
    })


  // FUNCTIONAL TEST #5 -- GET REQUEST WITH ONE FILTER
  
    test("#5 - View issues on a project with one filter", done => {
      chai
        .request(server)
        .get("/api/issues/test")
        .query({ created_by: "YI" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          res.body.forEach(result => {
            assert.equal(result.created_by, "YI");
          });
          done();
        });
    });

    // FUNCTIONAL TEST #6 -- GET REQUEST WITH MULTIPLE FILTERS
    test('#6 - Multiple filters', function(done) {
      chai
      .request(server)
      .get('/api/issues/test')
      .query({
        open: true,
        created_by: 'Functional Test - Every field filled in'})
      .end(function(err, res){
        res.body.forEach((issueResult) => {
          assert.equal(issueResult.open, true),
          assert.equal(issueResult.created_by,  'Functional Test - Every field filled in')
        })        
      })  
      done();  
    });

  }); 
  
  //  >>>>>>     END GET TESTS      <<<<<<<

  // >>>>>>    START PUT TESTS    <<<<<<<

  suite("PUT => /api/issues/{project}", function() {

  // FUNCTIONAL TEST #7 -- ONE FIELD TO UPDATE
 
  // ORIGINAL CODE
    test('#7 - Update One Issue', function(done) {
      chai
        .request(server)
        .put('/api/issues/test')
        .send({
          _id: id1, ///"606f522dcf5f8014276f6349",
          issue_title: 'new_title_added_1_issue'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          done();
        });
    });


    // FUNCTIONAL TEST #8 -- MULTIPLE FIELDS TO UPDATE

    test("#8 - Update multiple fields on an issue", done => {
      chai.request(server)
      .put("/api/issues/test")
      .send({
        _id: id1,
        issue_title: "test - updated issue title",
        issue_text: "test - update issue text"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);  
        assert.equal(res.body._id, id1);           
        assert.equal(res.body.result, "successfully updated");
        
        
        done();
      });
    });


  // FUNCTIONAL TEST #9 -- PUT REQUEST WITH MISSING ID

    // ORIGINAL CODE
    test("#9 - Update An Issue With Missing ID (_id)", function(done) {
      chai
        .request(server)
        .put("/api/issues/test")
        .send({
      //    issue_title: "test_title_updated_Test_9",
      //    issue_text: "test_text_updated_Test_9"
        })
        .end(function(err, res) {
        //  assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        })
    })


  // FUNCTIONAL TEST #10 -- NO FIELDS TO UPDATE
    // MY ORIGINAL CODE
    test('#10 - No Update Fields', function(done) {
      chai.request(server)
      .put("/api/issues/fcc-project")
      .send({
        _id: "606f522dcf5f8014276f634b"
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body._id, "606f522dcf5f8014276f634b");
        assert.equal(res.body.error, "no update field(s) sent")
        done();
      });
    });

    
  // FUNCTIONAL TEST #11 -- PUT REQUEST WITH INVALID ID
  // MY ORIGINAL CODE
    test("#11 - Update an issue with an invalid ID", function(done) {
      chai
        .request(server)
        .put("/api/issues/apitest2")
        .send({_id: "invalid ID", issue_title: "updated title - wont work -- bad ID",
        issue_text: "updated text - wont work -- bad ID"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    });
  }); 
  //    >>>>>>   END PUT TESTS    <<<<<<<


  //  >>>>>>  START DELETE TESTS      <<<<<<<


  suite("DELETE => /api/issues/{project}", function() {
    
    // FUNCTIONAL TEST #12 -- DELETE REQUEST WITH VALID _ID
    test("#12 - Delete an issue", done => {
      chai.request(server)
      .delete("/api/issues/test")
      .send({ _id: id1 })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        assert.equal(res.body._id, id1);
        done();
      });
    });


    // FUNCTIONAL TEST #13 -- DELETE REQUEST WITH INVALID _ID

    test("#13 - invalid ID", function(done) {
      chai
        .request(server)
        .delete("/api/issues/apitest2")
        .send({_id: "invalid ID"})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          done();
        });
    });

      
    
    test('#14 - Missing ID', function(done) {
      chai
        .request(server)
        .delete('/api/issues/test')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });  
    });

  });

});  

// >>>>>  END MAIN FUNCTIONAL TEST SUITE FUNCTION   <<<<
*/