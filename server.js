const { app, logger } = require('./util');
const { expressConf } = require('./config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const routes = require('./api/routes/index');
const modules = require('./api/modules/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (app.get('env') == 'development') app.use(morgan('tiny'));

(async function() {
  const dbModules = await modules();

  app.use((req, res, next) => {
    req.dbModules = dbModules;
    next();
  });
  for (let route in routes) {
    logger.info(`Attaching route: /api/v1/${route}`);
    app.use(`/api/v1/${route}`, routes[route]);
  }

  const listener = app.listen(expressConf.port);
  logger.info(`listening on port ${listener.address().port}`);

  process.on('exit', async () => {
    await client.close();
  });
})();
