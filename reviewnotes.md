# Backend/Database Step-by-Step Workthrough

## Table of Contents: 
1. [Introduction](#introduction)
2. [Backend: Node.js](#backend-nodejs)
    1. [Setup: `Command Line` (from blank folder)](#setup-command-line-from-blank-folder)
    2. [Setup: src/server.js (server code)](#setup-srcserverjs-server-code)
    3. [Setup: src/app.js (application code)](#setup-srcappjs-application-code)
    4. [Setup: `Cors`](#setup-cors)
    5. [Run Express Server: Command Line
](#run-express-server-command-line)
        - [DEBUGGER / NODEMON](#debugger--nodemon)
    6. [Generic Error Handler](#generic-error-handler)
    7. [Not Found Handler](#not-found-handler)
    8. [Middleware Review](#middleware-review)
    9. [Task: Quick Inline Middleware Test: `src/app.js`](#task-quick-inline-middleware-test-srcappjs)
        - [QUICK INLINE MIDDLEWARE TEST: POST](#quick-inline-middleware-test-post)

## Introduction
This is not a README file, but these are the typed version of my step-by-step notes of making a Backend project from scratch that I have writen down for studying purposes. I'm adding this to the repository moreso for myself and so I can refer to the steps and fix any incorrect statements or issues.

## Backend: Node.js
 
### Setup: `Command Line` (from blank folder)

1. Initialize a new project
2. Install express modules
```
npm init -y
npm install express
```

### Setup: `src/server.js` (server code)
```js
const { PORT = 5000 } = process.env // gets PORT *environment variable*. 5000 by default.
const app = require("./app") //file will be created next step
const callback = `Listening at port ${PORT}` // function called when booting up express app. typically a logger.
app.listen(PORT, callback) // start express app.
```

### Setup: `src/app.js` (application code)
```js
const express = require("express") // sets express variable
const app = express() // code for express application instance
app.use(express.json()) // for handling JSON body types. Required.
module.exports = app // for use in `src/server.js`
```

### Setup `CORS`: 
1. Install from `Command Line:`
```
npm install cors
```
2. Add in `src/app.js`:
```js
const cors = require("cors") // gets the installed cors module
app.use(cors()) // enable CORS globally for whole API
    // you can use this temporarily for testing
    // remove this code eventually if you don't want an open API
```
### Run Express Server: `Command Line`
How to run express application
```
node src/server.js
```
To have this as a "start" shortcut for the command line, put this in `"scripts"` in `package.json` file: 
```json
"start": "node src/server.js",
```
#### DEBUGGER / NODEMON
You can use `nodemon` (not `nodeman`) to rerun server upon saving

Install: 
```
npm install nodemon --save-dev
```
Run:
```
nodemon src/server.js
```

### Generic Error Handler: 
1. Create a folder called `src/errors/` that will house error files.
2. Created `src/errors/ErrorHandler.js` file. Will house generic error function
    - `errorHandler()` is called anytime a middleware uses `next()` method with arguments
        - ex: `next({status: 404, message: "Item not found."})`
3. Generic error functions have FOUR parameters instead of three
    - Extra parameter: `error`: the error that other functions have passed.
    - Error codes should have a `status` and a `message` to know what's going on.
        - `status` set to 500 by default: server error
```js
function errorHandler(error, request, response, next) {
    const { status = 500, message = "Internal server error" } = error;
    response.status(status).json({ error: message })
}
module.exports = errorHandler
```
5. Within `app.js`, import errorHandler and write in `app.use(errorHandler)` at the end before `module.exports`

### Not Found Handler
1. Created `src/errors/NotFound.js` file. Will house generic error function
2. Write in notFound error function within it

```js
function notFound(request, response, next) {
    return next({ status: 404, message: `Path not found: ${request.originalUrl}` })
}
module.exports = notFound
```
3. Within `app.js`, import notFound and write in `app.use(notFound)` just before `app.use(errorHandler)`
4. Note: `request.originalUrl` is the URL path that the user is calling to.

### Middleware Review
- Middleware is used as function that operates between request and response
- Underlying business logic of an express prgram
- Middleware function format:
```js
function middlewareName(request, response, next) {
    /* FUNCTION BODY */
}
```
- Middleware parameters:
    - `request`: info/functions related to incoming requests as an object
    - `response`: info/functions relating to outgoing responses as an object
    - `next`: function symbolizing middleware is complete
        - you don't use `return` in a middleware function
        - putting parameters in `next()` will go to the `errorHandler` middleware directly
- Two ways to end a middleware function:
    1. Give a response via `response.sendStatus()`, `response.json()`, `response.status().json()`, etc.
    2. Call `next()` to either go to the next midddleware function (if empty arguments) or `errorHandler` middleware (if not empty arguments)

### Task: Quick Inline Middleware Test: `src/app.js`
- Inline request used to make sure can do a generic request in the first place
- Don't want to get too far deep in the weeds and have a fundamental error (like missing `app.use(express.json())`
- Example used: generic POST request.
    - POST request doesn't exactly make anything or connect to anything
    - useful for making sure that don't run into 500 or 404 errors.
    - don't worry about validation just yet.
- Example code:
```js
let newId = 1; // just to simulate a new ID. temporary
app.post("/decks", ((req, res) => {
    const { data } = req.body // gets the data from the body
    const newDeck = {
        deck_id: ++newId, // iterates through ID
        ...data // gets all of the deck information that you put in.
    }
    res.status(201).json({ data: newDeck }) // status: 201; message: { data: { [new deck information] }}
}))
```

#### QUICK INLINE MIDDLEWARE TEST: POST

Using Postman to make a post to `"/decks"` with the following data:

```json
{
    "data" : {
        "front": "backend terms",
        "back": "this is terms for the backend"
    }
}
```
**Returns:** `status: 201`
```json
{
  "data": {
    "deck_id": 3,
    "front": "backend terms",
    "back": "this is terms for the backend"
  }
}
```