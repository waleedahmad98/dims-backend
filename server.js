const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const routes = require("./routes") // new

mongoose
	.connect(`mongodb+srv://DIMSBackend:sRWy0dZPqrLALeGA@dims.0o9s1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, { useNewUrlParser: true })
	.then(() => {
		const app = express()
		app.use(cors())
		app.use(bodyParser.urlencoded({ extended: false }))
		app.use(bodyParser.json())
		app.use("/api", routes) // new

		app.listen(process.env.PORT || 3000, () => {
			console.log(`Server has started on port ${port}`)
		})
	})