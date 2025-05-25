// src/components/NoteList.tsx
import { Unsubscribe } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';

import { subscribeToNotes } from '../services/noteService';
import { Note, Notes } from '../types/Note';
import NoteItem from './NoteItem';

interface NoteListProps {
  onEditNote?: (note: Note) => void;
}
// TODO: remove the eslint-disable-next-line when you implement the onEditNote handler
const NoteList: React.FC<NoteListProps> = ({ onEditNote }) => {
  // TODO: load notes using subscribeToNotes from noteService, use useEffect to manage the subscription; try/catch to handle errors (see lab 3)
  // TODO: handle unsubscribing from the notes when the component unmounts
  // TODO: manage state for notes, loading status, and error message
  // TODO: display a loading message while notes are being loaded; error message if there is an error

  // Notes is a constant in this template but needs to be a state variable in your implementation and load from firestore

  const [notes, setNotes] = useState<Notes>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: Unsubscribe = () => {};
    try {
      unsubscribe = subscribeToNotes(
        (newNotes) => {
          setNotes(newNotes);
          setLoading(false);
        },
        () => {
          setError('error: Failed to load notes');
          setLoading(false);
        },
      );

      return () => {
        unsubscribe();
      };
    } catch {
      setError('error: Failed to load notes');
      setLoading(false);
    }
  }, []);

  return (
    <div className="note-list">
      <h2>Notes</h2>
      {loading && <p>Loading Notes</p>}
      {error && <p className="error-message">{error}</p>}
      {!error && !loading && Object.values(notes).length === 0 && (
        <p>No notes yet. Create your first note!</p>
      )}
      {!error && !loading && Object.values(notes).length > 0 && (
        <div className="notes-container">
          {Object.values(notes)
            // Sort by lastUpdated (most recent first)
            .sort((a, b) => b.lastUpdated - a.lastUpdated)
            .map((note) => (
              <NoteItem key={note.id} note={note} onEdit={onEditNote} />
            ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;
