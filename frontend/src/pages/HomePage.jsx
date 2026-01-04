import { useEffect, useState } from "react";
import React from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import axios from "axios";
import api from "../lib/axios";
import toast from "react-hot-toast";
import NotesNotFound from "../components/NoteNotFound";
import NoteCard from "../components/NoteCard";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useNotes } from "../context/NoteContext";
import { LoaderIcon, RefreshCw, Search, X } from "lucide-react";
const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [activeTab, setActiveTab] = useState("global");
  const isAuthenticated = useAuth().isAuthenticated;
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const {
    globalNotes,
    privateNotes,
    fetchGlobalNotes,
    fetchPrivateNotes,
    loading,
    refreshNotes,
  } = useNotes();
  const handleTabChange = (tab) => {
    if (tab == "private" && !isAuthenticated) {
      toast.error("Please login/Register to view your notes !");
      navigate("/login");
      return;
    }
    setActiveTab(tab);
    setSearchQuery("");
  };
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

  const notes = (activeTab === "global" ? globalNotes : privateNotes) || [];

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query)
    );
  });
  return (
    <div className="min-h-screen">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        <div className="flex justify-center mb-8">
          <div className="tabs tabs-boxed">
            {/* Global Tab */}
            <a
              className={`tab ${activeTab === "global" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("global")}
            >
              🌍 Global Feed
            </a>

            {/* Private Tab */}
            <a
              className={`tab ${activeTab === "private" ? "tab-active" : ""}`}
              onClick={() => handleTabChange("private")}
            >
              🔒 My Private Notes
            </a>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder="Search notes..."
                className="input input-bordered input-sm w-full pl-10 pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {/* Clear Button (only shows if typing) */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* MANUAL REFRESH BUTTON */}
            <button
              onClick={() => {
                if (activeTab === "global")
                  fetchGlobalNotes(true); // Force Refresh
                else fetchPrivateNotes(true);
              }}
              className="btn btn-circle btn-ghost btn-sm"
              title="Refresh Notes"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
        {loading && (
          <div className="text-center text-primary py-10">Loading notes...</div>
        )}
        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        


        { notes.length > 0 && filteredNotes.length === 0 && !isRateLimited && (
          <div className="text-center text-primary py-10">
            No notes found for "{searchQuery}"
          </div>
        )}


        {filteredNotes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard key={note._id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
