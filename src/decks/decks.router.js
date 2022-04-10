const router = require("express").Router()
const InvalidMethod = require("../error/InvalidMethodError")
const Deck = require("./decks.controller")

router.route("/").get(Deck.list).post(Deck.create).all(InvalidMethod)

router.route("/:deckid")
    .get(Deck.read)
    .put(Deck.update)
    .delete(Deck.delete)
    .all(InvalidMethod)

module.exports = router