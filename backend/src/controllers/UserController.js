const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
async function hashPassword(plainPassword){
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(plainPassword,salt);
    return hashedPassword;
}

async function checkPassword(plainpassword,hashedPasswordFromDB){
    const isMatch = await bcrypt.compare(plainpassword,hashedPasswordFromDB);
    return isMatch;
}


async function registerUser(req,res) {
    try {
        const {name,username,email,password} = req.body;
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: "Email or username already in use." });
        }
        const hashedPassword = await hashPassword(password); // Await here
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword // Use 'password' field
        });
        await newUser.save(); // Save to DB

        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        console.error("Error in registering new user:", error);
        res.status(500).json({ message: "Internal server error" });      
    }
}
async function loginUser(req, res) {
   try {
        console.log('Login attempt', { body: req.body, ip: req.ip });

        const { username, password } = req.body || {};

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required" });
        }

        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not set in environment');
            return res.status(500).json({ message: "Server misconfigured (missing JWT secret)" });
        }

        const token = jwt.sign(
            { id: user._id },
            secret,
            { expiresIn: '1d' }
        );

        // Return token and minimal user info
        return res.status(200).json({ message: "Login successful", token, user: { id: user._id, username: user.username,name:user.name } });

    } catch (error) {
        console.error("Error in login user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {
    registerUser,
    loginUser
};