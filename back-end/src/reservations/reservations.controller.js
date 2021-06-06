/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { date } = req.query;
  res.json({ data: await service.list(date) });
}

const validFields = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

function notNull(obj) {
  for (let key in obj) {
    if (!obj[key]) return false;
  }
  return true;
}
function statusIsValid(req, res, next) {
  const { status } = res.locals.reservation;

  if (status === "seated") {
    next({
      status: 400,
      message:
        "There's a party seated here, are you just gonna seat the new party on top of them?! Imbecile!!!",
    });
  }
  if (status === "finished") {
    next({
      status: 400,
      message:
        "They're dirty dishes still there you FOOL!, The table has just finished their meal!",
    });
  }

  if (status === "cancelled") {
    next({
      status: 400,
      message:
        "Can't you tell that this reservation has been cancelled?! You're a slow one aren't you?",
    });
  }
  if(status === "booked") {

    next()
  }
}
function hasValidFields(req, res, next) {
  const { data = {} } = req.body;

  const dataFields = Object.getOwnPropertyNames(data);
  validFields.forEach((field) => {
    if (!dataFields.includes(field)) {
      return next({
        status: 400,
        message: `The ${field} is missing`,
      });
    }
  });
  if (!notNull(data)) {
    return next({
      status: 400,
      message:
        "Invalid data format provided. Requires {string: [first_name, last_name, mobile_number], date: reservation_date, time: reservation_time, number: people}",
    });
  }

  const reserveDate = new Date(data.reservation_date);
  // start = new Date(`${data.reservation_date} 10:30:00 GMT-500`),
  // end = new Date(`${data.reservation_date} 21:30:00 GMT-500`);

  const todaysDate = new Date();

  if (typeof data.people !== "number") {
    return next({
      status: 400,
      message: "Needs to be a number, people is not a number.",
    });
  }

  if (!/\d{4}-\d{2}-\d{2}/.test(data.reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date is not a date.",
    });
  }
  if (reserveDate.getDay() === 1) {
    return next({
      status: 400,
      message:
        "Reservations cannot be made on a Tuesday, the restaurant is closed.",
    });
  }
  if (reserveDate < todaysDate) {
    return next({
      status: 400,
      message: "Reservations must be made for a future date.",
    });
  }
  if (!/[0-9]{2}:[0-9]{2}/.test(data.reservation_time)) {
    return next({
      status: 400,
      message: "reservation_time is not a time.",
    });
  }
  if (data.reservation_time < "10:30" || data.reservation_time > "21:30") {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30am or after 9:30pm.",
    });
  }
  res.locals.reservation = data;
  next();
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    next();
  } else {
    next({
      status: 404,
      message: `Reservation id does not exist: ${req.params.reservation_id}`,
    });
  }
}

async function validateStatus(req, res, next) {
  const { reservation } = res.locals;
  const { status } = reservation;
  const sentStatus = req.body.data.status;
  // const validProps = ["booked", "seated", "finished", "cancelled"];
  // const isValid = validProps.find((prop) => prop === status);
  if (status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }
  if (
    !(
      sentStatus === "booked" ||
      sentStatus === "seated" ||
      sentStatus === "finished" ||
      sentStatus === "cancelled"
    )
  ) {
    return next({
      status: 400,
      message: `status ${sentStatus} is invalid`,
    });
  }
  res.locals.status = sentStatus;
  next();
}

async function create(req, res) {
  const { reservation } = res.locals;
  const createdReservation = await service.create(reservation);
  res.status(201).json({ data: createdReservation });
}

async function read(req, res) {
  const { reservation } = res.locals;
  res.json({ data: reservation });
}

async function update(req, res) {
  const { reservation, status } = res.locals;
  const { reservation_id } = reservation;
  const newStatus = await service.updateStatus(reservation_id, status);
  console.log(status);
  res.status(200).json({data: newStatus});
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasValidFields,
    asyncErrorBoundary(statusIsValid),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(update),
  ],
};
