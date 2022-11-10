const router = require("express").Router();
const { hash } = require("bcrypt");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { error } = require("console");

//Register
router.post("/reg", async (req, res) => {
  try {
    //create encrypted pw
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(req.body.password, salt);
    // createw user
    const data = await new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    //save user in db and response on page
    const user = await data.save();
    return  res.status(200).json(user);
  } catch (err) {
    return  res.status(400).json('user name or email has aleady been taken');
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const validPassword=await bcrypt.compare(req.body.password,user.password)
    // if(user){
    //     res.status(200).send('login details found')
    // }
     if(!validPassword ){ return res.status(400).json('wrong password')}
     if(!user) { return res.status(404).json("user not found");}

     return res.status(200).send(user)
    console.log(user);
  } catch(err) {
    console.log(err)

    res.status(500).json("user not found");

  }
});

module.exports = router;
