const { select } = require("../db/connection");
const knex = require("../db/connection");

const tableName = "reservations";

function list(reservation_date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date })
    .whereNot({ status: "finished"})
    .whereNot({ status: "cancel"})
    .orderBy("reservation_time", "asc");
}

function create(newReservation) {
  return knex(tableName)
    .insert(newReservation, "*")
    .then((createdReservation) => createdReservation[0]);
}

function read(reservation_id) {
  return knex(tableName).where({ reservation_id }).first();
}
async function updateStatus(reservation_id, status) {
  return await knex(tableName)
    .where({ reservation_id})
    .update("status", status)
    .then(() => read(reservation_id));
}

module.exports = {
  create,
  list,
  read,
  updateStatus,
};
