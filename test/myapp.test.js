// test/myapp.test.js
var assert  = require('chai').assert;
var request = require('supertest');
var server  = require('../myapp');
var app     = server();

it('get / return a 200 response', function(done) {
  request(app).get('/').expect(200, done);
});

it('get /api/images return a 400 response', function(done) {
  request(app).get('/api/images').expect(400, done);
});

it('get /api/rooms return a 400 response', function(done) {
  request(app).get('/api/rooms/').expect(400, done);
});

it('get /api/messages/ return a 200 response', function(done) {
  request(app).get('/api/messages/').expect(200, done);
});

it('get /api/announces return a 200 response', function(done) {
  request(app).get('/api/announces').expect(200, done);
});

it('get /* return a 200 response', function(done) {
  request(app).get('/*').expect(200, done);
});

it('get /api/money return a 400 response', function(done) {
  request(app).get('/api/money').expect(400, done);
});

it('get /api/transactions return a 400 response', function(done) {
  request(app).get('/api/transactions').expect(400, done);
});

it('get /api/money return a 400 response', function(done) {
  request(app).get('/api/money').expect(400, done);
});

it('get /api/categories return a 200 response (get categories)',
  function(done) {
  request(app).get('/api/categories').expect(200, done);
});

it('get /api/admin/users return a 400 response', function(done) {
  request(app)
      .get('/api/admin/users')
      .expect(400, done);
});

it('get /auth/session return a 400 response', function(done) {
  request(app)
      .get('/auth/session')
      .expect(400, done);
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

it('get /getReputation return a 400 response', function(done) {
  request(app)
      .get('/getReputation')
      .expect(400, done);
});

it('get /auth/username-exists return a 200 response', function(done) {
  request(app)
      .get('/auth/username-exists')
      .expect(200, done);
});

it('get /auth/email-exists return a 200 response', function(done) {
  request(app)
      .get('/auth/email-exists')
      .expect(200, done);
});

it('get /api/profile return a 400 response', function(done) {
  request(app)
      .get('/api/profile')
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
