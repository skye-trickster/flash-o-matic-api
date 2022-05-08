const router = require("express").Router()
const controller = require("./decks.controller")
const methodNotAllowed = require("../errors/methodNotAllowed")

router.route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed)

module.exports = router