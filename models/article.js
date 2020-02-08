var mongoose = require('mongoose')
var slug = require('slug')
var Schema = mongoose.Schema

var articleSchema = new Schema({
  slug: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  favorited: Boolean,
  favoritesCount: {
    type: Number,
    default: 0
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true })



articleSchema.pre('save', function (next) {
  if (this.title && this.isModified('title')) {
    var slugged = slug(this.title, '-');
    this.slug = slugged + '-' + this._id
    next();
  } else {
    next();
  }
});

module.exports = mongoose.model('Article', articleSchema)