import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../Components/Room";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import { DatePicker } from "antd";
// import "antd/dist/antd.css";
import moment, { isDate } from "moment";
import StripeCheckout from "react-stripe-checkout";

function HomeScreen() {
  const { RangePicker } = DatePicker;
  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState();
  const [fromdate, setFromdate] = useState();
  const [todate, setTodate] = useState();
  const [duplicateRooms, setDuplicateRooms] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;

        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);

        setLoading(false);
      }
    }

    fetch();
  }, []);

  function isDateBetween(dateToCheck, startDate, endDate) {
    const checkDate = moment(dateToCheck, "DD-MM-YYYY");
    const start = moment(startDate, "DD-MM-YYYY");
    const end = moment(endDate, "DD-MM-YYYY");

    return checkDate.isBetween(start, end, null, "[]");
  }

  function filterByDate(dates) {
    //from date
    console.log(dates[0].format("DD-MM-YYYY"));
    setFromdate(dates[0].format("DD-MM-YYYY"));
    //to date
    console.log(dates[1].format("DD-MM-YYYY"));
    setTodate(dates[1].format("DD-MM-YYYY"));

    //tempRooms
    var tempRooms = [];

    for (const room of duplicateRooms) {
      var availability = false;

      if (room.currentbookings.length > 0) {
        for (const booking of room.currentbookings) {
          //check between or equal to dates
          if (
            !isDateBetween(
              dates[0].format("DD-MM-YYYY"),
              booking.fromdate,
              booking.todate
            ) &&
            !isDateBetween(
              dates[1].format("DD-MM-YYYY"),
              booking.fromdate,
              booking.todate
            )
          ) {
            if (
              dates[0].format("DD-MM-YYYY") !== booking.fromdate &&
              dates[0].format("DD-MM-YYYY") !== booking.todate &&
              dates[1].format("DD-MM-YYYY") !== booking.fromdate &&
              dates[1].format("DD-MM-YYYY") !== booking.todate
            ) {
              availability = true;
            }
          }
        }
      } else {
        availability = true;
      }

      if (availability === true) {
        tempRooms.push(room);
      }
    }

    setRooms(tempRooms);
  }

  return (
    <div className="container">
      <div className="row mt-3">
        <div className="col-md-3">
          <RangePicker format="DD-MM-YYYY" onChange={filterByDate} />
        </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loading />
          </h1>
        ) : rooms.length > 1 ? (
          rooms.map((room) => {
            return (
              <div className="col-md-9 mt-3">
                <Room room={room} fromdate={fromdate} todate={todate} />
              </div>
            );
          })
        ) : (
          <Error />
        )}
      </div>
    </div>
  );
}

export default HomeScreen;
