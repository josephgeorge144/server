const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { error } = require("console");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    console.log(req.body.userId);
    console.log(req.params.id);

    return res.status(403).json("you can updqate only your account");
  }

  res.send("welocme new");
});

//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("Account has been deleted successfully");
    } catch (err) {
      console.log(req.body.userId);
      console.log(req.params.id);

      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
});

//getuserr
router.get("/", async (req, res) => {
  const userId=req.query.userId;
  const username=req.query.username;
  try {
    const user = userId ? await User.findById(userId) : await User.findOne({username:username});
    const { password, updatedAt, ...other } = user._doc;
    // user._doc is the returned user object from collection
    return res.status(200).json(other);
  } catch (err) {
    res.status(500).json("kityilla");
  }
});

//follow user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followins: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you are already following this person");
      }
    } catch (err) {
      res.status(500).json("sf");
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow

router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId } });
          await currentUser.updateOne({ $pull: { followins: req.params.id } });
          res.status(200).json("user has been unfollowed");
        } else {
          res.status(403).json("you are  not following this person");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant unfollow yourself");
    }
  });

  //get user friends,,
  router.get('/friends/:userId',async(req,res)=>{
    try{
      const user=await User.findById(req.params.userId);
      const friends=await Promise.all(user.followins.map((friendId)=>{
        return User.findById(friendId);
      }))

      let friendList=[];
      friends.map((friend)=>{
        const {_id,username,profilePicture}=friend;
        friendList.push({_id,username,profilePicture})


      })
      res.status(200).json(friendList)
    }
    catch(err){
      res.status(500).json(err)
    }
  })

module.exports = router;
