const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
exports.login = async (req, resp) => {
  // console.log(req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return resp.status(400).json({
        success: false,
        message: "plaease fill all the details carefully",
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return resp.status(401).json({
        success: false,
        message: "user is not registered",
      });
    }

    const token = await user.generateAuthtoken();

    resp.cookie("usercookie", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });

    const result = {
      user,
      token,
    };
    resp.status(200).json({ status: 200, result });

    // const options = {
    //   expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };

    // resp.cookie("token", token, options).status(200).json({
    //   success: true,
    //      status:200,
    //   token,
    //   // user,
    //   message: "User Logged in successfully",
    // });
    // console.log(user)
    // resp.status(200).json({
    //   success: true,
    //   status:200,
    //   token,
    //   user,
    //   message: "user loggedin successful",
    // });
    // } else {
    //   return resp.status(403).json({
    //     success: false,
    //     message: "Passwrod incorrect",
    //   });
    // }
  } catch (error) {
    console.log(error);
    return resp.status(500).json({
      success: false,
      message: "Login Failure",
      error: error.message,
    });
  }
};
