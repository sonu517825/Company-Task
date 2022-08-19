const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const logger = require("morgan");
const app = express();
const router_ques__3 = require("./Probloms/ques__3");
const router_ques__4 = require("./Probloms/ques__4");
//const path = require("path");
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");

//var express = require('express');
// var exphbs  = require('express-handlebars');

// //var app = express();
// var hbs = exphbs.create({ /* config */ });

// // Register `hbs.engine` with the Express app.
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');



//const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')
//const app = express()

var Publishable_Key = 'Your_Publishable_Key'
var Secret_Key = 'Your_Secret_Key'

const stripe = require('stripe')(Secret_Key)

//const port = process.env.PORT || 3000

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())

// View Engine Setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

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










app.get('/', function(req, res){
	res.render('Home', {
	key: Publishable_Key
	})
})

app.post('/payment', function(req, res){

	// Moreover you can take more details from user
	// like Address, Name, etc from form
	stripe.customers.create({
		email: req.body.stripeEmail,
		source: req.body.stripeToken,
		name: 'Gourav Hammad',
		address: {
			line1: 'TC 9/4 Old MES colony',
			postal_code: '452331',
			city: 'Indore',
			state: 'Madhya Pradesh',
			country: 'India',
		}
	})
	.then((customer) => {

		return stripe.charges.create({
			amount: 2500,	 // Charing Rs 25
			description: 'Web Development Product',
			currency: 'INR',
			customer: customer.id
		});
	})
	.then((charge) => {
		res.send("Success") // If no error occurs
	})
	.catch((err) => {
		res.send(err)	 // If some error occurs
	});
})

// app.listen(port, function(error){
// 	if(error) throw error
// 	console.log("Server created Successfully")
// })
app.listen(8080, function () {
  console.log("Express app running on port " + 8080);
});