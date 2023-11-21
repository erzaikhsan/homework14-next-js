import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BookForm from "@/components/BookForm";
import { getBookDetailById } from "@/utils/fetch";
import { useRouter } from "next/router";
import Head from "next/head";

export default function EditBookPage({ response }) {
    const router = useRouter();
    const { id } = router.query;
    const [book, setBook] = useState(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setBook(response);
                console.log('EDITTTTTTT',response);
            } catch (e) {
                console.log(e);
            }
        };
        fetchBook();
    }, [id]);

    return (
        <Box>
            <Head>
                <title>Edit Book</title>
            </Head>
            <BookForm bookData={book} />
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