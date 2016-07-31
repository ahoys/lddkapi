const fs            = require('fs');
const dateObj       = new Date();
const dateStr       = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1) + '-' + dateObj.getUTCDate();
const log_status    = fs.createWriteStream('./logs/' + dateStr + '_status.log', {flags: 'a'});
const log_error     = fs.createWriteStream('./logs/' + dateStr + '_errors.log', {flags: 'a'});

module.exports = {

    /**
     * Logs events.
     * You can additionally show the message in the console with debug = true.
     * @param msg {string}
     * @param debug {boolean}
     */
    log: (msg, debug) => {
        log_status.write(new Date() + '\n' + msg + '\n\n');
        if (debug === true) {
            console.log(msg);
        }
    },

    /**
     * Logs errors.
     * You can additionally show the message in the console with debug = true.
     * @param msg
     * @param debug
     * @param err
     */
    error: (msg, debug, err) => {
        const errMsg = err
            ? new Date() + '\n' + err + '\n\n'
            : new Date() + '\n' + msg + '\n\n' ;
        log_error.write(errMsg);
        if (debug === true) {
            console.error(msg);
        }
        else {
            // Errors are important, show the administrator that new errors have occurred.
            log_status.write(new Date() + '\n' + 'An error occurred, see the logs for more info.');
            console.log('An error occurred, see the logs for more info.');
        }
    }
};