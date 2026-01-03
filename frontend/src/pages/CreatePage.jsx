import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import api from '../lib/axios';
import { ArrowLeftIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; // Import Auth Context
import { useNotes } from '../context/NoteContext';
const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  
  // New State for the toggle (Default to Global if you want)
  const [isGlobal, setIsGlobal] = useState(false); 
  const {refreshNotes } = useNotes();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth(); // Get login status

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    // Validation: Prevent guests from posting Private notes
    if (!isGlobal && !isAuthenticated) {
      toast.error("You must be logged in to create a private note!");
      return;
    }

    setLoading(true);
    try {
      // Dynamic Endpoint Selection
      const endpoint = isGlobal ? "/notes/global" : "/notes";
      
      await api.post(endpoint, {
        title,
        content
      });
      refreshNotes();
      toast.success(isGlobal ? "Posted to Global Feed! 🌍" : "Private Note Created! 🔒");
      navigate("/");
    } catch (error) {
      console.error("Error :", error);
      if (error.response?.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀"
        });
      } else {
        toast.error("Failed to create note! Please try again later");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto'>
          <Link to={"/"} className='btn btn-ghost mb-6'>
            <ArrowLeftIcon className='size-5' />
            Back to Notes
          </Link>
          <div className='card bg-base-100 shadow-xl'>
            <div className='card-body'>
              <h2 className='card-title text-2xl mb-4'>Create New Note</h2>
              <form onSubmit={handleSubmit}>
                
                {/* --- TITLE INPUT --- */}
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Title</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Note Title"
                    className='input input-bordered'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* --- CONTENT INPUT --- */}
                <div className='form-control mb-4'>
                  <label className='label'>
                    <span className='label-text'>Content</span>
                  </label>
                  <textarea 
                    placeholder="Write your note here..."
                    className='textarea textarea-bordered h-32'
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                {/* --- TOGGLE SWITCH --- */}
                <div className="form-control mb-6 bg-base-200 p-3 rounded-lg">
                  <label className="label cursor-pointer justify-start gap-4">
                    <span className="label-text font-bold">Post to Global Feed?</span> 
                    <input 
                      type="checkbox" 
                      className="toggle toggle-primary" 
                      checked={isGlobal} 
                      onChange={(e) => setIsGlobal(e.target.checked)} 
                    />
                  </label>
                  <div className="text-xs text-base-content/60 mt-1 pl-1">
                    {isGlobal 
                      ? "🌍 Public: Everyone can read this note." 
                      : "🔒 Private: Only you can see this note (Login required)."}
                  </div>
                </div>

                {/* --- SUBMIT BUTTON --- */}
                <div className="card-actions justify-end">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Creating..." : isGlobal ? "Publish Global Note" : "Save Private Note"}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePage