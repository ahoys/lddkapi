// Base setup.
require('babel-core/register');
const mongoose          = require('mongoose');
const bodyParser        = require('body-parser');
const express           = require('express');
const config            = require('config').get('API');
const app               = express();
const port              = process.env.PORT || config.get('general.port');
const passport          = require('passport');

// Initialize json parser.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Apply passport.
app.use(passport.initialize());

// Get routes.
const router        = require('./src/controllers/router')(express);

// Initialize and connect the database.
mongoose.connect(config.get('database.url'), config.get('database.port'), config.get('database.options'));
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection failed.'));

// Abort if the database cannot be found.
if(mongoose.connection.readyState !== 1 && mongoose.connection.readyState !== 2){
    console.log('Mongoose connection failed! Code: ' + mongoose.connection.readyState);
    process.exit();
}

// Register routes.
app.use('/api', router);

// Start the server.
app.listen(port);
console.log('>>> ' + config.get('general.title') + ' is now listening port ' + port + ' >>>');