const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const logger = require("morgan");
const app = express();
const router = require("./Probloms/ques__3")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use("/" , router)

mongoose
  .connect(
    "mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/Company_Task?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.listen(8080, function () {
  console.log("Express app running on port " + 8080);
});
