import { useEffect, useState } from 'react';
import React from 'react';
import Navbar from '../components/Navbar';
import RateLimitedUI from '../components/RateLimitedUI';
import axios from "axios";
import api from '../lib/axios';
import toast from 'react-hot-toast'
import NotesNotFound from '../components/NoteNotFound';
import NoteCard from '../components/NoteCard';
import { useNavigate } from 'react-router'; 
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NoteContext'; 
import { LoaderIcon, RefreshCw } from 'lucide-react';
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const isAuthenticated = useAuth().isAuthenticated;
  const navigate = useNavigate();

  const {
    globalNotes, 
    privateNotes, 
    fetchGlobalNotes, 
    fetchPrivateNotes, 
    loading,
    refreshNotes
  } = useNotes();
  const handleTabChange= (tab) => {
    if(tab == "private" && !isAuthenticated)
    {
      toast.error("Please login/Register to view your notes !");
      navigate("/login");
      return;
    }
    setActiveTab(tab);
  }
  // useEffect(() => {
  //   // const fetchNotes = async () => {
  //   //   try {
  //   //     const endpoint = activeTab === "private" ? "/notes" : "notes/global";

  //   //     if(activeTab === "private" && !isAuthenticated) return;
  //   //     const res = await api.get(endpoint);
  //   //     console.log(res.data);
  //   //     setNotes(res.data);
  //   //     setIsRateLimited(false);
  //   //   } catch (error) {
  //   //     console.log("Error fetching notes");
  //   //     console.log(error.response);
  //   //     if (error.response?.status === 429) {
  //   //       setIsRateLimited(true);
  //   //     } else {
  //   //       toast.error("Failed to load notes");
  //   //     }
  //   //   } finally {
  //   //     setLoading(false);
  //   //   }
  //   // };

  //   // fetchNotes();
  
  //   if(activeTab === "global")
  //   {
  //     fetchGlobalNotes();
      
  //   }else{
  //     fetchPrivateNotes();
  //   }
  // }, [activeTab, fetchGlobalNotes, fetchPrivateNotes]);

  // src/pages/HomePage.jsx

useEffect(() => {
    const loadNotes = async () => {
        // 1. Reset rate limit state initially
        setIsRateLimited(false); 
        
        let error = null;

        // 2. Call the context function and wait for the result
        if (activeTab === "global") {
            error = await fetchGlobalNotes();
        } else {
            error = await fetchPrivateNotes();
        }

        // 3. Check if the returned error is a 429
        if (error?.response?.status === 429) {
            setIsRateLimited(true);
        }
    };

    loadNotes();
    
}, [activeTab, fetchGlobalNotes, fetchPrivateNotes]);

  const notes = (activeTab === 'global' ? globalNotes : privateNotes) || [];
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed">
            {/* Global Tab */}
            <a 
              className={`tab ${activeTab === 'global' ? 'tab-active' : ''}`}
              onClick={() => handleTabChange('global')}
            >
              🌍 Global Feed
            </a>
            
            {/* Private Tab */}
            <a 
              className={`tab ${activeTab === 'private' ? 'tab-active' : ''}`}
              onClick={() => handleTabChange('private')}
            >
              🔒 My Private Notes
            </a>
          </div>
          {/* MANUAL REFRESH BUTTON */}
          <button 
            onClick={() => {
                if(activeTab === 'global') fetchGlobalNotes(true); // Force Refresh
                else fetchPrivateNotes(true);
            }} 
            className="btn btn-circle btn-ghost btn-sm"
            title="Refresh Notes"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading && <div className='text-center text-primary py-10'>Loading notes...</div>}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {notes.map((note) =>(
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )} 
      </div>
    </div>
  );
};

export default HomePage;