const fs            = require('fs');
const dateObj       = new Date();
const dateStr       = dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1) + '-' + dateObj.getUTCDate();
const file          = fs.createWriteStream('./logs/' + dateStr + '_debug.log', {flags: 'a'});

module.exports = (tag = '') => {

    const module = {};
    tag = String('\n[' + tag + ']\n');

    /**
     * Logs down manually triggered logging events.
     * @param str
     * @param log
     * @param err
     * @returns {boolean}
     */
    module.debug = (str = '', log = false, err = undefined) => {
        str = String(str);
        log = Boolean(log);
        if (str.length > 0) {
            const errLine = err !== undefined
                ? '\n: ' + err.stack.split('\n')[4].replace(/\s+/g, ' ').substr(1, 512)
                : '' ;
            const errMsg = err !== undefined
                ? errLine + '\n: ' + String(err)
                : '' ;
            console.log(tag + ': ' + str + errMsg);
            if (log === true) {
                file.write(new Date() + tag + ': ' + str + errMsg + '\n\n');
            }
            return true;
        }
        return false;
    };

    return module;
};