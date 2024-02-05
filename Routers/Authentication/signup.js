const User = require("../../Models/signup");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const verifyemailotp = require("../../Models/verifyemailotp")
var jwt = require("jsonwebtoken");
const fetchuser = require("../../middleware/fetchuser")

const JWT_SECRET = "Amitisagoodb$oy";
router.post("/auth/api/register", async (req, res, next) => {
  try {
    const { name, email, phone_no, password } = req.body;
    const EmailCheck = await User.findOne({ email });
    if (EmailCheck)
      return res.json({ msg: "Phone_ No already used", status: false });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phone_no,
      password: hashedPassword,
    });
    delete user.password;
    const data = {
      user: {
        id: user._id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);

    success = true;
    return res.json({
      msg: "Registeration successfully",
      authtoken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(400).send(error);
  }
});

router.post("/auth/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.json({ msg: "Incorrect  email Id", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Password", status: false });
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken);
    success = true;
    return res.json({
      msg: "Loged In Successfully",
      authtoken,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

router.post("/api/sendotp", async (req, res) => {
  let data = await User.findOne({ email: req.body.email});
  // console.log(data);
  // console.log(req);
  if (data) {
    let otpcode = Math.floor(Math.random() * 10000 + 1).toString();
    console.log(otpcode);
    const salt = 10;
    const hashedOtp = await bcrypt.hash(otpcode, salt);
    let otpData = new verifyemailotp({
      email: req.body.email,
      code: hashedOtp,
      expire: Date.now() + 3600000,
      userId: req.body.id,
    });
    await otpData.save();
    mailer(data, otpcode);
   res.json({ "Success": "OTP Sent Successfully"});
  } else {
    res.json({ "Failed": "Email does not exist"});
  }
  res.status(200).json("Send");
});

router.post("/api/verifyotp", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      res.json({ msg: "Empty not allowed" });
    } else {
      const OtpVerifyicationRecord = await verifyemailotp.find({ email });
      console.log(OtpVerifyicationRecord);
      if (OtpVerifyicationRecord.length <= 0) {
        throw new Error("Email does not exists");
      } else {
        const { expired } = OtpVerifyicationRecord[0].expire;
        const hashedOtp = OtpVerifyicationRecord[0].code;
        // console.log(hashedOtp);
        // console.log(expired);
        console.log(OtpVerifyicationRecord[0], "gutguy");

        if (expired < Date.now()) {
          var del = await OtpVerifyicationRecord.deleteMany({ email });
          console.log(del, "khgguy");
          throw new Error(" Code has been expired");
        } else {
          const validOtp = await bcrypt.compare(code, hashedOtp);
          console.log(code, "dfggff", hashedOtp);
          console.log(validOtp);
          if (!validOtp) {
            throw new Error("Invalid OTP");
          } else {
            await User.updateOne({ email: req.body.email });
            await OtpVerifyicationRecord.delete({ PhoneNo });
            console.log();
            res.json({
              status: "VERIFIED",
              msg: "Email Verified ",
            });
          }
        }
      }
    }
    // console.log(OtpVerfyicationRecord);
  } catch (error) {
    res.json({
      status: "Failed",
      msg: error.message,
    });
  }
});

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password ");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
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
