import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { email, password } = req.body;
            const user = await prisma.user.findUnique({ where: { email } });

            if (!user) {
                return res.status(400).json({ error: "Invalid credentials. User not found." });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(400).json({ error: "Invalid credentials. Password does not match." });
            }

            const token = jwt.sign({
                userId: user.id,
            }, process.env.JWT_SECRET);
            return res.json({ token });
        } catch (error) {
            return res.status(400).json({ error: "Invalid credentials. An error occurred during login." });
        }
    }
    return res.status(405).json({ message: "Invalid method" });
}