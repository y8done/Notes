const ratelimit = require("../config/upstash");

const rateLimiter = async (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const result = await ratelimit.limit(req.ip);
        console.log("Rate limit result:", result); // <-- Add this line
        if (!result.success) {
            return res.status(429).send("Too Many Requests");
        }
        next();
    } catch (err) {
        console.error("Rate Limit error:", err);
        res.status(500).send("Server Error");
    }
};

module.exports = rateLimiter;