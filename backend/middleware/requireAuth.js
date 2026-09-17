const jwt = require('jsonwebtoken')
const User = require('../models/User')

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
      return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  try {
      const { _id } = jwt.verify(token, process.env.SECRET);

      // Attach full user details to the request
      req.user = await User.findOne({ _id }).select("_id name email year isAdmin");

      if (!req.user) {
        return res.status(401).json({ error: "User no longer exists" });
      }

      next();
  } catch (error) {
      console.log(error);
      res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
