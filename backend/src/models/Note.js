const mongoose = require("mongoose");

// 1- create a schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// 2- create a model

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
