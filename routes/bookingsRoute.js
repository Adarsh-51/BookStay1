const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51NPq21SDzZr1jgE42EMcG63qKmzqIHa7hGfQRuK42aWfOKn7tJOqPAZS840DRhg7XBqRUdEhuqf3sukz6yl9QZGn00TVGIJqr1"
);

router.post("/bookroom", async (req, res) => {
  const { room, userid, fromdate, todate, totalAmount, totalDays, token } =
    req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.paymentIntents.create(
      {
        amount: totalAmount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    if (payment) {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid: userid,
        fromdate: fromdate,
        todate: todate,
        totalAmount: totalAmount,
        totalDays: totalDays,
        transactionId: "1234",
      });

      const booking = await newBooking.save();

      const roomtemp = await Room.findOne({ _id: room._id });

      roomtemp.currentbookings.push({
        bookingid: booking._id,
        fromdate: fromdate,
        userid: userid,
        todate: todate,
        status: booking.status,
      });

      await roomtemp.save();
    }
    res.send("Payment Successfull");
  } catch (error) {
    console.error("Error:", error); // Log the error to the console
    res.status(400).json({ error: error.message }); // Return the error message in the response
  }
});

router.post("/getbookingsbyuserid", async (req, res) => {
  const userid = req.body.userid;

  try {
    const bookings = await Booking.find({ userid: userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    console.log("Inside cancelbooking endpoint");

    const bookingitem = await Booking.findOne({ _id: bookingid });
    console.log("Booking item:", bookingitem);

    if (!bookingitem) {
      console.log("Booking not found");
      return res.status(404).json({ error: "Booking not found" });
    }

    bookingitem.status = "CANCELLED";
    await bookingitem.save();

    const room = await Room.findOne({ _id: roomid });
    console.log("Room:", room);

    if (!room) {
      console.log("Room not found");
      return res.status(404).json({ error: "Room not found" });
    }

    const bookings = room.currentbookings;

    const temp = bookings.filter(
      (booking) => booking.bookingid.toString() !== bookingid
    );

    room.currentbookings = temp;
    await room.save();

    console.log("Booking cancelled successfully");
    res.send("Your booking cancelled successfully");
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res
      .status(500)
      .json({ error: "An error occurred while cancelling the booking" });
  }
});

module.exports = router;
