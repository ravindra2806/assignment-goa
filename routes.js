// routes
// inculing initial libraries
var Apis = require('./controllers/apis'); 
apiObj = new Apis();

module.exports = {
  routing: function(app) {
    app.get('/', function(req, res, next) { 
        apiObj.index(req, res, next);
    });
    
    app.post('/apis/submit', function(req, res, next) {
        apiObj.submit(req, res, next);
    });

    
    

  }
}
