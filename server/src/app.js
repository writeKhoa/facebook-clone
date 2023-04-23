const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongodb } = require("./v1/helpers");
dotenv.config();

const origins = [
  process.env.CLIENT_URL,
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const app = express();

app.use(morgan("dev"));
app.use("/public", express.static("public"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: origins,
    methods: "GET, POST, PUT, DELETE",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

connectMongodb();

app.use("/api/v1", require("./v1/routes"));
app.get("/", async (req, res) => {
  return res.status(200).json({ data: "deploy successed" });
});

app.use("*", (req, res) => {
  return res.status(404).json({
    message: "Not Found",
  });
});

module.exports = app;
