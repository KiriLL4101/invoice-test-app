const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    username: {type: String, required:true, unique: true},
    password:{type: String, required: true},
    terminals:[{ type: Types.ObjectId, ref: 'Terminal'}],
    buyers:[{ type: Types.ObjectId, ref: 'Buyer'}]
})

module.exports = model('User', schema)