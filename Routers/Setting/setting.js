const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../Models/signup");
const otp = require("../../Models/otp");

router.put("/api/coures/updateuser/:id", async (req, res) => {
  try {
    const { name } = req.body;
    // Create a new note Object
    const updatedUser = {};
    if (name) {
      updatedUser.name = name;
    }

    let updateduser = await User.findById(req.params.id);
    if (!updateduser) {
      return res.status(404).send("Not found");
    }
    // note.user.toString is given the user id
    // if (updateduser.user.toString() !== req.user.id) {
    //   return res.status(401).send("Not allowed");
    // }
    updateduser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedUser },
      { new: true }
    );
    res.json({ Success: "Name has been updated", updateduser });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/api/emailsend", async (req, res) => {
  let data = await User.findOne({ email: req.body.email });
 
  const resType = {};
  if (data) {
    let otpcode = Math.floor(Math.random() * 10000 + 1);
    let otpData = new otp({
      email: req.body.email,
      code: otpcode,
      expire: new Date().getTime() + 300 * 1000,
    });
    let otpResponse = await otpData.save();
    resType.statusText = "Success";
    mailer(data, otpcode);
    resType.message = "Please the check your email I'd";
  } else {
    resType.statusText = "Failed";
    resType.message = "Email id does not exist";
  }
  res.status(200).json(resType);
});

router.post("/api/ChangePassword", async (req, res) => {
  let data = otp({ email: req.body.email, code: req.body.otpCode });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expire - currentTime;
    if (diff < 0) {
      response.statusText = "error";
      response.message = "OTP has been expireed";
    } else {
      let user = await User.findOne({ email: req.body.email });

      user.password = req.body.password;
      user.cpassword = req.body.cpassword;
      if (user.password !== user.cpassword) {
        return res.status(400).send("Password does not matched");
      }
      user.password = await bcrypt.hash(req.body.password, 10);
      user.cpassword = await bcrypt.hash(req.body.cpassword, 10);
      user.save();
      response.statusText = "Success";
      response.message = "Password changed Successfully";
    }
  } else {
    response.statusText = "error";
    response.message = "Invalid otp";
  }

  res.status(200).json(response);
});

const mailer = (email, otp) => {
  var nodemailer = require("nodemailer");

  var transporter = nodemailer.createTransport({
    service: "smtp@gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: "amitkumar171117@gmail.com",
      pass: "xbhmjnlohdyowjpp",
    },
  });

  var mailoption = {
    form: "amitkumar171117@gmail.com",
    to: email,
    subject: "Sending Mail using Nodejs",
    text: `Your OTP is ${otp} expired in 15 min `,
  };
  transporter.sendMail(mailoption, function (error, Info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to: " + Info.response);
    }
  });
};
module.exports = router;
