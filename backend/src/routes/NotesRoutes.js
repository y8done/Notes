const express = require('express');
const noteController = require('../controllers/NotesController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const Note = require("../models/Note")


async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// GET /api/notes/global -> View all community notes
router.get('/global', noteController.getGlobalNotes);

// POST /api/notes/global -> Add a note anonymously
router.post('/global', noteController.addGlobalNote);

router.use(authMiddleware);


router.get('/', noteController.getUserNotes);

// POST /api/notes -> Create a private note
router.post('/', noteController.addUserNote);

router.get('/:id', getNoteById);
// PUT /api/notes/:id -> Edit my private note
router.put('/:id', noteController.updateUserNote);

// DELETE /api/notes/:id -> Delete my private note
router.delete('/:id', noteController.deleteUserNote);

module.exports = router;