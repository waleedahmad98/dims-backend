const mongoose = require("mongoose")

const schema = mongoose.Schema({
	senderAddress: String,
	txid: String,
    signature: String,
    sharedWith: String,
    result: String,
})

module.exports = mongoose.model("verifiedCredential", schema)