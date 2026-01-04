const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const token = authHeader.split(" ")[1]; // 1. Remove "Bearer "
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(401).json({ message: "Token is not valid" }); // Changed to 401 for clarity
  }
}

const verifyTokenOptional = (req, res, next) => {
  const authHeader = req.header("Authorization");

  // 1. If no header or doesn't start with Bearer, treat as guest
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  try {
    // 2. IMPORTANT: Split the token here too!
    const token = authHeader.split(" ")[1]; 
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    req.user = null; // Invalid/Expired token -> treat as guest
    next();
  }
};

module.exports = { authMiddleware, verifyTokenOptional };