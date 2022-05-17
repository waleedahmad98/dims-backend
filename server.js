const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const routes = require("./routes") // new
const port = process.env.PORT || 8000;
mongoose
	.connect(process.env.MONGO_URL, { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use(cors())
		app.use(bodyParser.urlencoded({ extended: false }))
		app.use(bodyParser.json())
		app.use("/api", routes) // new

		app.listen(port, () => {
			console.log(`Server has started on port ${port}`)
		})
	})