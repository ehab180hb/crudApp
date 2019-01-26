const { app, logger } = require('./util');
const { expressConf } = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./routes/index');
const { mongoConf } = require('./config');
const { MongoClient } = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (app.get('env') == 'development') app.use(morgan('tiny'));

(async function() {
  const { uri, dbName } = mongoConf;
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(dbName);

  process.once('exit', async () => {
    await client.close();
  });

  app.use((req, _res, next) => {
    req.DB = db;
    next();
  });

  for (let route in routes) {
    logger.info(`Attaching route: /api/v1/${route}`);
    app.use(`/api/v1/${route}`, routes[route]);
  }

  const listener = app.listen(expressConf.port);
  logger.info(`listening on port ${listener.address().port}`);
})();
