require('babel-core/register');

// Base setup.
const config_app        = require('config').get('Application');
const config_db         = require('config').get('Database');
const debug             = require('./debug');
const mongoose          = require('mongoose');
const express           = require('express');
const bodyParser        = require('body-parser');
const passport          = require('passport');
const app               = express();
const port              = process.env.PORT || config_app.get('port');
const router            = require('./src/controllers/router')(express);

// Db: create a new database connection.
mongoose.connect(config_db.get('url'), config_db.get('port'));
mongoose.connection.on('error', debug.error.bind(debug, 'Error: [Database connection failed.]'));

// Db: verify the connection.
if(mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2){
    debug.error('Error: [Mongoose connection failed with a code: ' + mongoose.connection.readyState + ']');
    process.exit();
}

// App: initialize json parser.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// App: apply passport.
app.use(passport.initialize());

// App: register the router.
app.use('/api', router);

// App: start the server.
app.listen(port);
debug.log(
    '>>> ' +
    config_app.get('title') +
    ', created by ' +
    config_app.get('author') +
    ', is now listening on port ' +
    port,
    true
);