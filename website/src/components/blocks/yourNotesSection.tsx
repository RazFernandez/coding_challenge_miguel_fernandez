"use client"

import HorizontalCenter from "../layout/horizontalCenter";
import HorizontalEnd from "../layout/horizontalEndProps";
import GridNotes from "../layout/gridNotes";
import SentimentFilterSelector from "./sentimentFilterSelector";
import { NoteApi } from "@/types/noteAPI";

import { useState, useMemo } from "react";
import { Sentiment } from "@/types/sentiment";
import { NoteCardProps } from "./noteCard";
import { GET_ALL_NOTES } from "@/lib/graphql/getAllNotes";
import { useApolloClient } from "@apollo/client";

interface YourNotesSectionProps {
    sortedNotes: NoteCardProps[];
    initialNextToken?: string;
}


export default function YourNotesSection({ sortedNotes, initialNextToken }: YourNotesSectionProps) {
    const [sentiment, setSentiment] = useState<Sentiment>("All");
    const [notes, setNotes] = useState<NoteCardProps[]>(sortedNotes);
    const [nextToken, setNextToken] = useState<string | null>(initialNextToken || null);
    const [loading, setLoading] = useState(false);

    const client = useApolloClient();

    // Filter notes by sentiment
    const filteredNotes = useMemo(() => {
        if (sentiment === "Happy") return notes.filter(note => note.sentiment === "happy");
        if (sentiment === "Sad") return notes.filter(note => note.sentiment === "sad");
        if (sentiment === "Angry") return notes.filter(note => note.sentiment === "angry");
        if (sentiment === "Neutral") return notes.filter(note => note.sentiment === "neutral");
        return notes;
    }, [sentiment, notes]);

    // Fetch more notes when paginating
    const handleFetchMore = async () => {
        if (!nextToken || loading) return;
        setLoading(true);
        try {
            const { data } = await client.query({
                query: GET_ALL_NOTES,
                variables: {
                    limit: 10,
                    nextToken,
                },
                fetchPolicy: "network-only", 
            });

            const newNotes: NoteCardProps[] = data.getAllNotes.items.map((note: NoteApi) => ({
                content: note.text,
                sentiment: note.sentiment,
                createdAt: note.dateCreated,
            }));

            setNotes(prev => [...prev, ...newNotes]);
            setNextToken(data.getAllNotes.nextToken || null);
        } catch (err) {
            console.error("Error fetching more notes:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 pb-8">
            <HorizontalCenter className="pt-8 pb-8">
                <h2 className="text-2xl sm:text-3xl">Tus notas</h2>
            </HorizontalCenter>

            <HorizontalEnd className="mb-8 mr-4">
                <SentimentFilterSelector sentiment={sentiment} setSentiment={setSentiment} />
            </HorizontalEnd>

            <GridNotes notes={filteredNotes} />

            {nextToken && (
                <HorizontalCenter>
                    <button
                        className="btn btn-primary mt-6"
                        onClick={handleFetchMore}
                        disabled={loading}
                    >
                        {loading ? "Cargando..." : "Cargar más"}
                    </button>
                </HorizontalCenter>
            )}
        </div>
    );
}