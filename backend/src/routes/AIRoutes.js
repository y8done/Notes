const {summarization} = require("../controllers/AIController");
const express = require('express')
const router = express.Router();

router.post("/summarize", summarization);

module.exports = router;
