var express = require('express');
var router = express.Router();

var userRouter = require('./users');
var articleRouter = require('./articles');
var profilesRouter = require('./profiles');


router.use('/', userRouter);
router.use('/articles', articleRouter);
router.use('/profiles', profilesRouter);

module.exports = router;
