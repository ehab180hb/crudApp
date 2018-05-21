const { app, MongoClient, logger, ObjectId } = require('./util');
const { expressConf, mongoConf } = require('./config');
const fetch = require('fetch');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const apiRoutes = require('./api/routes/index');

app.use((req, res, next) => {
  if (req.query._method) {
    req.method = req.query._method;
    req.url = req.path;
  }
  next();
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (app.get('env') == 'development') app.use(morgan('tiny'));

(async function() {
  const { uri, dbName } = mongoConf;
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(dbName);

  app.use(async (req, res, next) => {
    try {
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

  app.get('/', async (req, res) => {
    const collection = db.collection('users');
    let usersList = await collection.find().toArray();
    usersList = usersList.map(x => {
      x.updateLink = `/update/${x._id}`;
      x.deleteLink = `/api/v1/user/${x._id}?_method=DELETE`;
      return x;
    });
    res.render('index', {
      usersList,
    });
  });

  app.get('/update/:id', async (req, res) => {
    try {
      const collection = db.collection('users');
      const userInfo = await collection.findOne(ObjectId(req.params.id));
      if (!userInfo) return res.render('error');
      res.render('update', {
        email: userInfo.email,
        patchLink: `/api/v1/user/${userInfo._id}?_method=PATCH`,
      });
    } catch (error) {
      res.status(404).send('error occured');
      logger.error(error);
    }
  });

  app.get('/create', (req, res) => {
    res.render('create');
  });

  const listener = app.listen(expressConf.port);
  logger.info(`listening on port ${listener.address().port}`);

  process.on('exit', async () => {
    await client.close();
  });
})();
