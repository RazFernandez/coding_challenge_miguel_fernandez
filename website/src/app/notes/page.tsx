
import { createApolloSSRClient } from "@/lib/apolloSSRClient"
import { GET_ALL_NOTES } from "@/lib/graphql/getAllNotes"
import { NoteCardProps } from "@/components/blocks/noteCard"
import { NoteApi } from "@/types/noteAPI"
import YourNotesSection from "@/components/blocks/yourNotesSection"


export default async function NotesPage() {
    const client = createApolloSSRClient();

    const { data } = await client.query({
        query: GET_ALL_NOTES,
        variables: { limit: 10 },
    });



    // Fetch and sort the Notes DESCENDING by date by default
    const notes: NoteCardProps[] = data.getAllNotes.items.map((note: NoteApi) => ({
        content: note.text,
        sentiment: note.sentiment,
        createdAt: note.dateCreated,
    }))

    const nextToken = data.getAllNotes.nextToken || null;
        
    return (
        <>
            <YourNotesSection sortedNotes={notes} initialNextToken={nextToken} />
        </>
    );
}