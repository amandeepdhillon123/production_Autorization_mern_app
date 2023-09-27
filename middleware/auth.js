const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
require("dotenv").config();

exports.auth = async (req, resp, next) => {
  try {
    const token = req.headers.authorization;
    // console.log("-------",token)

    if (!token || token === undefined) {
      return resp.status(401).json({
        success: false,
        message: "Token Missing",
      });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("==",payload);
      //why this ?
      // req.user = payload;
      // console.log("..",req.user)

      const user = await User.findOne({ _id: payload._id });
      if (!user) {
        throw new Error("user not found");
      }

      req.token = token;
      req.user = user;
    } catch (error) {
      return resp.status(401).json({
        status: 401,
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return resp.status(401).json({
      status: 401,
      success: false,
      message: "Something went wrong, while verifying the token",
      error: error.message,
    });
  }
};

// for valid user

exports.validuser = async (req, resp, next) => {
  //   console.log("done")

  try {
    const ValidUser = await User.findOne({ _id: req.user });
    console.log("===", ValidUser);

    resp.status(201).json({
      status: 201,
      ValidUser,
      success: true,
      message: "THis is a protected route for valid user",
    });
    next();
  } catch (error) {
    return resp.status(401).json({
      status: 401,
      ValidUser,
      success: false,
      message: "User Role is not matching",
    });
  }
};

exports.logout = async (req, resp) => {
  //   console.log("done")

  try {
    //    console.log(req.user.tokens)

    req.user.tokens = req.user.tokens.filter((ele) => {
      return ele.token !== req.token;
    });

    resp.clearCookie("usercookie", { path: "/" });

    req.user.save();

    resp.status(201).json({ status: 201 });
  } catch (error) {
    return resp.status(401).json({
      status: 401,
      // ValidUser,
      success: false,
      message: "User Role is not matching",
      error: error.message,
    });
  }
};
