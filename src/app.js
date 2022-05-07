const express = require("express")
const errorHandler = require("./errors/ErrorHandler")
const notFoundError = require("./errors/NotFound")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json());

let newId = 1;
app.post("/decks", ((req, res) => {

    const { data } = req.body

    const newDeck = {
        deck_id: ++newId,
        ...data
    }

    res.status(201).json({ data: newDeck })
}))

app.use(notFoundError)
app.use(errorHandler)

module.exports = app