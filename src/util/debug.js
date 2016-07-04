const config = require('config').get('DEBUG');

/**
 * Prints a debug message if enabled
 * @type {function()}
 * @return {Boolean} if printed successfully
 */
module.exports = (origin) => {
    module.log = () => {
        try{
            origin = !origin ? 'Unknown source' : origin ;
            if(config.get('state')){
                // Logging is enabled.
                let str = '';
                const args = Array.prototype.slice.call(arguments, 1);
                // Each argument will be presented on a new line.
                args.forEach((arg, i) => {
                    str += i < 1 ? origin  + '\n' + arg : '\n' + arg ;
                    console.log(str);
                    return true;
                });
            }else{
                // Logging is disabled.
                return false;
            }
        }catch(err){
            throw err;
        }
    }
};
//
// module.exports = function log(){
//     try{
//         var args = Array.prototype.slice.call(arguments, 1);
//         if(config.get('state')){
//             var str = '';
//             args.forEach((arg, i) => {
//                 if(i < 1){
//                     str += arg;
//                 }else{
//                     str += '\n' + arg;
//                 }
//             });
//             console.log('\n' + new Date() + '\n' + str);
//             return true;
//         }
//         return false;
//     }catch(err){
//         console.log('Logging failed: ' + err);
//         return false;
//     }
// };