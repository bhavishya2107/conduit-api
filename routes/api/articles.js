var express = require('express');
var router = express.Router();
var Article = require('../../models/article');
var auth = require('../../modules/auth');
var loggedUser = auth.verifyToken
var updateSlug = auth.upateSlug


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
    res.json({success:true, articles})
  } catch (error) {
    res.json({error, msg:"No articles found"})
  }

})

//create Article
router.post('/', async (req, res) => {
  try {
    var article = await Article.create(req.body.article)
    console.log(article)
    res.json({ success: "true", article })
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
    await Article.findOneAndDelete({slug})
    res.json({success:true,msg:"Article Deleted"})
  } catch (error) {
    res.json({error:"Article not deleted, invalid slug input"})
  }
 
})



module.exports = router;