// Update with your config settings.

require("dotenv").config() // start configuring the dotenv library

const {
  DATABASE_URL // will grab the DATABASE_URL from the environment files
} = process.env

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = { // exports the configuration

  development: {
    client: 'postgres',
    connection: DATABASE_URL,
  },

  /// THESE ARE FOR STAGING AND PRODUCTION. Not doing that for now
  /*   staging: {
      client: 'postgresql',
      connection: {
        database: 'my_db',
        user:     'username',
        password: 'password'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    },
  
    production: {
      client: 'postgresql',
      connection: {
        database: 'my_db',
        user:     'username',
        password: 'password'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    } */

};