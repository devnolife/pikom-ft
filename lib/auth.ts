import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'NIM',
      credentials: {
        nim: { label: 'NIM', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.nim || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { nim: credentials.nim as string },
        });

        if (!user) return null;

        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          nim: user.nim,
          role: user.role,
          bidang: user.bidang,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.nim = (user as { nim: string }).nim;
        token.bidang = (user as { bidang?: string }).bidang;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { nim: string }).nim = token.nim as string;
        (session.user as { bidang?: string }).bidang = token.bidang as string | undefined;
      }
      return session;
    },
  },
});
