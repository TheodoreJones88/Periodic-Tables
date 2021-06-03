import React from "react";

export default function ReservationRow({ reservations }) {
	return (
	  <table className="table table-striped">
		<thead className="thead-dark">
		  <tr>
			<th scope="col">ID</th>
			<th scope="col">First Name</th>
			<th scope="col">Last Name</th>
			<th scope="col">Mobile Number</th>
			<th scope="col">Date</th>
			<th scope="col">Time</th>
			<th scope="col">Status</th>
			<th scope="col">People</th>
			<th scope="col">Seat</th>
		  </tr>
		</thead>
		<tbody>
		  {reservations.map((res, index) => {
			const { reservation_id } = res;
			return (
			  <tr key={index}>
				<th scope="row">{res.reservation_id}</th>
				<td>{res.first_name}</td>
				<td>{res.last_name}</td>
				<td>{res.mobile_number}</td>
				<td>{res.reservation_date}</td>
				<td>{res.reservation_time}</td>
				<th data-reservation-id-status={res.reservation_id}>
				  {res.status}
				</th>
				<td>{res.people}</td>
				{res.status !== "booked" ? (
				  <button type="button">
					<a
					  className="btn btn-primary"
					  href={`/reservations/${reservation_id}/seat`}
					>
					  Seat
					</a></button>
				) : res.status}
			  </tr>
			);
		  })}
		</tbody>
	  </table>
	);
  }