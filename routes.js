const express = require("express")
const router = express.Router()
const {saveKey, getKey, putVerifiableCredential, getVerifiableCredentials, getAllVerifiableCredentials, deleteVerifiableCredential, getAllUnverified} = require("./controller")

router.post("/save", async (req, res) => {
    const resp = await saveKey(req.body.stxAddress, req.body.publicKey)
    console.log(resp)
    res.send(resp)
})

router.get("/getKey/:address", async (req, res) => {
    const resp = await getKey(req.params["address"])
    if (resp["code"] === 1)
        res.send(resp["key"]);
    else
        return null;
})

router.post("/share", async (req, res) => {
    const resp = await putVerifiableCredential(req.body.sender, req.body.txid, req.body.signature, req.body.rcvr);
    res.send(resp);
})

router.get("/sharedDocs/:address", async (req, res) => {
    const resp = await getVerifiableCredentials(req.params["address"]);
    res.send(resp);
})

router.get("/docs/:address", async (req, res) => {
    const resp = await getAllVerifiableCredentials(req.params["address"]);  
    res.send(resp);
})

router.delete("/docs", async (req, res) => {
    const resp = await deleteVerifiableCredential(req.body.objectid);
    res.send(resp)
})

module.exports = router