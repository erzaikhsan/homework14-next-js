import BookCard from "../components/BookCard";
import { Box, Flex } from "@chakra-ui/react";
import { getAllBooks } from "@/utils/fetch";
import Head from "next/head";

export default function Home({ books }) {
  return (
    <Box display={'flex'} m={5}>
      <Head>
        <title>Home</title>
      </Head>
      <Flex gap={5} wrap='wrap'>
        {books?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </Flex>
    </Box>
  );
}

export async function getServerSideProps() {
  try {
    const response = await getAllBooks();

    const books = response.data;

    return {
      props: { books },
    };
  } catch (error) {
    console.error('Error fetching books:', error.message || error);

    return {
      props: { books: [] },
    };
  }
}