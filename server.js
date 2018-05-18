const { app, MongoClient, logger } = require('./util');
const { expressConf, mongoConf } = require('./config');
const bodyParser = require('body-parser');
const apiRoutes = require('./api/routes/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    const { uri, dbName } = mongoConf;
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    const db = client.db(dbName);

    req.DB = db;
    next();
  } catch (error) {
    logger.error(error);
  }
});

for (let route in apiRoutes) {
  logger.info(`Attaching route: /api/v1/${route}`);
  app.use(`/api/v1/${route}`, apiRoutes[route]);
}

const listener = app.listen(expressConf.port);
logger.info(`listening on port ${listener.address().port}`);
