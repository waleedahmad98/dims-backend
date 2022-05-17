const express = require("express")
const router = express.Router()
const {saveKey, getKey, putVerifiableCredential, getVerifiableCredentials, getAllVerifiableCredentials, deleteVerifiableCredential, putVerifiedCredential, getPrevVerifiedCred, deleteVerifiedCredential} = require("./controller")

router.post("/save", async (req, res) => {
    const resp = await saveKey(req.body.stxAddress, req.body.publicKey)
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

router.post("/move", async (req, res) => {
    const resp = await putVerifiedCredential(req.body.sender, req.body.txid, req.body.signature, req.body.rcvr, req.body.result);
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

router.delete("/docsvc", async (req, res) => {
    const resp = await deleteVerifiedCredential(req.body.objectid);
    res.send(resp)
})

router.get("/history/:address", async(req, res)=>{
    const resp = await getPrevVerifiedCred(req.params["address"]);
    res.send(resp)
})

module.exports = router