const express = require("express")
const errorHandler = require("./errors/errorHandler")
const notFoundError = require("./errors/notFound")
const cors = require("cors")
const decksRouter = require("./decks/decks.router")

const app = express()

app.use(cors())
app.use(express.json());

app.use("/decks", decksRouter); // call decks router for path "/decks"

app.use(notFoundError)
app.use(errorHandler)

module.exports = app