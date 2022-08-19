const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

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
const user = mongoose.model("users", userScema);

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
