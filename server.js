require('babel-core/register');
const config_app        = require('config').get('Application');
const config_db         = require('config').get('Database');
process.env.NODE_ENV    = config_app.get('phase');
const log               = require('./debug')('server').debug;
const mongoose          = require('mongoose');
const express           = require('express');
const bodyParser        = require('body-parser');
const passport          = require('passport');
const session           = require('express-session');
const app               = express();
const port              = process.env.PORT || config_app.get('port');
const router            = require('./src/controllers/router')(express);
const ejs               = require('ejs');
const md5               = require('md5');

// Db: create a new database connection.
mongoose.Promise = global.Promise;
mongoose.connect(config_db.get('url'), config_db.get('port'));
mongoose.connection.on('error', log.bind(log, 'Database connection failed.', true));

// Db: verify the connection.
if (mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2) {
    log('Mongoose connection failed with a code: ' + mongoose.connection.readyState, true);
    process.exit();
}

// App: initialize json parser.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// App: apply passport.
app.use(passport.initialize());

// App: start the view engine.
app.set('view engine', 'ejs');
app.use(session({
    secret: md5('cef4d8dc12ba8a0438a6a039666a3295' + Date.now()),
    saveUninitialized: true,
    resave: true
}));

// App: register routes.
app.use('/api', router);

// App: start the server.
app.listen(port);
log(config_app.get('title') + ' v.' + config_app.get('version') + ' is now listening on port ' + port + '.');