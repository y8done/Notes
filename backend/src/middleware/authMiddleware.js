const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    //1. Retrieve the token from the Authorization header
    const authHeader = req.header('Authorization');

    //2. Check if the token is present and properly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try{
        const token = authHeader.split(' ')[1];
        
        //3. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        //4. Attach the user information to the request object
        req.user = decoded;
        next();
    }catch(error){
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: "Internal server error" });
   }


}

module.exports = authMiddleware;