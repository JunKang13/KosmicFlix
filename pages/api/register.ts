import bcrypt from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from "@/lib/prismadb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).end();
    }
    try {
        const { email, userName, pwd } = req.body;
        const existingUser = await prismadb.user.findUnique({
            where: {
                email,
            }
        });

        if (existingUser) {
            return res.status(422).json({ error: "Email Already Taken" });
        }

        const hashedPassword = await bcrypt.hash(pwd, 10);

        const user = await prismadb.user.create({
            data: {
                email,
                name: userName,
                hashedPassword,
                image: "",
                emailVerified: new Date(),
            }
        });

        return res.status(200).json(user);
    } catch (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred', details: err });
    }
}