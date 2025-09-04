const Note = require('../models/Note');

async function getAllNotes(req, res) {
    try {
        const notes = await Note.find().sort({createdAt:-1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

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

async function addnote(req, res) {
    try {
        const { title, content } = req.body;
        const newNote = new Note({ title, content });

        await newNote.save();
        res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error("Error in adding new note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updatenote(req, res) {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(
            req.params.id,
            { title, content },
            { new: true }
        );
        if (!updatedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error in updating a note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deletenote(req, res) {
    try {
        const deletedNote = await Note.findByIdAndDelete(req.params.id);
        if (!deletedNote) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleting a note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getAllNotes,
    getNoteById,
    addnote,
    updatenote,
    deletenote
};