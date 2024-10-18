import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from "./lib/db";
import bcrypt from "bcryptjs";
import { Student, HostelStaff } from "@prisma/client"
import {PrismaAdapter} from "@auth/prisma-adapter"
import type { Adapter } from '@auth/core/adapters';


export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        CredentialsProvider({
            id: "user",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<Student | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }
                const email = credentials.email as string;
                const password = credentials.password as string;
                console.log('email', email, 'password', password);

                const customer = await prisma.student.findUnique({
                    where: {
                        email,
                    },
                });
                if (!customer || !(await bcrypt.compare(password, customer.password))) {
                    throw new Error("Invalid credentials");
                }
                return customer;
            },
        }),
        CredentialsProvider({
            id: "admin",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials): Promise<HostelStaff | null> {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials");
                }
                const email = credentials.email as string;
                const password = credentials.password as string;

                const customer = await prisma.hostelStaff.findUnique({
                    where: {
                        email,
                    },
                });
                if (!customer || !(await bcrypt.compare(password, customer.password))) {
                    throw new Error("Invalid credentials");
                }
                return customer;
            },
        }),
    ],
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id ?? '';
                token.role = user.role;
            }
            return token
        },
        session({ session, token }) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session
        },
    },
});