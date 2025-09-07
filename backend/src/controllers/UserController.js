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
        const { username, password } = req.body;
 
        // 1. Use findOne() to get a single user object, not an array.
        const user = await User.findOne({ username: username });

        // 2. Combine user and password check into one block.
        // Use bcrypt.compare directly for clarity.
        if (!user || !(await bcrypt.compare(password, user.password))) {
            // 3. Use 401 Unauthorized for authentication failures.
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({ message: "Login successful", token: token });

    } catch (error) {
        console.error("Error in login user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
module.exports = {
    registerUser,
    loginUser
};