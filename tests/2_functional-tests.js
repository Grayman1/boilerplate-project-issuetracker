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
        created_by: 'PythonMaster2020',
        assigned_to: 'Grayman0900001',
        status_text: 'Released to Production Server'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Title');
        assert.equal(res.body.created_by, 'PythonMaster2020');
        assert.equal(res.body.assigned_to, 'Grayman0900001');
        assert.equal(res.body.status_text, 'Released to Production Server');
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
        created_by: 'PythonMaster2020',
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, 'Title');
        assert.equal(res.body.created_by, 'PythonMaster2020');
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
        created_by: 'PythonMaster2020',
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
      .query({assigned_to: 'Grayman0900001'})
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
        created_by: '(modified) PythonMaster2020',
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
        created_by: '(modified) PythonMaster2020',
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
