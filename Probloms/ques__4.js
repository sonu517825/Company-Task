const tShirt = [
  {
    name: "playboy",
    color: "Black",
    price: 200,
    id: 1,
  },
  {
    name: "apple",
    color: "Black",
    price: 600,
    id: 2,
  },
  {
    name: "playboy",
    color: "green",
    price: 300,
    id: 3,
  },
  {
    name: "fashion",
    color: "yellow",
    price: 700,
    id: 4,
  },
  {
    name: "sport",
    color: "Black",
    price: 200,
    id: 5,
  },
];

const user = [
  {
    name: "sonu",
    email: "sonu@gmail.com",
    mob: 6387713230,
    address: "Lucknow UP",
    id: 1,
  },
  {
    name: "ajay",
    email: "ajay@gmail.com",
    mob: 66666666666,
    address: "Kanpur UP",
    id: 2,
  },
  {
    name: "sunil",
    email: "sunil@gmail.com",
    mob: 9999999999,
    address: "Gonda UP",
    id: 3,
  },
  {
    name: "puja",
    email: "puja@gmail.com",
    mob: 3333333333,
    address: "Lucknow UP",
    id: 4,
  },
  {
    name: "rahul",
    email: "rahul@gmail.com",
    mob: 6387713230,
    address: "indore MP",
    id: 5,
  },
];

const express = require("express");
const router = express.Router();
const axios = require("axios");
const Publishable_key = "Publishable_key" 
const Secret_key = "Secret_key" 
const stripe = require("stripe")(Secret_key)


router.get("/all_items", async (req, res, next) => {
  try {
    const url =
      "https://api.hubapi.com/crm-objects/v1/objects/products/paged?hapikey=demo&properties=name&properties=description&properties=price"; // this give full details
    // const url =
    //   "https://api.hubapi.com/crm-objects/v1/objects/products/paged?hapikey=demo"; // this give only product id name etc

    const itemData = await axios.get(url);

    return res.status(200).send({
      status: true,
      message: "Success",
      data: itemData.data,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

router.get("/product_by_id", async (req, res, next) => {
  try {
    const objectId = "3631153";
    const url = `https://api.hubapi.com/crm-objects/v1/objects/products/${objectId}?hapikey=demo&properties=name&properties=description&properties=price`; // this give full details
    // const url = `https://api.hubapi.com/crm-objects/v1/objects/products/${objectId}?hapikey=demo`; // this give only product id name etc

    const itemData = await axios.get(url);

    return res.status(200).send({
      status: true,
      message: "Success",
      data: itemData.data,
    });
  } catch (error) {
    if (error.response.status == 404) {
      return res.status(404).send({
        status: false,
        message: "Item not found",
        data: "",
      });
    } else {
      return res.status(500).send({
        status: false,
        message: error.message,
        data: "",
      });
    }
  }
});

router.get('/start', function (req, res) {
  res.render('Home', {
    key: Publishable_key
  })
})

router.post('/payment', async function (req, res) {

  const data = stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken,
    name: 'Sonu Verma',
    address: {
      line1: 'Dhaneypur Dist. Gonda UP',
      postal_code: '271602',
      city: 'Gonda',
      state: 'UP',
      country: 'India',
    }
  }).then((customer) => {
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
      return res.status(200).send("Success") // If no error occurs
    })
    .catch((err) => {
      console.log(err, "err")
      res.status(err.statusCode).send({ err: err.message })	 // If some error occurs
    });
})

router.get('/dhl', async function (req, res) {
  try {
    console.log("dhl")
    const trackingNumber = "00340434292135100186"
    const DHL_API_Key = API_Key 

    const options = {
      method: 'GET',
      url: 'https://api-test.dhl.com/track/shipments',
      params: { trackingNumber: trackingNumber },
      headers: { 'DHL-API-Key': DHL_API_Key }
    };

    axios.request(options).then(function (response) {
      console.log(response.data);
    }).catch(function (error) {
      console.error(error);
    });


  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error.message })

  }
})
//var axios = require("axios").default;


router.get('/lambda_fun_place_order', async function (req, res) {
  try {
    const { user, product, address, payment } = body


    // type 1

    // validate user 
    // validate product
    // validate address
    // validate payment
    // send back to user




    // type 2


    // call a payment gateway and pass the hole body
    // the payment gateway automatic validate all the data waya public API 
    // like For product => google hub API
    // for delevery => DHL API etc.

  } catch (error) {
    console.log(error)
    return res.status(500).send({ error: error.message })
  }
})

module.exports = router;

/*


In Ques4 


Dear Sir / Mam

Here i am not code properly because here relevent data not avilable at me
Only limited data i have

like i have stripe account but not have indian payment access
so on...

But if i have a chance to do same than defnetly i can do



*/
