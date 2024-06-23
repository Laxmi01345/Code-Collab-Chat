// code.model.js
const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    codes: [
        {
            code: {
                type: String, // Assuming code is a string
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Code = mongoose.model('Code', codeSchema);

module.exports = Code;
