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

/******************************************************** User Schema **************************************************************************/

const userScema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    tokens: [],
  },
  {
    timestamps: true,
  }
);
//const user = mongoose.model("users", userScema);

/******************************************************** Generate Token **************************************************************************/

const generateToken = async (body) => {
  const token = jwt.sign(
    { _id: body._id, userName: body.name, userEmail: body.email },
    "Screate Key",
    { expiresIn: "15m" }
  );
  const setToken = { token: token };
  const saveToken = await user.findOneAndUpdate(
    { _id: body._id },
    { $push: { tokens: setToken } },
    { new: true }
  );
  return saveToken;
};

/******************************************************** Middlewear **************************************************************************/

const middlewear = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).send({
        status: false,
        message: "Plz provide token",
        error: "Not authorized to access this resource",
      });
    }

    const callBack = async (error, decode) => {
      if (error) {
        return res.status(401).send({
          status: false,
          message: error.message,
          error: "Not authorized to access this resource",
        });
      } else {
        if (decode) {
          const isUserExist = await user.findOne({
            _id: decode._id,
            "tokens.token": token,
          });

          if (!isUserExist) {
            return res.status(404).send({
              status: false,
              message: "User not found",
              error: "Not authorized to access this resource",
            });
          }

          req.user = isUserExist;
          req.token = token;
          next();
          return;
        } else {
          return res.send({
            status: false,
            message: "Something went wrong.",
            data: "",
          });
        }
      }
    };

    token = token.replace("Bearer ", "");
    const data = jwt.verify(token, "Screate Key", callBack);
  } catch (error) {
    return res.status(401).send({
      status: false,
      message: error.message,
      error: "Not authorized to access this resource",
    });
  }
};

/******************************************************** Register Route **************************************************************************/

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        status: false,
        message: "Please provide name , email and password",
        data: "",
      });
    }
    const userData = await user.create(req.body);

    return res.status(201).send({
      status: true,
      message: "User register successfully",
      data: userData,
    });
  } catch (error) {
    if (error.keyValue["email"]) {
      return res.status(400).send({
        status: false,
        message: "Email is already use",
        data: "",
      });
    }

    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

/******************************************************** Login Route **************************************************************************/

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        status: false,
        message: "Please provide email and password",
        data: "",
      });
    }
    const isUserExist = await user.findOne({
      email: email,
      password: password,
    });

    if (!isUserExist) {
      return res.status(404).send({
        status: false,
        message: "User not found",
        data: "",
      });
    }

    const returnData = await generateToken(isUserExist);

    return res.status(201).send({
      status: true,
      message: "User login successfully",
      data: returnData,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

/******************************************************** Authorize Home Page **************************************************************************/

router.post("/home", middlewear, async (req, res, next) => {
  try {
    return res.status(200).send({
      status: true,
      message: "This is Home Page.",
      data: "",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

/******************************************************** Logout From One Device **************************************************************************/

router.post("/logout_one_device", middlewear, async (req, res, next) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    const logOutUser = await req.user.save();

    return res.status(200).send({
      status: true,
      message: "User logout successfully",
      data: logOutUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

/******************************************************** Logout From All Device **************************************************************************/

router.post("/logout_All_device", middlewear, async (req, res, next) => {
  try {
    req.user.tokens.splice(0, req.user.tokens.length);
    const logOutUser = await req.user.save();
    return res.status(200).send({
      status: true,
      message: "Logout from all devices successfully.",
      data: logOutUser,
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: error.message,
      data: "",
    });
  }
});

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

// const express = require('express');
// const router = express.Router();
//const { validate } = require("../middleware/validator");
//const paymentController = require("../controllers/payment.controller");

//router.post("/payment", validate("payment"), paymentController.payment);

//module.exports = router;

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
