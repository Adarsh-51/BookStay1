import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Tag, Divider } from "antd";
import axios from "axios";
import Loading from "../Components/Loading";
// import Error from "../Components/Error";
import Swal from "sweetalert2";

const { TabPane } = Tabs;
function Profilescreen() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  });
  return (
    <div className="ml-3 mt-3">
      <Tabs>
        <TabPane tab="Profile" key="1">
          <h4>My Profile</h4>

          <br />

          <h6>Name : {user.name}</h6>
          <h6>Email : {user.email}</h6>
          <h6>isAdmin : {user.isAdmin ? "YES" : "NO"}</h6>
        </TabPane>
        <TabPane tab="Bookings" key="2">
          <MyBookings />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Profilescreen;

export function MyBookings() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/bookings/getbookingsbyuserid", {
          userid: user._id,
        });
        const data = response.data;
        // console.log(data);
        setBookings(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    try {
      setLoading(true);
      const result = await (
        await axios.post("/api/bookings/cancelbooking", {
          bookingid,
          roomid,
        })
      ).data;
      // const result = await response.data;
      console.log(result);
      setLoading(false);
      Swal.fire("Congrats", "Your booking has been cancelled", "success").then(
        (result) => {
          window.location.reload();
        }
      );
    } catch (error) {
      setLoading(false);
      Swal.fire("Oops", "Something Wrong happened", "error");
    }
  }

  return (
    <div className="row">
      <div className="col-md-6">
        {loading && <Loading />}
        {bookings &&
          bookings.map((booking) => {
            return (
              <div className="bs">
                <h5>{booking.room}</h5>
                <p>
                  {" "}
                  <b>BookingId : </b> {booking._id}
                </p>
                <p>
                  {" "}
                  <b>CheckIn :</b> {booking.fromdate}
                </p>
                <p>
                  {" "}
                  <b>Check Out : </b> {booking.todate}
                </p>
                <p>
                  {" "}
                  <b>Amount : </b>
                  {booking.totalAmount}
                </p>
                <p>
                  Status :{" "}
                  {booking.status === "CANCELLED" ? (
                    <Tag color="red">CANCELLED</Tag>
                  ) : (
                    <Tag color="orange">CONFIRMED</Tag>
                  )}
                </p>

                {booking.status !== "CANCELLED" && (
                  <div className="text-right">
                    <button
                      class="btn btn-primary"
                      onClick={() => {
                        cancelBooking(booking._id, booking.roomid);
                      }}
                    >
                      CANCEL BOOKING
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
