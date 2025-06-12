let mongoose = require('mongoose');

let menuSchema = new mongoose.Schema({
    text: {
        type: String
    }, url: {
        type: String,
        default: ""
    },
    parent: {
        type: mongoose.Types.ObjectId,
        ref: 'menu'
    }
}, {
    timestamps: true
})
module.exports = mongoose.model('menu', menuSchema);