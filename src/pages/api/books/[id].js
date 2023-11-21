import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

async function authenticateTokenMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = user.userId;
        next();
    } catch (error) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

export const config = {
    api: {
        bodyParser: false,
        // externalResolver: true,
    }
};

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const bookId = req.query.id
        const id = parseInt(bookId);
        try {
            const book = await prisma.book.findUnique({
                where: { id },
            });

            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            return res.status(200).json(book);
        } catch (error) {
            console.error('Error fetching book:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        const bookId = req.query.id
        const id = parseInt(bookId);
        console.log('APIIIII ===>', req.body);
        try {
            const { title, author, publisher, year, pages } = req.body;

            const existingBook = await prisma.book.findUnique({
                where: { id },
            });

            if (!existingBook) {
                return res.status(404).json({ message: 'Book not found' });
            }

            const updatedBook = await prisma.book.update({
                where: { id },
                data: {
                    title: title || existingBook.title,
                    author: author || existingBook.author,
                    publisher: publisher || existingBook.publisher,
                    year: year || existingBook.year,
                    pages: pages || existingBook.pages,
                },
            });
            res.status(200).json({ book: updatedBook });
        }
        catch (err) {
            console.log(err);
            res.status(500).json({ message: err  });
        }
    } else if (req.method === 'DELETE') {
        const bookId = req.query.id
        const id = parseInt(bookId);
        try {
            const book = await prisma.book.delete({
                where: { id: Number(id) },
            });
            res.status(200).json({ message: "Book successfully deleted" });
        }
        catch (e) {
            console.log(e);
            res.status(400).json({ message: "Something went wrong" });

        }
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}