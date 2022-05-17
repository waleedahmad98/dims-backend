const res = require("express/lib/response");
const publicKey = require("./models/publicKey")
const verifiableCredential = require("./models/verifiableCredential");
const verifiedCredential = require("./models/verifiedCredential");

const saveKey = async (stxAddress, pKey) => {
	const checkAddress = await publicKey.exists({ stxAddress: stxAddress });
	const checkKey = await publicKey.exists({ stxAddress: stxAddress, publicKey: pKey });

	try {
		if (!checkKey && !checkAddress) {
			const pKeyMap = new publicKey({
				stxAddress: stxAddress,
				publicKey: pKey,
			})
			await pKeyMap.save()
		}
		else if (checkAddress && !checkKey) {
			await publicKey.deleteMany({ stxAddress: stxAddress });
			const pKeyMap = new publicKey({
				stxAddress: stxAddress,
				publicKey: pKey,
			})
			await pKeyMap.save()

		}
		else {
			console.log("Key already exists")
		}
		return { "code": 1, "message": "success" }
	}
	catch (e) {
		console.log(e);
		return { "code": -1, "message": "save error" }
	}

}

const getKey = async (address) => {
	const key = await publicKey.findOne({ stxAddress: address })
	if (key !== null)
		return { "code": 1, "message": "success", "key": key }
	else
		return { "code": -1, "message": "key not found" }

}

const putVerifiableCredential = async (sender, txid, signature, rcvr) => {
	try {
		const checkExist = await verifiableCredential.exists({ senderAddress: sender, txid: txid, signature: signature, sharedWith: rcvr });
		if (!checkExist) {
			const object = new verifiableCredential({
				senderAddress: sender, txid: txid, signature: signature, sharedWith: rcvr
			})
			await object.save()
		}
		return { "code": 1, "message": "success" }
	}
	catch (e) {
		console.log(e)
		return { "code": -1, "message": "save error" }
	}
}

const putVerifiedCredential = async (sender, txid, signature, rcvr, result) => {
	try {
		const checkExist = await verifiedCredential.exists({ senderAddress: sender, txid: txid, signature: signature, sharedWith: rcvr, result: result });
		if (!checkExist) {
			const object = new verifiedCredential({
				senderAddress: sender, txid: txid, signature: signature, sharedWith: rcvr, result: result
			})
			await object.save()
		}
		return { "code": 1, "message": "success" }
	}
	catch (e) {
		console.log(e)
		return { "code": -1, "message": "save error" }
	}
}

const getVerifiableCredentials = async (address) => {
	const vc = await verifiableCredential.find({ sharedWith: address })
	if (vc !== null)
		return { "code": 1, "message": "success", "vc": vc }
	else
		return { "code": -1, "message": "vc not found" }

}

const getAllVerifiableCredentials = async (address) => { //gets both verifial and verified
	const vc = await verifiableCredential.find({ senderAddress: address })
	const hist_vc = await verifiedCredential.find({ senderAddress: address })
	for (let i=0; i<hist_vc.length; i++){
		vc.push(hist_vc[i]);
	}
	if (vc !== null)
		return { "code": 1, "message": "success", "vc": vc }
	else
		return { "code": -1, "message": "vc not found" }
}

const deleteVerifiableCredential = async (objectid) => {
	await verifiableCredential.deleteOne({ _id: objectid })
}

const deleteVerifiedCredential = async (objectid) => {
	await verifiedCredential.deleteOne({ _id: objectid })
}

const getPrevVerifiedCred = async (sharedWith) => {
	const vc = await verifiedCredential.find({sharedWith: sharedWith});
	return vc;
}

module.exports = { saveKey, getKey, putVerifiableCredential, getVerifiableCredentials, getAllVerifiableCredentials, deleteVerifiableCredential, getPrevVerifiedCred, putVerifiedCredential, deleteVerifiedCredential }