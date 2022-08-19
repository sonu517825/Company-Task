const express = require("express");
const bodyParser = require("body-parser");
const path = require('path')
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




const Publishable_key = "pk_test_51LYYrSSGeoPGYdP5O1bPaOss2u5PoW874qn5XY0EXbXRbPNDvYLtG1uATQKVgGUTaBh9PnuVLGFkttib7MkQxqtq001gKfkUWp"
const Secret_key = "sk_test_51LYYrSSGeoPGYdP5kpcfGZowvfEBdLQeMQkWDiE2KnKfj5VxmrCRzWCmG8NGV67JslMozbHDAVKfQKZHJ53A18s300QmCpTKvi"
const stripe = require("stripe")(Secret_key)

app.get('/', function (req, res) {
	res.send("Home Page")
})


app.get('/start', function (req, res) {
	res.render('Home', {
		key: Publishable_key
	})
})



app.post('/payment', async function (req, res) {


	const data = stripe.customers.create({
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
			console.log(customer, "customer")

			return stripe.charges.create({
				amount: 2500,	 // Charing Rs 25
				description: 'Web Development Product',
				currency: 'INR',
				customer: customer.id
			});
		})
		.then((charge) => {
			console.log(charge, "chagege")
			res.send("Success") // If no error occurs
		})
		.catch((err) => {
			console.log(err , "err")
			res.send({ err })	 // If some error occurs
		});
})

app.post('/create-checkout-session', async (req, res) => {
	const session = await stripe.checkout.sessions.create({
	  line_items: [
		{
		  price_data: {
			currency: 'usd',
			product_data: {
			  name: 'T-shirt',
			},
			unit_amount: 2000,
		  },
		  quantity: 1,
		},
	  ],
	  mode: 'payment',
	  success_url: 'https://example.com/success',
	  cancel_url: 'https://example.com/cancel',
	});
  
	res.redirect(303, session.url);
  });
app.listen(8080, function () {
	console.log("Express app running on port " + 8080);
});

