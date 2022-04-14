const router = require("express").Router()
const InvalidMethod = require("../error/InvalidMethodError")
const cardController = require("./cards.controller")

router.route("/")
    .get(cardController.list)
    .post(cardController.create)
    .all(InvalidMethod)

router.route("/:cardId")
    .get(cardController.read)
    .put(cardController.update)
    .delete(cardController.delete)
    .all(InvalidMethod)

module.exports = router