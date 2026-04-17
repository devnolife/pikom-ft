import { Role, Jabatan } from '@prisma/client';
import 'next-auth';

declare module 'next-auth' {
  interface User {
    nim: string;
    role: Role;
    jabatan?: Jabatan | null;
    bidang?: string | null;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      nim: string;
      role: Role;
      jabatan?: Jabatan | null;
      bidang?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: Role;
    nim: string;
    jabatan?: Jabatan | null;
    bidang?: string | null;
  }
}
