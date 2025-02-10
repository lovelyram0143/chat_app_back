const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const authRouter = require("./route/authroute");
const msgRouter = require("./route/msgroute");

const morgan = require("morgan");
const { dbconnect } = require("./db connect/mangodb");


dbconnect()


require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});


app.use(morgan('dev'))

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Handle form data

app.use(cors());



/* setting up routes in the Express application. */
app.use("/api/user/", authRouter);
app.use("/api/message/", msgRouter);

const PORT = 4000;


app.get("/", (_req, res) => {
  res.json({ message: `your site url is http://localhost:${PORT}/` })
});



app.listen(PORT, () => {

  console.log(`Example app listening at http://localhost:${PORT}`);
});
