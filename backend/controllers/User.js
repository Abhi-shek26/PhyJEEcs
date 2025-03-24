const User = require('../models/User')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, {expiresIn: '90d'}) 
}

// login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body
  
    try {
      const user = await User.login(email, password)
  
      // create a token
      const token = createToken(user._id)
  
      res.status(200).json({email, token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }

// signup a user
const signupUser = async (req, res) => {
  const {email, password,name, year} = req.body

  try {
    const user = await User.signup(email, password, name, year)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

module.exports = { signupUser, loginUser }