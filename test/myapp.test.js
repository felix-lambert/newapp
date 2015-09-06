// test/myapp.test.js
var assert  = require('chai').assert;
var request = require('supertest');
var server  = require('./myapp');
var app     = server();
var mongoose = require('mongoose');


before(function (done) {   
  mongoose.connect('mongodb://localhost/intouchdevtest', function(){
    mongoose.connection.db.dropDatabase(function(){
      done()
    })    
  })
})

var token = '';

it('get /search', function(done) {
  request(app)
    .get('/search')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200, done);
});

it('get /api/notifications/', function(done) {
  request(app)
    .get('/api/notifications/')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .expect('"There is no token"', done);
});

it('get /auth/username-exists', function(done) {
  request(app)
    .get('/auth/username-exists')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .expect('"No username is typed"', done);
});

it('get /auth/email-exists', function(done) {
  request(app)
    .get('/auth/email-exists')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .expect('"No email is typed"', done);
});

it('should return the correct HTML', function(done) {
  request(app)
    .get('/')
    .end(function(err, res) {
      assert.isTrue(res.text.indexOf('</html>') > 0);
      done();
    });
});

it('Sign in user with incorrect email', function(done) {
  request(app)
  .post('/auth/login')
    .send({
      email : 'frepirtjiupghtr',
      password : 'frejrpijgtripjgtr'
    })
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(400)
    .expect('{"err":"Incorrect username"}', done);
});

it('Normal registration', function(done) {
  request(app)
  .post('/auth/register')
      .send({
        username: 'felix',
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon',
        repeatPassword: 'lebarbarelemelon'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
});

it('Registration with no username', function(done) {
  request(app)
  .post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon',
        repeatPassword: 'lebarbarelemelon'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('"There is no username or email"', done);
});

it('Registration with no email', function(done) {
  request(app)
  .post('/auth/register')
      .send({
        username: 'felix',
        password : 'lebarbarelemelon',
        repeatPassword: 'lebarbarelemelon'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('"There is no username or email"', done);
});

it('Normal authentification', function(done) {
  request(app)
  .post('/auth/login')
  .send({
    email : 'lambertfelix8@gmail.com',
    password : 'lebarbarelemelon'
  })
  .set('Accept', 'application/json')
  .expect('Content-Type', /json/)
  .expect(200, done);
});

it('Wrong password', function(done) {
  request(app).post('/auth/login')
      .send({
        email : 'premier@gmail.com',
        password : 'premiere'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('{"err":"Incorrect username"}', done);
});

it('Register not same password', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelodn',
        repeatPassword: 'frergtrgtrtgr'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('"The confirm password does not match"', done);
});

it('Register other time', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'bobby@gmail.com',
        password : 'lebarbarelemelon',
        confPassword: 'lebarbarelemelon'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .expect('"The confirm password does not match"', done);
});

it('Init token and authenticate', function(done) {
  request(app).post('/auth/register')
    .send({
      username: 'bambam',
      email : 'bambam@gmail.com',
      password : 'lebarbarelemelon',
      repeatPassword: 'lebarbarelemelon'
    })
    .end(function(err, res) {
      var result = JSON.parse(res.text);
      token = result.token;
      done();
    });
});

it('Send announce', function(done) {
  request(app).post('/api/announces')
    .set('auth-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJhbWJhbUBnbWFpbC5jb20ifQ.IjTtiDaOTLu4Uay219v2-NWIqfTKo1-1FoyFgZ6HVzk')
    .send({
      title: 'bambam',
      content : 'bambam@gmail.com',
      category : 'lebarbarelemelon',
      type: 'lebarbarelemelon'
    })
    .expect(200, done)
});

it('Send announce but wrong token', function(done) {
  request(app).post('/api/announces')
    .set('auth-token', 'edJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImJhbWJhbUBnbWFpbC5jb20ifQ.IjTtiDaOTLu4Uay219v2-NWIqfTKo1-1FoyFgZ6HVzk')
    .send({
      title: 'bambam',
      content : 'bambam@gmail.com',
      category : 'lebarbarelemelon',
      type: 'lebarbarelemelon'
    })
    .expect(400, done);
});

// it('should return the correct HTML', function(done) {

//   http.get('http://localhost:8000', function(res) {

//     var chunks = [];
//     res.on('data', function(data) {
//       chunks.push(data);
//     }).on('end', function() {
//       assert.isTrue(chunks.join('').indexOf('</html>') > 0);
//       done();
//     });
//   });
// });
