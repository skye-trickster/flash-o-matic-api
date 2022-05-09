# Backend/Database Step-by-Step Workthrough

## Table of Contents: 
1. [Introduction](#introduction)
2. [Node.js: Setup](#nodejs-setup)
    1. [Setup: `Command Line` (from blank folder)](#setup-command-line-from-blank-folder)
    2. [Setup: src/server.js (server code)](#setup-srcserverjs-server-code)
    3. [Setup: src/app.js (application code)](#setup-srcappjs-application-code)
    4. [Setup: `Cors`](#setup-cors)
    5. [Run Express Server: Command Line
](#run-express-server-command-line)
        - [DEBUGGER / NODEMON](#debugger--nodemon)
    6. [Generic Error Handler](#generic-error-handler)
    7. [Not Found Handler](#not-found-handler)
    8. [MethodNotFound Handler](#methodnotfound-handler)
3. [Request and Response Review](#request-and-response-review)
    1. [Review: Common HTTP Request Methods](#review-common-http-request-methods)
    2. [Review: Response Codes
](#review-response-codes)
4. [`Node.js`: Creating Middleware Functions](#nodejs-creating-middleware-functions)
    1. [Review: Middleware](#review-middleware)
    2. [Task: Quick Inline Middleware Test: `src/app.js`](#task-quick-inline-middleware-test-srcappjs)
        - [QUICK INLINE MIDDLEWARE TEST: POST](#quick-inline-middleware-test-post)
    3. [Making `.router.js` and `.controller.js` Files](#making-routerjs-and-controllerjs-files)
        - [Import Router: `src/app.js`](#import-router-srcappjs)
        - [Add middleware functions: `src/decks/decks.controller.js`](#add-middleware-functions-srcdecksdeckscontrollerjs)
        - [Add router code: `src/decks/decks.router.js`](#add-router-code-srcdecksdecksrouterjs)


## Introduction
This is not a README file, but these are the typed version of my step-by-step notes of making a Backend project from scratch that I have writen down for studying purposes. I'm adding this to the repository moreso for myself and so I can refer to the steps and fix any incorrect statements or issues.

**[[Back To Top]](#backenddatabase-step-by-step-workthrough)**

## Node.js: Setup
 
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
1. Created `src/errors/NotFound.js` file. Will house function for paths that aren't implemented.
2. Write in notFound error function within the file.

```js
function notFound(request, response, next) {
    return next({ status: 404, message: `Path not found: ${request.originalUrl}` }) // yields a 404 error: Path not found
}
module.exports = notFound
```
3. Within `app.js`, import notFound and write in `app.use(notFound)` just before `app.use(errorHandler)`
4. Note: `request.originalUrl` is the URL path that the user is calling to.

### MethodNotFound Handler
- Handler used for request methods that are not supported on a particular route.
- usually imported in router files.
- Create `src/errors/methodNotFound.js` file. Will house methodNotFound method
```js
function methodNotFound(request, response, next) {
    next({
        status: 405,
        message: `Requested method invalid: ${request.method}`
    }) // yields a 405 error: Invalid Method
}
```

**[[Back To Top]](#backenddatabase-step-by-step-workthrough)**

## Request and Response Review

### Review: Common HTTP Request Methods
Method | Meaning 
:--- | :----
`GET` | Request a resource. Only retrieve data.
`POST` | Submits entity to resource. Has side effects (ex. object creation)
`PUT` | Replace a target representative with request payload
`DELETE` | Deletes requested resource.
`OPTIONS` | Communication options. Useful for CORS and pre-flight especially
`PATCH` | Partially Modify a resource.

### Review: Response Codes

Response Classes:
Code Class | Class Meaning
:---- | :----
`100-199` | Information response 
`200-299` | Successful response / process
`300-399` | Redirect to another URL
`400-499` | Client error, problem with how request was sent
`500-599` | Server error. Good request but server issues.

Common response codes:
Code | Text | Code Meaning
:---- | :----: | :-----
`200` | `OK` | Request successful
`201` | `CREATED` | Resource was created
`204` | `NO CONTENT` | Request successful, but nothing returned; useful for `DELETE` requests
`400` | `BAD REQUEST` | Unable to Process (ex. bad syntax, invalid data, etc.)
`403` | `FORBIDDEN` | You lack the permissions to make the request 
`404` | `NOT FOUND` | Resource unable to be found
`405` | `METHOD NOT ALLOWED` | Request method not supported by target
`500` | `INTERNAL SERVER ERROR` | Unexpected failure, lack of specific information

**[[Back To Top]](#backenddatabase-step-by-step-workthrough)**

## `Node.js`: Creating Middleware Functions

### Review: Middleware
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
        - `return` doesn't go to the next middleware function 
            - you can use `return next()` to finish the middleware early and go to the next middleware though
        - putting parameters in `next()` will go to the `errorHandler` middleware directly
- Two ways to end a middleware function:
    1. Give a response via `response.sendStatus()`, `response.json()`, `response.status().json()`, etc.
    2. Call `next()` to either go to the next midddleware function (if empty arguments) or `errorHandler` middleware (if not empty arguments)
- **ORDER MATTERS FOR ROUTING/MIDDLEWARE FUNCTIONS**

### Task: Quick Inline Middleware Test: `src/app.js`
- Inline request used to make sure can do a generic request in the first place
- Don't want to get too far deep in the weeds and have a fundamental error (like missing `app.use(express.json())`
- Example used: generic POST request.
    - POST request doesn't exactly make anything or connect to anything
    - useful for making sure that don't run into 500 or 404 errors.
    - don't worry about validation just yet.
- Example code:
```js
/// NOTE: CODE WILL EVENTUALLY MOVE TO SRC/DECKS/DECKS.CONTROLLER.JS

let newId = 1; // just to simulate a new ID. temporary until linking to database
app.post("/decks", ((req, res) => {
    const { data } = req.body // gets the data from the body
    const newDeck = {
        deck_id: newId++, // iterates through ID
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
        "back": "these are terms for the backend"
    }
}
```
**Returns:** `status: 201`
```json
{
  "data": {
    "deck_id": 3,
    "front": "backend terms",
    "back": "these are terms for the backend"
  }
}
```

**[[Back To Top]](#backenddatabase-step-by-step-workthrough)**

### Making `.router.js` and `.controller.js` Files
Two ways of organizing router code:
1. Have anonymous functions within router code (not what I'm doing)
```js
router.route("/").get((request, response) => {}) //all in deck.router.js
```
2. Have middleware functions separated in another file `src/decks.controller.js` (what I'm doing):
```js
function list(request, response) {} //will eventually be in deck.controller.js
router.route("/").get(list) // will be in deck.router.js
```
- Every table object (decks, cards, users, etc.) should have their own folder in `src` (ex. `src/decks/`, `src/cards`, `src/users`, etc.).
- Every table object should have a `.router.js` file and a `.controller.js` file.
    - `src/decks/decks.router.js`: handles routing
    - `src/decks/decks.controller.js`: handles middleware functions.

#### Import Router: `src/app.js`
- Cut inline function out of `app.js` and paste into `src/decks/decks.controller.js`. Will be useful there.
- Replace old inline function in app.js with the router import:
- import router file with `const decksRouter = require("./decks/router")` (will do this for every route that comes from the base URL)
- Add route to `deckRouter` using the following: 
```js
app.use("/decks", deckRouter)
    // deckRouter will handle all routing in all paths starting with "/decks"
    // make sure to put this ABOVE notFound and errorHandler.
    // ORDER MATTERS
```

#### Add middleware functions: `src/decks/decks.controller.js`
- `src/decks/decks.controller.js` is where middleware functions go.
- handles business logic with requests and responses. doesn't handle router code at all. 
- Move previous inline function into `decks.controller.js` as `create()`, including `newId`
```js
let newId = 1; // still just to simulate a new ID. temporary until linking to database
function create = (request, response) => {
    const { data } = request.body // gets the data from the body
    const newDeck = {
        deck_id: newId++, // iterates through ID
        ...data // gets all of the deck information that you put in.
    }
    response.status(201).json({ data: newDeck }) 
        // status: 201; message: { data: { [new deck information] }}
}

module.exports = { create } 
    // export for use in decks.router.js
    // call create() function by calling controller.create()
```

#### Add router code: `src/decks/decks.router.js`
- `src/decks/decks.router.js` handles all routing code.
- handles all of the pathing and assigning what middleware function is called for what request.
```js
const router = require("express".Router()) // router object for routing
const controller = require("./decks.controller") // controller middleware functions
const methodNotAllowed = require("../errors/methodNotAllowed") // For functions that aren't allowed or implemented yet.

router.route("/")               // for path "/decks/"
    .post(controller.create)    // call controller.create() for POST request
    .all(methodNotAllowed)      // reject any other request

module.exports = router         // for linking to app.use in other files like app.js
```

**[[Back To Top]](#backenddatabase-step-by-step-workthrough)**

### Second Request: `GET` Request
Objectives:
- Make a `list()` middleware function that responds with all decks
- call `list()` upon making a `GET` request to `/decks`

#### Middleware: `src/decks/decks.controller.js`
1. make empty list `decks = []` for storing all decks
2. Add ability to push a deck into `decks` with `create()` middleware
    - NOTE: ensure to put it BEFORE `response.status`
3. make function `list()` that sends JSON repsonse of decks
4. add list function in `module.exports`
```js
const decks = [] // deck list. Will represent our fake database for now.

function list(request, response, next) { // will be called upon GET method
    response.json({ data: decks }) // will show all decks 
}

// ... CODE IN BETWEEN REMAINS UNTOUCHED

function create(request, response, next) {
    // ... CODE REMAINS UNTOUCHED UNTIL NEXT LINES (still makes a newDeck) 

    decks.push(newDeck) // push newDeck in decks after creating newDeck
    
    response.status(201).json({ data: newDeck }) // unchanged. make sure to make the decks.push() BEFORE this line.
}

module.exports = {
    create, // create is still here.
    list // call list() function by calling controller.list
}

```

#### Router: `src/decks/decks.controller.js`
- add `.get()` method within the router
```js
// ... ABOVE CODE REMAINS UNCHANGED
router.route("/")
    .post(controller.create)    // this part is unchanged
    .get(controller.list)       // make sure to add this BEFORE .all()
    .all(methodNotAllowed)      // unchanged again

module.exports = router
```

## Database Setup

### Creating a database
- [ElephantSQL](https://www.elephantsql.com/) is a good service for PostgreSQL
- [DBeaver](https://dbeaver.com/) is a good GUI tool for databases.
- will not be making instructions on how to create a database instance through ElephantSQL nor setting up DBeaver at this time.
- If want to review SQL, check out the [SQLReview](SQLReview.md) notes.

### Knex Setup/Config: `Command Line`
1. Install knex library and node-postgress database library:
```
npm install knex pg
```
2. Install `dotenv` to use environment variables in code
    - Note 1: you can set environment variables using `.env` file
```
npm install dotenv
```
3. Initialize a new `knexfile.js` to be used in database config
```
npm knex init
```
4. Create a new `.env` file and set your database url inside
```env
DATABASE_URL=[Your database url here without brackets]
```

### Knex `knexfile.js` Setup / Config
- Remember to setup configuration of dotenv library with `require("dotenv")`
- dotenv saves the list of environment variables to `process.env`
- this is where you set your deployment configuration (client, connection, seeds, migrations, etc.)
```js
require("dotenv").config() // start configuring the dotenv library

const {
  DATABASE_URL 
    // will grab the DATABASE_URL from the environment files
} = process.env // list of environmental variables


module.exports = { // exports the knex configuration.

  development: { // development config
    client: 'postgres', // set to the SQL language you're using (using postgres for these notes)
    connection: DATABASE_URL, // sets the database connection based on environment variables.
  },
  // ... have a config for staging and production as well.
  // will focus just on development for now
}
```

Another way to set the DATABASE_URL:

In `.env`
```env
DEPLOYMENT_TYPE=development
DATABASE_URL_DEV=[Development URL here]
DATABASE_URL_PROD=[Production URL here]
```
In `knexfile.js`
```js
const URL = process.env['DEPLOYMENT_TYPE'] = 'production' ? 
    process.env.DATABASE_URL_DEV
    : process.env.DATABASE_URL_PROD
```

### Migrations

- Migrations are used to make changes to a database schema
    - migrations are essentially version control for databases
    - migrations are **not** used for adding entries to existing tables
- Migrations should only have a single action (ex: creating `decks` table)
    - Migration action should be in file name (ex: `createDecksTable`)
- use `npx knex make createDecksTable` to create new migration
    - will make a new migration with timestamp of creation within `migrations/` folder(ex: `20220509030617_createDecksTable`)
- Migration files come with two export functions:
    1. `exports.up`: function to make migration changes
    2. `exports.down`: function to undo changes in `exports.up`
- Make sure to do BOTH exports.up and exports.down

#### Migration Functions: `Command Line`

1. Make a new migration (example: `createDecksTable`)
```
npx knex migrate:make createDecksTable
```
2. Run all migrations
```
npx knex migrate:latest
```
3. Rollback latest migration
```
npx knex migrate:rollback
```
4. Push specific migration (push only migration `20220509030617_createDecksTable`)
```
npx knex migrate:up 20220509030617_createDecksTable
```
5. Rollback specific migration (rollback only migration `20220509030617_createDecksTable`)
```
npx knex migrate:down 20220509030617_createDecksTable
```
6. List all completed and pending migrations
```
npx knex migrate:list
```

#### Table Functions within Exports
- Create Table: `knex.schema.createTable("table_name", tableActions)`
    - `table_name`: name of the table
    - `tableActions`: function to perform various actions within a table
- Drop Table: `knex.schema.dropTable("table_name")`
- Rename Table: `knex.schema.renameTable("old_table_name", "new_table_name")`
- Alter Table: `knex.schema.table("table_name", tableActions)`
- `tableActions` called as a function callback (ex. `function(table) {}` or `(table) => {}`)
    - pass `table` as a parameter so can perform actions on table.

#### Table Actions within Table Functions
- drop a column: `table.dropColumn("table_name")`
- rename a column: `table.renameColumn("old_table_name", "new_table_name")`
- Making a new column
    - Create a new item with data type by calling the data type function
        - ex: `table.string("deck_name")`: creates a new `VARCHAR(255)` column called `deck_name`
        - ex: `table.int("user_age")`: creates a new `INTEGER` column called `user_age`
    - Special creation
    - Constraints are chained after getting the data type.
        - `.primary()`: sets column as a primary key
        - `.notNullable()`: this column cannot be `NULL`
        - `.unique()`: no two rows have the same value for this column
    - Making a foreign key
        - `.foreign("column_name")`: makes a foreign key of column name
        - `.references("ref_column").inTable("ref_table")`
        - `.onDelete(action)`: actions to perform if ref_table is deleted
            - `.onDelete("CASCADE")`: delete this column if ref_table is deleted

#### Full Example:
```js
return knex.schema.createTable("cards", function(table) {
    table.increment("card_id").primary();
    table.string("card_front").notNullable();
    table.string("card_back").notNullable();
    table
        .foreign("deck_id")
        .references("deck_id")
        .inTable("decks")
        .onDelete("CASCADE");
    table.timestamps(true, true); // makes created_at and modified_at
})
```

Postgres Equivalent:
```postgres
CREATE TABLE cards (
    card_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    card_front VARCHAR(255) NOT NULL,
    card_back VARCHAR(255) NOT NULL,
    deck_id INTEGER 
        REFERENCES decks(deck_id)
        ON DELETE CASCADE
)
```

### First Migration: Create `decks` Table
Objectives:
1. Create a table named `decks` with a primary key `deck_id`, a string `deck_name`, and a text `deck_description`
    - `deck_id` is a primary key
    - `deck_name` cannot be null
    - also add created and modified timestamps for tracking
2. Undo action: drop the `decks` table

#### `Command Line`: Create migration
Make a new migration. Gives `20220509030617_createDecksTable` in this case
```
npx knex migrate:make createDecksTable
```

#### `20220509030617_createDecksTable`: Exports

**Postgres Equivalent:**
1. `exports.up`
```postgres
CREATE TABLE decks (
    deck_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    deck_name VARCHAR(255) NOT NULL,
    deck_description TEXT
    -- then add logic for created_at and modified_at timestamps
    -- probably add some way update modified_at using ON UPDATE
)
```
2. `exports.down`
```postgres
DROP TABLE decks
```

**In JavaScript:**
1. `exports.up`
```js
exports.up = function(knex) {
    return knex.schema.createTable("decks", function(table) {
        table.increment("deck_id").primary();
        table.string("deck_name").notNullable();
        table.text("deck_description");
        table.timestamps(true, true); // makes created_at and modified_at
    })
}
```
2. `exports.down`
```js
exports.down = function(knex) {
    return knex.schema.dropTable("decks");
}
```