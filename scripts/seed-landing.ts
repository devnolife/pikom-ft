import { PrismaClient } from '@prisma/client';
import { seedLandingCMS } from '../lib/landing-cms-seed';

async function main() {
  const prisma = new PrismaClient();
  try {
    const result = await seedLandingCMS(prisma);
    console.log('Landing CMS seed:', result);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
