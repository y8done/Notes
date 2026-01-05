const Note = require('../models/Note');
const mongoose = require('mongoose');

async function getGlobalNotes(req, res){
    try{
        const { search } = req.query;
        let query = {isGlobal:true};

        if(search){
            query.$or =[
                {title : {$regex: search, $options:"i"}},
                { content: { $regex: search, $options: "i" } }, // Match Content
                { tags: { $in: [new RegExp(search, "i")] } }
            ]
        }
        const notes = await Note.find(query).sort({createdAt:-1});
        res.status(200).json(notes);
    }catch(error){
        console.error("Error Fetching the notes !",error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function addGlobalNote(req, res){
    try{
        const { title, content, tags} = req.body;

        const newNote = new Note({
            title,
            content,
            tags: tags || [],
            isGlobal:true,
            user:null
        });

        await newNote.save();
        res.status(201).json({ message: 'Global note shared!', note: newNote });
    }catch(error){
        console.error("Error in creating a new note !",error);
        res.status(500).json({ message: "Internal server error" });
    }
}
async function getUserNotes(req, res) {
    try {
        const { search } = req.query;
        let query = { 
            user: new mongoose.Types.ObjectId(req.user.id || req.user._id),
            isGlobal: false
        };
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { content: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } }
            ];
        }
        const notes = await Note.find(query).sort({createdAt:-1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ message: "Internal server error" });
        
    }
}



async function addUserNote(req, res) {
    try {
        const { title, content,tags } = req.body;
        const newNote = new Note({ 
            title, 
            content,
            tags:Array.isArray(tags) ? tags : [],
            user: req.user.id, // Comes from authMiddleware
            isGlobal: false
         });

        await newNote.save();
        res.status(201).json({ message: 'Note created successfully', note: newNote });
    } catch (error) {
        console.error("Error in adding new note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function updateUserNote(req, res) {
    try {
        const { title, content ,tags} = req.body;
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        // 2. SECURITY CHECK: Does this note belong to the user?
        if (note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to edit this note" });
        }

        note.title = title || note.title;
        note.content = content || note.content;
        note.tags = tags || note.tags;
        await note.save();
        res.status(200).json(note);
    } catch (error) {
        console.error("Error in updating a note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteUserNote(req, res) {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: "Note not found" });

        // SECURITY CHECK: Only allow delete if the user owns it
        if (note.user && note.user.toString() !== req.user.id) {
            return res.status(401).json({ message: "Not authorized to delete this note" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted successfully" });
    } catch (error) {
        console.error("Error in deleting a note:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    getGlobalNotes,
    addGlobalNote,
    getUserNotes,
    addUserNote,
    updateUserNote,
    deleteUserNote
};