const User = require("../models/userSchema");
const bcrypt = require("bcryptjs");

exports.register = async (req, resp) => {
  const { fname, email, password, cpassword } = req.body;
  //   console.log(req.body)
  if (!fname || !email || !password || !cpassword) {
    resp.status(422).json({
      error: "fill all the details",
    });
  }
  try {
    const preuser = await User.findOne({ email: email });

    if (preuser) {
      resp.status(422).json({ error: "This Email is Already Exist" });
    } else if (password !== cpassword) {
      resp
        .status(422)
        .json({ error: "Password and Confirm Password Not Match" });
    } else {
      let hashedpassword;
      let hashedcpassword;

      try {
        hashedpassword = await bcrypt.hash(password, 10);
        hashedcpassword = await bcrypt.hash(cpassword, 10);
      } catch (error) {
        return resp.status(500).json({
          success: false,
          message: "Error in hashing Password",
        });
      }
      const finalUser = new User({
        fname,
        email,
        password: hashedpassword,
        cpassword: hashedcpassword,
      });

      //             // here password hasing

      const storeData = await finalUser.save();

      //             console.log(storeData);
      return resp.status(200).json({
        status: 200,
        storeData,
        success: true,
        message: "user Created Successfully",
      });
    }
  } catch (error) {
    resp.status(422).json({
      message: error.message,
    });
  }
};
