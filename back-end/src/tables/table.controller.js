const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const validFields = ["table_name", "capacity"];

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const table = data.table_name;
  const noCap = data.capacity;
  const dataFields = Object.getOwnPropertyNames(data);
  validFields.forEach((field) => {
    if (!dataFields.includes(field)) {
      return next({
        status: 400,
        message: `The ${field} is missing`,
      });
    }
    if (!table) {
      return next({
        status: 400,
        message: `table_name is empty.`,
      });
    }
    if (table.length < 2) {
      return next({
        status: 400,
        message: `table_name needs to be longer than 1 character.`,
      });
    }
    if (!noCap) {
      return next({
        status: 400,
        message: `capacity needs to be larger than 1.`,
      });
    }
  });
  res.locals.table = data;
  next();
}

async function create(req, res) {
  const {table} = res.locals;
  const createdTable = await service.create(table);
  res.status(201).json({ data: createdTable });
}

async function list(req, res) {
  res.json({ data: await service.list() });
}
module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [hasValidFields, asyncErrorBoundary(create)],
  // read: [asyncErrorBoundary(reservationExists), read]
};
