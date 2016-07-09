const mongoose          = require('mongoose');
const Schema            = mongoose.Schema;

const DecorationSchema    = new Schema({
    abbreviation: {
        fi: {
            type: String,
            required: true,
            unique: true,
            validation: /^(?=.*[a-zA-Z])[a-zA-Z0-9ÄÖÅ]{2,16}$/
        },
        en: {
            type: String,
            required: true,
            unique: true,
            validation: /^(?=.*[a-zA-Z])[a-zA-Z0-9]{2,16}$/
        }
    },
    title: {
        fi: {
            type: String,
            validation: /^[a-zA-Z0-9 äÄöÖåÅ]{2,48}$/
        },
        en: {
            type: String,
            validation: /^[a-zA-Z0-9 ]{2,48}$/
        }
    },
    description: {
        fi: {
            type: String,
            validation: /^[a-zA-Z0-9äÄöÖåÅ!?–— '"-.,*()]{2,2048}$/
        },
        en: {
            type: String,
            validation: /^[a-zA-Z0-9!?–— '"-.,*()]{2,2048}$/
        }
    }
}, { strict: true });

module.exports = mongoose.model('Decoration', DecorationSchema);