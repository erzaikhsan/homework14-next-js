import multer from "multer";
import path from 'path';
import { PrismaClient } from "@prisma/client";
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), 'public/uploads'),
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(' ').join('-');
    cb(null, Date.now() + '-' + fileName);
  }
});

const upload = multer({ storage, limits: { fileSize: 10000000 } });

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
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const books = await prisma.book.findMany();
      // console.log('Books ==> ', books)
      if (!books.length) {
        return res.status(404).json({ message: 'Books not found' });
      }
      return res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  } else if (req.method === 'POST') {
    authenticateTokenMiddleware(req, res, () => {
      upload.single('image')(req, res, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'Error uploading image' });
        }
        const { title, author, publisher, year, pages } = req.body;

        if (req.file) {
          const imageUrl = `/uploads/${req.file.filename}`;

          const newBook = await prisma.book.create({
            data: {
              title,
              author,
              publisher,
              year: parseInt(year),
              pages: parseInt(pages),
              image: imageUrl
            }
          });

          res.status(201).json(newBook);
        } else {
          res.status(400).json({ message: 'Image file is required' });
        }
      });
    });
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}