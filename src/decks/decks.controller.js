const decks = require("../data/decks-data")
const controller = require("../controlledobject")

let lastId = decks.reduce((maxId, paste) => Math.max(maxId, paste.id), 0)
const d = controller(decks, lastId, {
    paramName: "deckId",
    requiredProperties: ["name", "description"]
})

module.exports = d;
/*
class Deck {
    constructor({ name = "", description = "", id = 0 } = {}) {
        this.name = name
        this.description = description
        this.id = id
    }

    validate() {
        function validateParameter(attributeName, attr) {
            if (!attr)
                throw new ValidationError(`Invalid ${attributeName} attribute!`)

            return true
        }
        return validateParameter("name", this.name) && validateParameter("description", this.description)
    }

    serialize() {
        return {
            id: this.id,
            name: this.name,
            description: this.description
        }
    }

    save(referenceDeck, validate = true) {
        if (validate) this.validate()

        let deck = undefined
        if (referenceDeck)
            deck = referenceDeck
        else if (this.id)
            deck = Deck.find(this.id)
        else {
            deck = decks[decks.push(new Deck({ id: Deck.nextId() })) - 1]
            this.id = deck.id
        }

        deck.name = this.name
        deck.description = this.description
        return this
    }

    // Static Helper Methods

    static getAll() {
        return decks.map(deck => new Deck(deck))
    }

    static find(id, findIndex = false) {

        const index = decks.findIndex((deck) => deck.id === Number(id))
        const found = index === -1 ? null : decks[index]
        if (findIndex) return { index: index, found: found }
        return found
    }

    static latestId = decks.reduce((id, deck) => Math.max(id, deck.id), 0)

    static nextId() { return ++Deck.latestId }

    static get(request, response) {
        return response.status(200).json(Deck.getAll().map(deck => deck.serialize()))
    }

    static validId(request, response, next) {
        const { index, found } = Deck.find(request.params.deckid, true)

        if (found) {
            response.locals.deck = new Deck(found)
            response.locals.deckReference = found
            response.locals.deckIndex = index
            return next()
        }

        next(new ErrorCode(404, `ID not found: ${request.params.deckid}`))
    }

    static getDeckById(request, response) {
        return response.send({ data: response.locals.deck.serialize() })
    }


    static validateAttribute(attribute) {
        return function (request, response, next) {
            const { data } = request.body
            if (data && data[attribute]) {
                response.locals[attribute] = data[attribute]
                return next()
            }
            return next(new ErrorCode(400, `Missing or invalid attribute: ${attribute}`))
        }
    }

    static newDeck(request, response, next) {
        response.locals.deck = new Deck()
        next()
    }

    static updateDeck(request, response, next) {
        try {
            const deck = response.locals.deck

            deck.name = response.locals.name
            deck.description = response.locals.description

            deck.save(response.locals.deckReference)

            return response.json(deck.serialize())
        } catch (error) {
            return next(new ErrorCode(400, error.message))
        }
    }

    static destroy(request, response, next) {
        decks.splice(response.locals.deckIndex, 1)
        return response.sendStatus(204)
    }

    static list = [this.get]
    static read = [this.validId, this.getDeckById]

    static attributeValidation = [
        this.validateAttribute("name"),
        this.validateAttribute("description")
    ]

    static update = [
        this.validId,
        ...this.attributeValidation,
        this.updateDeck
    ]
    static create = [
        ...this.attributeValidation,
        this.newDeck,
        this.updateDeck
    ]

    static delete = [
        this.validId,
        this.destroy
    ]
}

module.exports = Deck*/