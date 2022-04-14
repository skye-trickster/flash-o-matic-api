const controller = require("../controlledobject");
const cards = require("../data/cards-data")



//const cardControl = new ControlledObject(cards)

// find the largest ID and assigns lastId to it.
let lastId = cards.reduce((maxId, paste) => Math.max(maxId, paste.id), 0)

const c = controller(cards, lastId,
    {
        paramName: "cardId",
        requiredProperties: ["front", "back"]
    }
)

module.exports = c;
/*
module.exports = {
    list: [ControlledObject.getAll(cardControl)],
    create: [
        ControlledObject.requiredPropertyCheck(["front", "back"]),
        ControlledObject.create(cardControl, lastId)
    ],
    read: [
        ControlledObject.objectExists(cardControl),
        ControlledObject.read
    ],
    update: [
        ControlledObject.objectExists(cardControl),
        ControlledObject.update
    ],
    delete: [
        ControlledObject.objectExists(cardControl),
        ControlledObject.delete(cardControl)
    ]
}*/