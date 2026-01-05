import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [globalNotes, setGlobalNotes] = useState([]);
  const [privateNotes, setPrivateNotes] = useState([]);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  // Track if we have loaded initial data
  const [fetchedGlobal, setFetchedGlobal] = useState(false);
  const [fetchedPrivate, setFetchedPrivate] = useState(false);

  // Clear private notes on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setPrivateNotes([]);
      setFetchedPrivate(false);
    }
  }, [isAuthenticated]);

  // --- 1. FETCH GLOBAL NOTES ---
  const fetchGlobalNotes = useCallback(async (query = "") => {
      // LOGIC FIX: If there is a query, we MUST fetch (ignore cache).
      // Only skip if: No query AND we already fetched AND we aren't forcing.
      // if (!query && fetchedGlobal) return;
      
      setLoading(true);
      try {
        // ENDPOINT FIX: Added "/global"
        const res = await api.get(`/notes/global?search=${query}`);
        setGlobalNotes(res.data);
        
        // Only mark as "fetched" if it was a full load (no search)
        if (!query) setFetchedGlobal(true);
        return null;
      } catch (error) {
        console.error("Error fetching global notes:", error);
        if (error.response?.status === 429) return error;
        toast.error("Failed to load global notes");
      } finally {
        setLoading(false);
      }
    },
    [fetchedGlobal]
  );

  // --- 2. FETCH PRIVATE NOTES ---
  const fetchPrivateNotes = useCallback(async ( query = "") => {
      if (!isAuthenticated) return;
      // LOGIC FIX: Always fetch if searching
      // if (!query && fetchedPrivate) return;

      setLoading(true);
      try {
        // Endpoint is correct here (/notes)
        const res = await api.get(`/notes?search=${query}`);
        setPrivateNotes(res.data);
        
        if (!query) setFetchedPrivate(true);
        return null;
      } catch (error) {
        console.error("Error fetching private notes:", error);
        if (error.response?.status === 429) return error;
        toast.error("Failed to load your notes");
      } finally {
        setLoading(false);
      }
    },
    [fetchedPrivate, isAuthenticated]
  );

  const refreshNotes = () => {
    
    setFetchedGlobal("");
    setFetchedPrivate("");
    // Optionally trigger fetches immediately here if needed
  };

  return (
    <NoteContext.Provider
      value={{
        globalNotes,
        privateNotes,
        fetchGlobalNotes,
        fetchPrivateNotes,
        refreshNotes,
        loading,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NoteContext);
};