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
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const axios = require("axios");

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
const Moment = require("moment");
const MomentRange = require("moment-range");
const moment = MomentRange.extendMoment(Moment);

// const config = require("../config/stripe");
// const stripe = require("stripe")(config.secretKey);

const index = (req, res) => {
  const fromDate = moment();
  const toDate = moment().add(10, "years");
  const range = moment().range(fromDate, toDate);

  const years = Array.from(range.by("year")).map((m) => m.year());
  const months = moment.monthsShort();
  //res.send({fromDate , toDate , range , years , months})
  return res.render("handlebars", { months, years });
};

const payment = async (req, res) => {
  const token = await createToken(req.body);
  if (token.error) {
    req.flash("danger", token.error);
    return res.redirect("/");
  }
  if (!token.id) {
    req.flash("danger", "Payment failed.");
    return res.redirect("/");
  }

  const charge = await createCharge(token.id, 2000);
  if (charge && charge.status == "succeeded") {
    req.flash("success", "Payment completed.");
  } else {
    req.flash("danger", "Payment failed.");
  }
  return res.redirect("/");
};

const createToken = async (cardData) => {
  let token = {};
  try {
    token = await stripe.tokens.create({
      card: {
        number: cardData.cardNumber,
        exp_month: cardData.month,
        exp_year: cardData.year,
        cvc: cardData.cvv,
      },
    });
  } catch (error) {
    switch (error.type) {
      case "StripeCardError":
        token.error = error.message;
        break;
      default:
        token.error = error.message;
        break;
    }
  }
  return token;
};

const createCharge = async (tokenId, amount) => {
  let charge = {};
  try {
    charge = await stripe.charges.create({
      amount: amount,
      currency: "usd",
      source: tokenId,
      description: "My first payment",
    });
  } catch (error) {
    charge.error = error.message;
  }
  return charge;
};

router.get("/index", index);
module.exports = router;

/*

Dear Sir / Mam

This is a sample code format. We can also make better this code 
like use model , router , controller , views etc in seprate file.


And for access token and refresh token every 15 min we refresh it 
we can do this by help of cron job or cron sedule

like 

cron.sedule((****)=>{
  // generate refresh token here
})

And So on 

*/
