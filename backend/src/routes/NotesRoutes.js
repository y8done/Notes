const express = require('express');
const noteController = require('../controllers/NotesController');
const {authMiddleware,verifyTokenOptional} = require('../middleware/authMiddleware');
const router = express.Router();
const Note = require("../models/Note")


async function getNoteById(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        if(note.isGlobal){
            return res.status(200).json(note);
        }

        if(!req.user || note.user.toString() !== req.user.id){
            return res.status(403).json({ message: "Access denied" });
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

router.get('/:id', verifyTokenOptional, getNoteById);
router.use(authMiddleware);


router.get('/', noteController.getUserNotes);

// POST /api/notes -> Create a private note
router.post('/', noteController.addUserNote);


// PUT /api/notes/:id -> Edit my private note
router.put('/:id', noteController.updateUserNote);

// DELETE /api/notes/:id -> Delete my private note
router.delete('/:id', noteController.deleteUserNote);

module.exports = router;