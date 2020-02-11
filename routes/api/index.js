var express = require('express');
var router = express.Router();
var Article = require('../../models/article');

var userRouter = require('./users');
var articleRouter = require('./articles');
var profilesRouter = require('./profiles');


router.get('/tags', async (req, res) => {
  try {
    var articles = await Article.find({})
    articles.forEach((article) => {
      res.json({success:true,tags:article.tagList})
    })
  } catch (error) {
    res.json(error)
  }
})

router.use('/', userRouter);
router.use('/articles', articleRouter);
router.use('/profiles', profilesRouter);

module.exports = router;
