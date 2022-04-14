const express = require("express")

const app = express()
app.use(express.json())

const deckRouter = require("./decks/decks.router")
const cardRouter = require("./cards/cards.router")

app.use("/decks", deckRouter)
app.use("/cards", cardRouter)

app.use((request, response, next) => {
    next(NotFoundError(`Page not found: ${request.originalUrl}`))
})

app.use((error, request, response, next) => {
    const { status = 500, message = "Something went wrong!" } = error
    response.status(status).json({ error: message })
})
module.exports = app