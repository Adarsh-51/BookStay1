const express = require("express");

const app = express();

const dbConfig = require("./db");
const roomRoute = require("./routes/roomRoute");
const usersRoute = require("./routes/userRoute");
const bookingsRoute = require("./routes/bookingsRoute");

app.use(express.json());

app.use("/api/rooms", roomRoute);
app.use("/api/users", usersRoute);
app.use("/api/bookings", bookingsRoute);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Node server started`));
