const jwt = require("jsonwebtoken");
const { User } = require("../database/model");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header

      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded._id);

      if (req.user) {
        next();
      } else {
        res.status(400).json({ message: "Unknown user" });
      }
    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }
  }
  // ===============
  // notes for line 20 to line 29:
  // - if User.findById throws an exception, it needs to be caught by the catch block; the catch block will return status 401 to
  // frontend, and axios treats it as an exception, so it will be caught by the catch block in the onsubmit function in the frontend
  // - if User.findById does not throw an exception, but req.user does not exist, it will return status code 400 to frontend,
  // and the response will still be caught in the catch block in frontend.
  // ===================

  // if no req.headers.authorization, then no token
  if (!token) {
    res.status(400).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
