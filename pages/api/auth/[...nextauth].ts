import NextAuth, {AuthOptions} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prismadb from "@/lib/prismadb";
import { compare } from "bcrypt";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: AuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || ''
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
        Credentials({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                },
                pwd: {
                    label: "Password",
                    type: "password",
                }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.pwd) {
                    console.log("Credentials: ", credentials);
                    throw new Error("Emails and passwords are required, email: " + credentials?.email + " password: " + credentials?.pwd );
                }
                const user = await prismadb.user.findUnique({
                    where:{
                        email: credentials.email
                    }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error("User not found");
                }

                const isCorrectPassword = await compare(
                    credentials.pwd,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error("Invalid email or password: " + user.hashedPassword + " " + credentials.pwd);
                }

                return user;
            }
        })
    ],
    pages:{
        signIn: "/auth",
    },
    debug: process.env.NODE_ENV === "development",
    adapter: PrismaAdapter(prismadb),
    session: {
        strategy: "jwt",
    },
    jwt: {
        secret: process.env.NEXTAUTH_JWT_SECRET,
    },
    secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);