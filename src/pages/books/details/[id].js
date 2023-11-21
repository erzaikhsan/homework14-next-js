import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Image,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Skeleton,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { deleteBook, getBookDetailById } from "@/utils/fetch";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function BookDetails({ response }) {
  const [book, setBook] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          setAuthenticated(true)
        }
        setBook(response);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchBook();

  }, [id]);

  async function handleDeleteBook() {
    try {
      await deleteBook(book.id);
      router.push('/');
    } catch (e) {
      console.log(e);
    }
  }


  return (
    <Box>
      <Head>
        <title>Details Book</title>
      </Head>
      {isLoading ? (
        <Skeleton height="300px" my="6" />
      ) : (
        <Flex my="6">
          <Box w="300px">
            <Image
              src={`http://localhost:3000/${book.image}`}
              alt={book.title}
            />
          </Box>
          <Box ml="8">
            <Heading as="h1" size="lg">
              {book.title}
            </Heading>
            <Text fontSize="xl" fontWeight="semibold" color="gray.500">
              {book.author}
            </Text>
            <Text fontSize="xl" fontWeight="semibold" color="gray.500">
              {book.publisher}
            </Text>
            <Text fontSize="xl" fontWeight="semibold" color="gray.500" mb="4">
              {book.year} | {book.pages} pages
            </Text>
          </Box>
        </Flex>
      )}
      {isAuthenticated && (
        <HStack>
          <Popover>
            <PopoverTrigger>
              <Button colorScheme="red">Delete</Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Confirmation!</PopoverHeader>
              <PopoverBody>
                Are you sure you want to delete this book?
              </PopoverBody>
              <Button onClick={handleDeleteBook} colorScheme="red">
                Delete
              </Button>
            </PopoverContent>
          </Popover>
          <Link href={`../edit/${book.id}`}>
            <Button>Edit</Button>
          </Link>
        </HStack>
      )}
    </Box>
  );
}

export async function getServerSideProps(context) {
  try {
    const id = context.params.id;
    const fetchData = await getBookDetailById(id);
    const response = JSON.parse(JSON.stringify(fetchData.data))
    return {
      props: { response },
    };
  } catch (error) {
    console.error('Error fetching book:', error.response || error);

    return {
      props: { books: [] },
    };
  }
}
