import React, { useState } from "react";
import { useHistory } from "react-router";
import { today } from "../utils/date-time";
import { createReservation, formatPhoneNumber } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function NewReservation({date, loadDashboard}) {
  const [errors, setErrors] = useState(null);
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const history = useHistory();
  const phoneNumberFormatter = ({ target }) => {
    const formattedInputValue = formatPhoneNumber(target.value);
    setFormFields({
      ...formFields,
      mobile_number: formattedInputValue,
    });
  };

  function validateDate() {
    const reserveDate = new Date(formFields.reservation_date);
    const reserveTime = formFields.reservation_time;
    let message = "";

    if (reserveDate.getDay() === 1) {
      message +=
        "Reservations cannot be made on a Tuesday (Restaurant is closed).";
    }
    if (formFields.reservation_date < today()) {
      message += "Reservations cannot be made in the past.";
    }

    if (reserveTime.localeCompare("10:30") === -1) {
      message += "We are closed before 10:30AM";
    } else if (reserveTime.localeCompare("21:30") === 1) {
      message += "We are closed after 9:30PM";
    } else if (reserveTime.localeCompare("21:00") === 1) {
      message +=
        "You must book at least 30 minutes before the restaurant closes";
    }

    if (message) {
      setErrors(new Error(message));
      return false;
    }
    return true;
    // return foundErrors;
  }

  function handleSubmit(event) {
    console.log("handle");
    event.preventDefault();
    setErrors(null);
    const validDate = validateDate();
    if (validDate) {
      createReservation(formFields)
        .then( history.push(`/dashboard?date=${formFields.reservation_date}`))
        .catch((err) => setErrors(err));
      console.log("handleEnd");
      // const errorMessage = { message: `${foundErrors.join(",").trim()}` };
      // setErrors(errorMessage);
    }
  } 
  function handleChange({target}) {
    setFormFields({
      ...formFields,
      [target.name]: target.value,
    })
            
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        {errors && <ErrorAlert error={errors} />}                      
        <div className="form-group">
          <label htmlFor="first_name">First Name:&nbsp;</label>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            className="form-control"
            id="first_name"
            value={formFields.first_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name:&nbsp;</label>
          <input
            name="last_name"
            type="text"
            placeholder="last_name"
            className="form-control"
            id="last_name"
            value={formFields.last_name}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number:&nbsp;</label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="XXX-XXX-XXXX"
            className="form-control"
            id="mobile_number"
            value={formFields.mobile_number}
            required
            onChange={phoneNumberFormatter}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date of Reservation:&nbsp;</label>
          <input
            type="date"
            name="reservation_date"
            placeholder="YYYY-MM-DD"
            pattern="\d{4}-\d{2}-\d{2}"
            className="form-control"
            id="reservation_date"
            value={formFields.reservation_date}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time of Reservation:&nbsp;</label>
          <input
            type="time"
            name="reservation_time"
            placeholder="HH:MM"
            pattern="[0-9]{2}:[0-9]{2}"
            className="form-control"
            id="reservation_time"
            value={formFields.reservation_time}
            required
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Number In Party:&nbsp;</label>
          <input
            type="number"
            name="people"
            placeholder="Number in Party"
            className="form-control"
            id="people"
            min="1"
            required
            value={formFields.people}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary mx-2">
            Submit
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={history.goBack}
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}
