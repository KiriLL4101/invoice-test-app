const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    owner:{type: Types.ObjectId, ref: 'User'},
    title: {type: String, required:true},
    desc:{type: String, required: true},
    date:{type: Date, default:Date.now}
})

module.exports = model('Terminal', schema)