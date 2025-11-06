"use client";

import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  hydrate, 
  DehydratedState,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import NoteForm from "@/components/NoteForm/NoteForm";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import css from "./NotesPage.module.css";
import { useDebounce } from "use-debounce";




interface NotesClientProps {
  dehydratedState: unknown;
}

export default function NotesClient({ dehydratedState }: NotesClientProps) {
  const [queryClient] = useState(() => new QueryClient());

  if (dehydratedState) {
  hydrate(queryClient, dehydratedState as DehydratedState);
}


  return (
    <QueryClientProvider client={queryClient}>
      <NotesInner />
    </QueryClientProvider>
  );
}

function NotesInner() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce<string>(query, 1000);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const queryKey = ["notes", debouncedQuery, currentPage];

  const { data, isSuccess, isError } = useQuery({
    queryKey,
    queryFn: () => fetchNotes(debouncedQuery, currentPage),
    refetchOnMount: false,
  });

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const onChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const q = event.target.value;
    setQuery(q);
    setCurrentPage(1);
  };

  if (isError) {
    throw new Error("Failed to load notes");
  }

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={onChangeQuery} value={query} />
        {isSuccess && data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>

      {isSuccess && data && <NoteList notes={data.notes} />}

      {modalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
}
