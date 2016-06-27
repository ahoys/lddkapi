const config = require('config').get('DEBUG');

/**
 * Prints a debug message if enabled
 * @param str {String} message to be printed
 * @type {function()}
 * @return {Boolean} if printed
 */
module.exports = ((title, str) => {
    try{
        if(config.get('state')){
            console.log(title + '\n' + str + '\n----------------');
            return true;
        }
        return;
    }catch(err){
        return;
    }
});