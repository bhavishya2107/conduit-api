var express = require('express');
var router = express.Router();
var Article = require('../../models/article');
var Comment = require('../../models/comment');
var User = require('../../models/user');
var auth = require('../../modules/auth');
var loggedUser = auth.verifyToken;
var updateSlug = auth.upateSlug;


//get single article
router.get('/:slug', async (req, res) => {
  var query = req.params.slug
  try {
    var singleArticle = await Article.findOne({ slug: query })
    console.log(singleArticle)
    res.json(singleArticle)
  } catch (error) {
    res.status(400).json(error, { msg: "Article not found or slug is not appropriate" })
  }

})

//==================only for logged user===================
router.use(loggedUser)


//list all articles
router.get('/', async (req, res) => {
  try {
    var articles = await Article.find({})
    res.json({ success: true, articles })
  } catch (error) {
    res.json({ error, msg: "No articles found" })
  }

})

//create Article
router.post('/', async (req, res) => {
  try {
    var article = await Article.create(req.body.article)
    var articleWithUser = await Article.findOneAndUpdate(article.id, { author: req.user.UserId })
    res.json({ success: "true", articleWithUser })
  } catch (error) {
    res.status(400).json(error)
  }
})


//update Article
router.put('/:slug', async (req, res) => {
  var slug = req.params.slug
  try {
    var updatedArticle = await Article.findOneAndUpdate({ slug }, req.body.article, { new: true })
    var update = await updateSlug(updatedArticle)
    console.log(update)
    res.json(updatedArticle)
  } catch (error) {
    res.json(error, { msg: "slug invalid, article not updated" })
  }
})

//delete Article
router.delete('/:slug', async (req, res) => {
  var slug = req.params.slug
  try {
    await Article.findOneAndDelete({ slug })
    res.json({ success: true, msg: "Article Deleted" })
  } catch (error) {
    res.json({ error: "Article not deleted, invalid slug input" })
  }

})

// =======================COMMENTS========================================
//create comments
router.post('/:slug/comments', async (req, res) => {
  console.log(req.user)
  try {
    var comment = await Comment.create(req.body.comment)
    var commentWithUser = await Comment.findByIdAndUpdate(comment.id, { author: req.user.UserId }, { new: true })
    await Article.findOneAndUpdate({ slug: req.params.slug }, { $push: { comments: comment._id } }, { new: true })
    res.json({ success: true, commentWithUser })
  } catch (error) {
    res.json({ error, msg: "comment not created" })
  }
})

//delete comment
router.delete('/:slug/comments/:id', async (req, res) => {
  var slug = req.params.slug
  try {
    await Comment.findByIdAndDelete(req.params.id)
    await Article.findOneAndUpdate({ slug }, { $pull: { comments: req.params.id } })
    res.json({ success: "true", msg: `comment with ${req.params.id} is deleted` })
  } catch (error) {
    res.json({ error, msg: "comment could not be deleted" })
  }
})

//get all comments in an article
router.get('/:slug/comments', (req, res) => {
  console.log(req.user)
  var slug = req.params.slug
  Article.findOne({ slug })
    .populate({ path: 'comments', select: 'body' })
    .exec((err, comments) => {
      if (err) return res.json(err)
      res.json(comments)
    })
})

//like an article
router.post('/:slug/favorite', async (req, res) => {
  var slug = req.params.slug
  var user = req.user.UserId
  try {
    var article = await Article.findOne({ slug })
    console.log(article)
    if (!article.favorites.includes(user)) {
      await Article.findOneAndUpdate({ slug }, { $push: { favorites: user }, $inc: { favoritesCount: 1 } })
      await User.findByIdAndUpdate({ user }, { $push: { favorited: article.id } })
      console.log(article.id, "ID")
    } else {
      res.json({ msg: "Article already liked!!" })
    }
    res.json({ success: true, msg: "Article successfully liked" })
  } catch (error) {
    res.json({ error, msg: "Could not like the article" })
  }
})

//dislike an article
router.delete('/:slug/favorite', async (req, res) => {
  var slug = req.params.slug
  var user = req.user.UserId
  try {
    var article = await Article.findOne({ slug })
    if (article.favorites.includes(user)) {
      await Article.findOneAndUpdate({ slug }, { $pull: { favorites: user }, $inc: { favoritesCount: -1 } })
      await User.findByIdAndUpdate({ user }, { $pull: { favorited: article.id } })
    } else {
      res.json({ msg: "Article already disliked!!" })
    }
    res.json({ success: true, msg: "Article disliked" })
  } catch (error) {
    res.json({ error, msg: "Could not dislike the article" })
  }
})



module.exports = router;