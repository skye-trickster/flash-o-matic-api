const ErrorCode = require("./error/ErrorCodes");

class ControlledObject {
    constructor(controlledList) {
        this.list = controlledList
    }

    get() { return this.list }
    filter(key, value) { return this.list.filter((item) => item[key] === value) }

    findById(id, findIndex = false) {
        const result = { item: undefined, index: undefined }
        result.item = this.list.find((item, index) => {
            if (item.id !== id) return false
            if (findIndex) result.index = index
            return true
        })
        return findIndex ? result : result.item
    }

    deleteById(id) {
        const index = this.findById(id, true).index
        const deleted = this.list.splice(index, 1)
        return deleted
    }

    static getAll(object) {
        return function (request, response) {
            response.json({ data: object.get() })
        }
    }

    static requiredPropertyCheck(properties) {
        const functions = []
        for (let prop in properties)
            functions.push(this.bodyHasPropertyName(properties[prop]))

        return functions
    }

    static bodyHasPropertyName(property) {
        return function (request, response, next) {
            const { data = {} } = request.body;

            if (data[property]) return next()
            next(new ErrorCode(404, `Must include ${property} property`))
        }
    }

    static objectExists(object, param) {
        return function (request, response, next) {
            const id = request.params[param]
            const found = object.findById(Number(id), true)

            if (found.item) {
                response.locals.item = found.item
                response.locals.index = found.index
                return next()
            }

            next(new ErrorCode(404, `Item ID not found: ${id}`))
        }
    }

    static read(request, response) {
        response.json({ data: response.locals.item })
    }

    static update(request, response) {
        const foundItem = response.locals.item
        const { data } = request.body

        for (let param in data) {
            foundItem[param] = data[param]
        }

        response.json({ data: foundItem })
    }

    static create(object, lastId) {
        return function (request, response) {
            const { data = {} } = request.body
            const newItem = {
                ...data,
                id: ++lastId
            }
            object.list.push(newItem)
            response.status(201).json({ data: newItem })
        }
    }

    static delete({ list }) {
        return function (request, response) {
            const deleted = list.splice(response.locals.index, 1)
            response.sendStatus(204)
        }
    }

}

const controller = (list, lastId, { paramName = "id", requiredProperties = [] } = {}) => {

    const item = new ControlledObject(list)
    return {
        item,
        list: [ControlledObject.getAll(item)],
        create: [
            ControlledObject.requiredPropertyCheck(requiredProperties),
            ControlledObject.create(item, lastId)
        ],
        read: [
            ControlledObject.objectExists(item, paramName),
            ControlledObject.read
        ],
        update: [
            ControlledObject.objectExists(item, paramName),
            ControlledObject.requiredPropertyCheck(requiredProperties),
            ControlledObject.update
        ],
        delete: [
            ControlledObject.objectExists(item, paramName),
            ControlledObject.delete(item)
        ]
    }
}

module.exports = controller