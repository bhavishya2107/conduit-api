var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var auth = require('../../modules/auth');
var jwt = require('jsonwebtoken');
var loggedUser = auth.verifyToken;
var updatePW = auth.updatePW;


//register user
router.post('/users', async (req, res) => {
  try {
    var user = await User.create(req.body.user)
    res.json({ success: "true", user })
  } catch (error) {
    res.status(400).json(error)
  }
})

//login user
router.post('/users/login', async (req, res) => {
  var { email, password } = req.body.user
  try {
    var user = await User.findOne({ email })
    if (!user) return res.json({ error: "email invalid" })
    var match = await user.verifyPassword(password)
    if (!match) return res.json({ error: "password does not match" })
    //jwt token auth
    var payload = { UserId: user.id, email: user.email }
    var token = await jwt.sign(payload, process.env.SECRET)
    user.token = token
    res.json({ success: "true", user })
  } catch (error) {
    res.status(400).json(error);
  }
})


// ------------------------------------only for logged user------------------------------------------------
router.use(loggedUser)

//get single user
router.get('/user', async (req, res) => {
  var { username } = req.body.user
  try {
    var user = await User.findOne({ username })
    if (user) return res.json({ success: "true", user })
  } catch (error) {
    res.json({ error: "User invalid", error })
  }
})

//update user
router.put('/user', async (req, res) => {
  let id = req.user.UserId;
  console.log(req.user)
  try {
    var updatedUser = await User.findByIdAndUpdate(id, req.body.user, { new: true })
    console.log(updatedUser)
    var updatePassword = await updatePW(updatedUser)
    console.log(updatePassword)
    res.json({ success: "true", updatedUser })
  } catch (error) {
    res.status(400).json(error)
  }
})

module.exports = router;