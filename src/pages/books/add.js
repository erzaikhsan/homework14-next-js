import BookForm from "@/components/BookForm";
import { Box } from "@chakra-ui/react";
import Head from "next/head";

export default function AddBook() {
  return (
    <Box m={5}>
      <Head>
        <title>Add Book</title>
      </Head>
      <BookForm />
    </Box>
  );
}