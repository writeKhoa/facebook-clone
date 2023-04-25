const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongodb } = require("./v1/helpers");
dotenv.config();

const origins = [process.env.CLIENT_URL];

const app = express();

app.use(morgan("dev"));
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: origins,
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
