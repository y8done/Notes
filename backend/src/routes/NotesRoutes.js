const express = require('express');
const { addnote, deletenote, getAllNotes, updatenote, getNoteById } = require('../controllers/NotesController');

const router = express.Router();

router.get("/", getAllNotes);
router.get("/:id", getNoteById);
router.post("/", addnote);
router.put("/:id", updatenote);
router.delete("/:id", deletenote);

module.exports = router;