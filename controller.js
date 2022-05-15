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

const getVerifiableCredentials = async (address) => {
	const vc = await verifiableCredential.findOne({ sharedWith: address })
	if (vc !== null)
		return { "code": 1, "message": "success", "vc": vc }
	else
		return { "code": -1, "message": "vc not found" }

}

const getAllVerifiableCredentials = async (address) => {
	const vc = await verifiableCredential.find({ senderAddress: address })
	if (vc !== null)
		return { "code": 1, "message": "success", "vc": vc }
	else
		return { "code": -1, "message": "vc not found" }
}

const deleteVerifiableCredential = async (objectid) => {
	await verifiableCredential.deleteOne({ _id: objectid })
}

const getAllUnverified = async () => {
	const uvc = await verifiableCredential.find();
	return uvc;
}

const verifyCred = async (id) => {
	try {
		const vc = await verifiableCredential.findOne({ _id: id });
		await verifiableCredential.deleteOne({ _id: id });
		const object = new verifiedCredential({
			senderAddress: vc.sender, txid: vc.txid, signature: vc.signature, sharedWith: vc.rcvr
		})
		await object.save()
		return { "code": 1, "message": "success" }
	}
	catch (e){
		console.log(e)
		return { "code": -1, "message": "error" }
	}

}

const getPrevVerifiedCred = async () => {
	const vc = await verifiedCredential.find();
	return vc;
}

module.exports = { saveKey, getKey, putVerifiableCredential, getVerifiableCredentials, getAllVerifiableCredentials, deleteVerifiableCredential, getAllUnverified, verifyCred, getPrevVerifiedCred }