console.time('>>> The initialization was finished in');
require('babel-core/register');

// DATABASE ---------------------------------------------------
const config_db         = require('config').get('Database');
const mongoose          = require('mongoose');

// Create a database connection.
mongoose.connect(config_db.get('url'), config_db.get('port'));
mongoose.connection.on('error', console.error.bind(console, 'Error: [Database connection failed.]'));

// Verify the database connection.
if(mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2){
    console.error('Error: [Mongoose connection failed with a code: ' + mongoose.connection.readyState + ']');
    process.exit();
}

// APPLICATION ------------------------------------------------
const config_app        = require('config').get('Application');
const express           = require('express');
const app               = express();
const port              = process.env.PORT || config_app.get('port');
const router            = require('./src/controllers/router')(express);
const passport          = require('passport');
const bodyParser        = require('body-parser');

// Initialize json parser.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply passport.
app.use(passport.initialize());

// Register routes.
app.use('/api', router);

// Start the server.
app.listen(port);
console.log(
    '>>> ' +
    config_app.get('title') +
    ' created by ' +
    config_app.get('author') +
    ' is now listening on port ' +
    port
);
console.timeEnd('>>> The initialization was finished in');