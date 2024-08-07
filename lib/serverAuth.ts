import {NextApiRequest, NextApiResponse} from "next";
import { getSession } from "next-auth/react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prismadb from "@/lib/prismadb";
import {getServerSession} from "next-auth";

const serverAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session?.user?.email) {
        throw new Error("Not signed in1 " + session);
    }

    const currentUser = await prismadb.user.findUnique({
        where: {
            email: session.user.email,
        }
    });

    if (!currentUser) {
        throw new Error("Not signed in2 ");
    }

    return { currentUser };
}

export default serverAuth;