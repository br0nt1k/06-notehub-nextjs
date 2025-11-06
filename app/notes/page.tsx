// app/notes/page.tsx
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
  const queryClient = new QueryClient();

  // Використовуємо об'єктну форму prefetchQuery і явно передаємо queryKey як масив
  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1],
    queryFn: () => fetchNotes("", 1),
  });

  const dehydratedState = dehydrate(queryClient);

  return <NotesClient dehydratedState={dehydratedState} />;
}
