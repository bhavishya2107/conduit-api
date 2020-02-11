var express = require('express');
var router = express.Router();
var Article = require('../../models/article');

var userRouter = require('./users');
var articleRouter = require('./articles');
var profilesRouter = require('./profiles');


router.get('/tags', (req, res) => {
  Article.find({})
  .populate({path:'tagList'})
  .exec((err, tags) => {
    if(err) return res.json(err)
    res.json({tags})
  })
})

router.use('/', userRouter);

router.use('/articles', articleRouter);
router.use('/profiles', profilesRouter);

module.exports = router;
