const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs")
const { default: mongoose } = require("mongoose");
const logger = require("morgan");

const router_ques__3 = require("./Probloms/ques__3");
const router_ques__4 = require("./Probloms/ques__4");
const bodyparser = require('body-parser')

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json())



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger("dev"));
app.use("/", router_ques__3);
app.use("/", router_ques__4);

mongoose
	.connect(
		"mongodb+srv://sonu517825:m0ww1dng9uqrz0ge@cluster0.wgtiy.mongodb.net/Company_Task?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
		}
	)
	.then(() => console.log("MongoDb is connected"))
	.catch((err) => console.log(err));


app.get('/', function (req, res) {
	res.send("Home Page")
})



app.listen(8080, function () {
	console.log("Express app running on port " + 8080);
});








/*




Dear Sir / Mam

This code is Github : https://github.com/sonu517825/Company-Task

my latest resume : https://docs.google.com/document/d/1oA38PxSUVz-XFs_k3Jw3pp2nmyN33UYO9I_rfEurlqs/edit?usp=sharing


*/





















