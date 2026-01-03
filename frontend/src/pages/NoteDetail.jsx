import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import { ArrowLeftIcon, Trash2Icon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext"; // 1. Import Auth Context
import { useNotes } from "../context/NoteContext";
const NoteDetail = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [summary, setSummary] = useState("");
  const [summarizing, setSummarizing] = useState(false);
  const { user } = useAuth(); // 2. Get current user
  const { refreshNotes } = useNotes();
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
        navigate("/"); // Redirect on error
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [id, navigate]);

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      refreshNotes();
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note ?")) return;
    try {
      await api.delete(`/notes/${id}`);
      refreshNotes();
      toast.success("Note Deleted Successfully");
      navigate("/");
    } catch (error) {
      console.log("Error in handleDelete:", error);
      toast.error("Failed to delete the note ! try again later !!!");
    }
  };

  const handleSummarize = async () => {
    if(!note || !note.content.trim()) {
      toast.error("Note content is empty ! Cannot summarize")
      return;
    }
    setSummarizing(true);
    try {
      const res = await api.post("/ai/summarize", { text: note.content });
      setSummary(res.data.summary);
      toast.success("Summary generated successfully");
    } catch (error) {
      console.log("Error in handleSummarize:", error);
      toast.error("Failed to generate summary! Please try again later");
    }
    finally {
      setSummarizing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  // 3. Helper to check if current user owns this note
  // A note is editable if: It is NOT global OR (It is global AND I am the admin/creator)
  // For your current logic: Global = Read Only. Private = Editable.
  const isEditable = note && !note.isGlobal; 

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>

            {/* 4. ONLY SHOW DELETE IF EDITABLE */}
            {isEditable && (
              <button
                onClick={handleDelete}
                className="btn btn-error btn-outline"
              >
                <Trash2Icon className="h-5 w-5" />
                Delete Note
              </button>
            )}
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              
              {/* GLOBAL NOTE WARNING BANNER */}
              {note.isGlobal && (
                 <div role="alert" className="alert alert-info mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>This is a Global Note. It is read-only.</span>
                 </div>
              )}

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered"
                  value={note.title}
                  readOnly={!isEditable} // 5. Disable input if Global
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32"
                  value={note.content}
                  readOnly={!isEditable} // 5. Disable input if Global
                  onChange={(e) =>
                    setNote({ ...note, content: e.target.value })
                  }
                />
                {summary && (
                  <div className="mt-6 p-4 bg-base-200 rounded-lg border border-gray-300 shadow-sm">
                    <h3 className="font-semibold mb-2 text-lg text-primary">
                      Summary
                    </h3>
                    <p className="whitespace-pre-line text-base text-gray-700">
                      {summary}
                    </p>
                  </div>
                )}
              </div>

              <div className="card-actions justify-between">
                <button
                  className="btn btn-secondary"
                  onClick={handleSummarize}
                  disabled={summarizing}
                >
                  {summarizing ? "Summarizing..." : "Summarize Note"}
                </button>

                {/* 6. HIDE SAVE BUTTON IF NOT EDITABLE */}
                {isEditable && (
                  <button
                    className="btn btn-primary"
                    disabled={saving}
                    onClick={handleSave}
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;