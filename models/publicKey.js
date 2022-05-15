const mongoose = require("mongoose")

const schema = mongoose.Schema({
	stxAddress: String,
	publicKey: String,
})

module.exports = mongoose.model("publicKey", schema)