const knex = require("../db/connection");

const tableName = "tables";
function list() {
    return knex(tableName)
      .select("*")
      .orderBy("table_name", "asc");
  }

function create(newTable) {
    return knex(tableName)
      .insert(newTable, "*")
      .then((createdTable) => createdTable[0]);
  }

  module.exports = {
    create,
    list,
    // read,
  };