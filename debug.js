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
            try{
                const errLine = err !== undefined && typeof(err) === 'object' && err.stack !== undefined && err.stack.split('\n')[4] !== undefined
                    ? '\n: ' + err.stack.split('\n')[4].replace(/\s+/g, ' ').substr(1, 512)
                    : '' ;
                const errMsg = err !== undefined && process.env.NODE_ENV === 'development'
                    ? '\n: ' + String(err) + errLine
                    : '' ;
                console.log(tag + ': ' + str + errMsg);
                if (log === true) {
                    file.write(new Date() + tag + ': ' + str + errMsg + '\n\n');
                }
            }catch(err){
                console.log('Debugging has failed: ' + err);
            }
            return true;
        }
        return false;
    };

    return module;
};