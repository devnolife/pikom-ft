import { Role } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    nim: string;
    role: Role;
    bidang?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      nim: string;
      role: Role;
      bidang?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    nim: string;
    bidang?: string | null;
  }
}
