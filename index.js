import express from 'express';
import hbs from 'express-handlebars';

const app = express();

// Configure Handlebars
const handlebars = hbs.create({
  defaultLayout: 'main'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Configure body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('port', process.argv[2] || 3000);

/* Create a context, accepting either the query on a GET request or the body on
 * a POST request, along with the method of the request.
 * We create an array in the context and add all the data from the request to it,
 * set the method of the request and return the context.
 */
const setContext = (data, method) => {
  const context = {};
  context.data = [];
  context.method = method;

  for (let parameter in data) {
    context.data.push({
      'key': parameter,
      'value': data[parameter]
    });
  }

  return context;
}

app.get('/', (req, res) => {
  res.render('index', setContext(req.query, req.method));
});

app.post('/', (req, res) => {
  res.render('index', setContext(req.body, req.method));
});

app.use((_req, res) => {
  res.status(404);
  res.render('404');
});

app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), () => {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});
