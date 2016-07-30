const fs        = require('fs');
const Console   = require('console').Console;
const date      = Date.now();
const output    = fs.createWriteStream('./logs/' + date + '_status.log');
const errOutput = fs.createWriteStream('./logs/' + date + '_errors.log');
const writer    = new Console(output, errOutput);

module.exports = {

    /**
     * Logs events.
     * You can additionally show the message in the console with debug = true.
     * @param msg {string}
     * @param debug {boolean}
     */
    log: (msg, debug) => {
        writer.log(new Date() + '\n' + msg + '\n');
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
            ? new Date() + '\n' + err + '\n'
            : new Date() + '\n' + msg + '\n' ;
        writer.error(errMsg);
        if (debug === true) {
            console.error(msg);
        }
        else {
            console.log('An error occurred, see the logs for more info.');
        }
    }
};