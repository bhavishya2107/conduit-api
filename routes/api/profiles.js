var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var auth = require('../../modules/auth');
var loggedUser = auth.verifyToken;

router.use(loggedUser);

//only for loggedIn users
//view user profile
router.get('/:username', (req, res) => {
  let username = req.params.username
  User.findOne({ username }, "-password")
    .populate('following')
    .exec((err, profile) => {
      console.log(profile)
      res.json(profile)
    })
})


//follow user
router.post('/:username/follow', async (req, res) => {
  username = req.params.username
  loginUser = req.user.UserId
  console.log(req.user)
  try {
    var user = await User.findOne({ username })
    console.log(user)
    if (!user.following.includes(loginUser)) {
      var follow = await User.findOneAndUpdate({ username }, { $push: { followers: req.user.UserId } }, { new: true })
      await User.findByIdAndUpdate(req.user.UserId, { $push: { following: follow.id } })
      res.json({ success: true, follow })
    } else {
      res.json({ msg: `you have already followed the ${username}`, follow })
    }
  } catch (error) {
    res.json({ msg: "Issue in following" })
  }
})

//unfollow user
router.delete('/:username/follow', async (req, res) => {
  username = req.params.username
  loginUser = req.user.UserId
  console.log(req.user)
  try {
    var user = await User.findOne({ username })
    console.log(user)
    if (user.following.includes(loginUser)) {
      var follow = await User.findOneAndUpdate({ username }, { $pull: { followers: req.user.UserId } }, { new: true })
      await User.findByIdAndUpdate(req.user.UserId, { $pull: { following: follow.id } })
      res.json({ success: true, msg: `successfully unfollowed ${username}` })
    } else {
      res.json({ msg: `you have already unfollowed the ${username}` })
    }
  } catch (error) {
    res.json({ msg: "Issue in following" })
  }
})


module.exports = router;