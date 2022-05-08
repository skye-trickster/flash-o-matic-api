
let newId = 1;
const decks = []
async function create(request, response) {

    const { data } = request.body
    const newDeck = {
        deck_id: newId++,
        ...data
    }
    decks.push(newDeck)

    response.status(201).json({ data: newDeck })
}

async function list(request, response) {
    response.json({ data: decks })
}

module.exports = {
    list,
    create

}