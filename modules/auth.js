const jwt = require('jsonwebtoken');
const slug = require('slug')

module.exports = {
  generateJWT: async (user) => {
    var payload = { userId: user.id, email: user.email };
    var token = await jwt.sign(payload, process.env.SECRET);
    return token;
  },
  verifyToken: async (req, res, next) => {
    var token = req.headers['authorization'] || "";
    if (token) {
      try {
        var payload = await jwt.verify(token, process.env.SECRET);
        req.user = payload;
        req.user.token = token;
        next();
      } catch (error) {
        res.json({ message: "invalid token", error });
      }
    } else {
      res.json({ msg: 'Token required' });
    }
  },
  upateSlug: (article) => {
    var slugged = slug(article.title, '-')
    article.slug = slugged + '-' + article._id
  }
}