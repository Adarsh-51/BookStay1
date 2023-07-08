import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../Components/Loading";
import Error from "../Components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from "sweetalert2";

function BookingScreen() {
  let { roomid, fromdate, todate } = useParams();
  const firsdate = moment(fromdate, "DD-MM-YYYY");
  const lastdate = moment(todate, "DD-MM-YYYY");
  const [room, setRoom] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const totalDays = moment.duration(lastdate.diff(firsdate)).asDays() + 1;
  const [totalAmount, setTotalAmount] = useState();

  useEffect(() => {
    async function fetch() {
      if (!localStorage.getItem("currentUser")) {
        window.location.reload = "/login";
      }
      try {
        setLoading(true);
        const data = (
          await axios.post("/api/rooms/getroombyid", {
            roomid: roomid,
          })
        ).data;
        setTotalAmount(data.rentperday * totalDays);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
    fetch();
  }, []);

  let currentUser = localStorage.getItem("currentUser");
  let name = currentUser.name;

  if (currentUser) {
    try {
      const userObject = JSON.parse(currentUser);
      name = userObject.name;
    } catch (error) {
      console.log("Error parsing JSON:", error);
    }
  }

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      fromdate,
      todate,
      totalAmount,
      totalDays,
      token,
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room booked Sucessfully",
        "success"
      ).then((result) => {
        window.location.href = "/profile";
      });
    } catch (error) {
      setLoading(false);
      Swal.fire("OOps", "Something went wrong", "error");
    }
  }

  return (
    <div className="m-5">
      {loading ? (
        <h1>
          <Loading />
        </h1>
      ) : room ? (
        <div>
          <div className="row justify-content-center mt-3 bs">
            <div className="col-md-5">
              <h5>{room.name}</h5>
              <img src={room.imageurls[0]} className="bigimg" />
            </div>
            <div className="col-md-5 m-2">
              <div style={{ textAlign: "right" }}>
                <h1>Booking Details</h1>
                <hr />

                <b>
                  <p>Name :{name}</p>
                  <p>From Date : {fromdate}</p>
                  <p>To Date : {todate}</p>
                  <p>Max Count : {room.MAXCOUNT}</p>
                </b>
              </div>

              <div style={{ textAlign: "right" }}>
                <b>
                  <h1>Amount</h1>
                  <hr />
                  <p>Total Days : {totalDays}</p>
                  <p>Rent per day : {room.rentperday}</p>
                  <p>Total Amount : {totalAmount}</p>
                </b>
              </div>

              <div>
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency="inr"
                  stripeKey="pk_test_51NPq21SDzZr1jgE4GB5I9ejHcs8BJpqayeQ3R56MLWeuryMyIiPPHUuVOpMElwCW6Tuuj9SaSrXZRjPDBa102m6c00cgIRIakn"
                >
                  <button
                    className="btn btn-primary"
                    style={{ float: "right" }}
                  >
                    Pay Now
                  </button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
    </div>
  );
}

export default BookingScreen;
