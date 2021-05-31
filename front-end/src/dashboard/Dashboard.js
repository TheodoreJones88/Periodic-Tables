import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import  ReservationRow from "./ReservationRow";
import TableRow from "./TableRow";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const reservationsJSX = () => {
    return reservations.map((reservation) => 
      <ReservationRow key={reservation.reservation_id} reservation={reservation} />);
  };
  
  // and here:
  const tablesJSX = () => {
    return tables.map((table) => 
      <TableRow key={table.table_id} table={table} />);
  };
  

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Previous
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${today()}`)}
      >
        Today
      </button>
      <button
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
      <div>
        {reservations.map((res) => {
          return (
            <ul>
              <li>
                {res.first_name} {res.last_name}
              </li>
              <li>Mobile Number: {res.mobile_number}</li>
              <li>Date: {res.reservation_date}</li>
              <li>Time: {res.reservation_time}</li>
              <li>People: {res.people}</li>
              <li>Status: </li>
            </ul>
          );
        })}
        
      </div>
    </main>
  );
}

export default Dashboard;
