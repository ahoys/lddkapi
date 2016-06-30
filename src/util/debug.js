const config = require('config').get('DEBUG');

/**
 * Prints a debug message if enabled
 * @type {function()}
 * @return {Boolean} if printed
 */
module.exports = function log(){
    try{
        var args = Array.prototype.slice.call(arguments, 1);
        if(config.get('state')){
            var str = '';
            args.forEach((arg, i) => {
                if(i < 1){
                    str += arg;
                }else{
                    str += '\n' + arg;
                }
            });
            console.log('\n' + new Date() + '\n' + str);
            return true;
        }
        return false;
    }catch(err){
        console.log('Logging failed: ' + err);
        return false;
    }
};