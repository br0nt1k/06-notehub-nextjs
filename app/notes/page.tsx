import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

export default async function Notes() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["Notes", "", 1],
    queryFn: () => fetchNotes("", 1),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      {}
      <NotesClient />
    </HydrationBoundary>
  );
}