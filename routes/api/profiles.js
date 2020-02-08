var express = require('express');
var router = express.Router();
var User = require('../../models/user');
var auth = require('../../modules/auth');
var loggedUser = auth.verifyToken;

router.use(loggedUser);

router.get('/:username', (req, res) => {
  let username = req.params.username
  User.findOne({ username }, "-password")
    .populate('following')
    .exec((err, profile) => {
      console.log(profile)
      res.json(profile)
    })
})

router.post('/:username/follow', (req, res) => {
  let username = req.params.username

  if (req.user.username === username) return res.status(400).json({ error: "you cannot follow yourself" })

  var user = User.findOneAndUpdate({ username })

})


// router.post("/user/:user_id/follow-user",  passport.authenticate("jwt", { session:false}), (req,res) => {

//   // check if the requested user and :user_id is same if same then 

//   if (req.user.id === req.params.user_id) {
//       return res.status(400).json({ alreadyfollow : "You cannot follow yourself"})
//   } 

//   User.findById(req.params.user_id)
//       .then(user => {

//           // check if the requested user is already in follower list of other user then 

//           if(user.followers.filter(follower => 
//               follower.user.toString() === req.user.id ).length > 0){
//               return res.status(400).json({ alreadyfollow : "You already followed the user"})
//           }

//           user.followers.unshift({user:req.user.id});
//           user.save()
//           User.findOne({ email: req.user.email })
//               .then(user => {
//                   user.following.unshift({user:req.params.user_id});
//                   user.save().then(user => res.json(user))
//               })
//               .catch(err => res.status(404).json({alradyfollow:"you already followed the user"}))
//       })
// })



// router.get("/:username", (req, res) => {
//   let username = req.params.username;
//   User.findOne({ username })
//     .populate({
//       path: "article favorited followers following",
//       populate: {
//         path: "author"
//       }
//     })
//     .exec((err, profile) => {
//       if (err) res.status(422).json({ err });
//       res.status(200).json({ success: true, profile });
//     });
// });


module.exports = router;