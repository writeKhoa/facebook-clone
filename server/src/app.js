const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectMongodb } = require("./v1/helpers");

const nodeEnv = process.env.NODE_ENV;
const origins =
  nodeEnv === "development"
    ? [
        "http://127.0.0.1:5173",
        "http://locahlhost:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
      ]
    : [process.env.CLIENT_URL];

dotenv.config();

const app = express();
if (nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use("/public", express.static("public"));
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
