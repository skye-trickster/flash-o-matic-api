/**
 * Function to perform this migration
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("decks", (table) => {
        table.increments("deck_id").primary();
        table.string("deck_name").notNullable();
        table.text("deck_description");
        table.timestamps(true, true);
    })
};

/**
 * Function to _undo_ migration changes
 * exports.down should ALWAYS do the exact opposite of exports.up
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("decks");
};
