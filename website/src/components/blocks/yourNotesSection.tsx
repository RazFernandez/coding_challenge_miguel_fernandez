"use client";

import HorizontalCenter from "../layout/horizontalCenter";
import HorizontalEnd from "../layout/horizontalEndProps";
import GridNotes from "../layout/gridNotes";
import SentimentFilterSelector from "./sentimentFilterSelector";
import { NoteApi } from "@/types/noteAPI";

import { useState, useEffect, useCallback } from "react";
import { Sentiment } from "@/types/sentiment";
import { NoteCardProps } from "./noteCard";
import { GET_ALL_NOTES } from "@/lib/graphql/getAllNotes";
import { GET_NOTES_BY_SENTIMENT } from "@/lib/graphql/getNotes";
import { useApolloClient } from "@apollo/client";

interface YourNotesSectionProps {
    sortedNotes: NoteCardProps[];
    initialNextToken?: string;
}

/**
 * Renders the section that displays the user's notes, allows filtering them by sentiment,
 * and handles pagination to fetch more notes dynamically from the AppSync API.
 * Notes can be filtered by sentiment type (happy, sad, angry, neutral), and are fetched
 * either using a general or sentiment-specific GraphQL query.
 */

export default function YourNotesSection({ sortedNotes, initialNextToken, }: YourNotesSectionProps) {
    
    const [sentiment, setSentiment] = useState<Sentiment>("All");
    const [notes, setNotes] = useState<NoteCardProps[]>(sortedNotes);
    const [nextToken, setNextToken] = useState<string | null>(initialNextToken || null);
    const [loading, setLoading] = useState(false);

    const client = useApolloClient();

    // Fetch notes based on sentiment change
    useEffect(() => {
        const fetchNotesBySentiment = async () => {
            setLoading(true);
            try {
                const isAll = sentiment === "All";
                const query = isAll ? GET_ALL_NOTES : GET_NOTES_BY_SENTIMENT;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const variables: any = {
                    limit: 10,
                    nextToken: null,
                };

                if (!isAll) {
                    variables.sentiment = sentiment.toLowerCase(); // e.g. "happy"
                }

                const { data } = await client.query({
                    query,
                    variables,
                    fetchPolicy: "network-only",
                });

                const items = isAll ? data.getAllNotes.items : data.getNotes.items;
                const token = isAll ? data.getAllNotes.nextToken : data.getNotes.nextToken;

                const newNotes: NoteCardProps[] = items.map((note: NoteApi) => ({
                    content: note.text,
                    sentiment: note.sentiment,
                    createdAt: note.dateCreated,
                }));

                setNotes(newNotes);
                setNextToken(token || null);
            } catch (error) {
                console.error("Error fetching notes by sentiment:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotesBySentiment();
    }, [sentiment, client]);

    // Handle pagination of the notes fetched
    const handleFetchMore = useCallback(async () => {
        if (!nextToken || loading) return;
        setLoading(true);
        try {
            const isAll = sentiment === "All";
            const query = isAll ? GET_ALL_NOTES : GET_NOTES_BY_SENTIMENT;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const variables: any = {
                limit: 10,
                nextToken,
            };

            if (!isAll) {
                variables.sentiment = sentiment.toLowerCase();
            }

            const { data } = await client.query({
                query,
                variables,
                fetchPolicy: "network-only",
            });

            const items = isAll ? data.getAllNotes.items : data.getNotes.items;
            const token = isAll ? data.getAllNotes.nextToken : data.getNotes.nextToken;

            const newNotes: NoteCardProps[] = items.map((note: NoteApi) => ({
                content: note.text,
                sentiment: note.sentiment,
                createdAt: note.dateCreated,
            }));

            setNotes((prev) => [...prev, ...newNotes]);
            setNextToken(token || null);
        } catch (error) {
            console.error("Error fetching more notes:", error);
        } finally {
            setLoading(false);
        }
    }, [client, nextToken, sentiment, loading]);

    // The actual rendered component notes
    return (
        <div className="max-w-7xl mx-auto px-4 pb-8">
            <HorizontalCenter className="pt-8 pb-8">
                <h2 className="text-2xl sm:text-3xl">Tus notas</h2>
            </HorizontalCenter>

            <HorizontalEnd className="mb-8 mr-4">
                <SentimentFilterSelector sentiment={sentiment} setSentiment={setSentiment} />
            </HorizontalEnd>

            <GridNotes notes={notes} />

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
