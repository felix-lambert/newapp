// test/myapp.test.js
var assert  = require('chai').assert;
var request = require('supertest');
var server  = require('./myapp');
var app     = server();

it('get / return a 200 response', function(done) {
  request(app).get('/').expect(200, done);
});

it('get /search return a 200 response (search)', function(done) {
  request(app)
    .get('/search')
    .expect(200, done);
});

it('get /api/notifications/ return a 400 response', function(done) {
  request(app)
    .get('/api/notifications/')
    .expect(400, done);
});

it('get /auth/username-exists return a 400 response', function(done) {
  request(app)
    .get('/auth/username-exists')
    .expect(400, done);
});

it('get /auth/email-exists return a 400 response', function(done) {
  request(app)
    .get('/auth/email-exists')
    .expect(400, done);
});

it('should return the correct HTML', function(done) {
  request(app)
    .get('/')
    .end(function(err, res) {
      assert.isTrue(res.text.indexOf('</html>') > 0);
      done();
    });
});

it('Sign in user', function(done) {
  request(app).post('/auth/login')
    .send({
      email : 'frepirtjiupghtr',
      password : 'frejrpijgtripjgtr'
    })
    .expect(400, done);
});

it('Sign in user', function(done) {
  request(app).post('/auth/login')
      .send({
        email : 'frepirtjiupghtr@gmail.com',
        password : 'frejrpijgtripjgtr'
      })
      .expect(400, done)
});

it('Sign in user', function(done) {
  request(app).post('/auth/login')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon'
      })
      .expect(200, done)
});

it('Sign in user', function(done) {
  request(app).post('/auth/login')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelodn'
      })
      .expect(400, done)
});

it('Register', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelodn',
        passwordConf: 'frergtrgtrtgr'
      })
      .expect(400, done);
});

it('Register', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon',
        passwordConf: 'lebarbarelemelon'
      })
      .expect(400, done);
});

it('Register', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon',
        confPassword: 'lebarbarelemelon'
      })
      .expect(400, done);
});

it('Register not same password', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelodn',
        confPassword: 'frergtrgtrtgr'
      })
      .expect(400, done);
});

it('Register again', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'lambertfelix8@gmail.com',
        password : 'lebarbarelemelon',
        confPassword: 'lebarbarelemelon'
      })
      .expect(400, done);
});

it('Register other time', function(done) {
  request(app).post('/auth/register')
      .send({
        email : 'bobby@gmail.com',
        password : 'lebarbarelemelon',
        confPassword: 'lebarbarelemelon'
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
