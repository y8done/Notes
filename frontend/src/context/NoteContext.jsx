import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { createContext, useContext, useState, useEffect,useCallback } from "react";
import toast from "react-hot-toast";

const NoteContext = createContext();

export const NoteProvider = ({ children }) => {
  const [globalNotes, setGlobalNotes] = useState([]);
  const [privateNotes, setPrivateNotes] = useState([]);
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);

  const [fetchedglobal, setFetchedGlobal] = useState(false);
  const [fetchedprivate, setFetchedPrivate] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setPrivateNotes([]);
      setHasFetchedPrivate(false);
    }
  }, [isAuthenticated]);

  const fetchGlobalNotes = useCallback(
    async (forceRefresh = false) => {
      if (fetchedglobal && !forceRefresh) return;
      setLoading(true);
      try {
        const res = await api.get("/notes/global");
        setGlobalNotes(res.data);
        setFetchedGlobal(true);
        return null;
      } catch (error) {
        console.error("Error fetching global notes:", error);
        if (error.response?.status === 429) {
            return error; 
        }
        toast.error("Failed to load global notes");
      } finally {
        setLoading(false);
      }
    },
    [fetchedglobal]
  );

  const fetchPrivateNotes = useCallback(
    async (forceRefresh = false) => {
      if (!isAuthenticated) return;

      if (fetchedprivate && !forceRefresh) return;
      setLoading(true);
      try {
        const res = await api.get("/notes/");
        setPrivateNotes(res.data);
        setFetchedPrivate(true);
        return null;
      } catch (error) {
        console.error("Error fetching private notes:", error);
        if (error.response?.status === 429) {
            return error;
        }
        toast.error("Failed to load your notes");
      } finally {
        setLoading(false);
      }
    },
    [fetchedprivate, isAuthenticated]
  );

  const refreshNotes = () =>{
    setFetchedGlobal(false);
    setFetchedPrivate(false);
  }

  return (
    <NoteContext.Provider
    value={{
        globalNotes,
        privateNotes,
        fetchGlobalNotes,
        fetchPrivateNotes,
        refreshNotes,
        loading
    }}>
        {children}
    </NoteContext.Provider>
  );
};

export const useNotes = () => {
  return useContext(NoteContext);
}


