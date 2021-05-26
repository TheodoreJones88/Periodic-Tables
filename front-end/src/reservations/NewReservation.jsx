import React, { useState } from "react";
import { useHistory } from "react-router";
import { previous, today, next } from "../utils/date-time";

export default function NewReservation() {
  const [formFields, setFormFields] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  });
  const history = useHistory();
   
  function handleSubmit(event) {
    event.preventDefault();
    history.push(`/dashboard?date=${formFields.reservation_date}`);
  }
  return (
    <>
      <form>
        <div className="form-group">
          <label for="first_name">First Name:&nbsp;</label>
          <input
            name="first_name"
            type="text"
            placeholder="First Name"
            className="form-control"
            id="first_name"
            value={formFields.first_name}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                first_name: event.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label for="last_name">Last Name:&nbsp;</label>
          <input
            name="last_name"
            type="text"
            placeholder="last_name"
            className="form-control"
            id="last_name"
            value={formFields.last_name}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                last_name: event.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label for="mobile_number">Mobile Number:&nbsp;</label>
          <input
            type="tel"
            name="mobile_number"
            placeholder="Moile Number"
            className="form-control"
            id="mobile_number"
            value={formFields.mobile_number}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                mobile_number: event.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label for="reservation_date">Date of Reservation:&nbsp;</label>
          <input
            type="date"
            name="reservation_date"
            placeholder="Date of Reservation"
            className="form-control"
            id="reservation_date"
            value={formFields.reservation_date}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                reservation_date: event.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label for="reservation_time">Time of Reservation:&nbsp;</label>
          <input
            type="time"
            name="reservation_time"
            placeholder="Date of Reservation"
            className="form-control"
            id="reservation_time"
            value={formFields.reservation_time}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                reservation_time: event.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label for="people">Number In Party:&nbsp;</label>
          <input
            type="number"
            name="people"
            placeholder="Number in Party"
            className="form-control"
            id="people"
            min="1"
            value={formFields.people}
            onChange={(event) =>
              setFormFields({
                ...formFields,
                people: event.target.value,
              })
            }
          />
        </div>
        <div>
          <button
            className="btn btn-primary mx-2"
            onClick={(event) => handleSubmit(event)}
          >
            Submit
          </button>
          <button
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
