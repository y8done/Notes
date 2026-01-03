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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:false,
    },

    isGlobal :{
      type: Boolean,
      default: false,
    },

    authorName :{
      type: String,
      default: "Anonymous",
    }
  },

  { timestamps: true }
);

// 2- create a model

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
