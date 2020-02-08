var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')
var gravatar = require('gravatar');
var Schema = mongoose.Schema

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    match: /@/,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  bio: {
    type: String
  },
  image: {
    type: String
  },
  following: {
    type: [Schema.Types.ObjectId],
    ref: "User"
  }
}, { timestamps: true })


//hash pw
userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    console.log(this.password);
    this.password = await bcrypt.hash(this.password, 10)
    console.log(this.password);
    next()
  }
  next()
})


//generate avatar image
userSchema.pre('save', async function (next) {
  var user = this
  var url = gravatar.url(user.email, { protocol: 'http', s: '200', r: 'pg', d: 'mm' });
  user.image = url
  next()
})

//verify pw
userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', userSchema)