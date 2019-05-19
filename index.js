var express = require('express');
var app = express();

// Configure Handlebars
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Configure body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.set('port', process.argv[2] || 3000);

/* Create a context, accepting either the query on a GET request or the body on
 * a POST request, along with the method of the request.
 * We create an array in the context and add all the data from the request to it,
 * set the method of the request and return the context.
 */
function setContext(data, method) {
  var context = {};
  context.data = [];
  context.method = method;
  for (var parameter in data) {
    context.data.push({
      'key': parameter,
      'value': data[parameter]
    });
  }

  return context;
}

app.get('/', function(req, res) {
  res.render('index', setContext(req.query, req.method));
});

app.post('/', function(req, res) {
  res.render('index', setContext(req.body, req.method));
});

app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});
