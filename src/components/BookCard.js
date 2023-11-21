import { Box, Heading, Text, Image } from '@chakra-ui/react';
import Link from 'next/link';

const BookCard = ({ book }) => {
  return (
    <Link href={`/books/details/${book.id}`}>
      <Box
        maxW="sm"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        m={4}
        textAlign="left"
        boxShadow="md"
      >
        {book.image && (
          <Image src={book.image} alt={book.title} mb={4} borderRadius="md" />
        )}

        <Heading as="h3" size="md" mb={2} textAlign={'center'}>
          {book.title}
        </Heading>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Author: {book.author}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Publisher: {book.publisher}
        </Text>
        <Text fontSize="sm" color="gray.500" mb={2}>
          Year: {book.year}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Pages: {book.pages}
        </Text>
      </Box>
    </Link>
  );
};

export default BookCard;