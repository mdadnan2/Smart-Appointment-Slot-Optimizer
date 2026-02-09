import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      name: true,
    }
  });
  
  console.log('📋 Users in database:');
  users.forEach(u => {
    console.log(`  - ${u.email} (${u.role}) - ${u.name}`);
  });
  
  await prisma.$disconnect();
}

checkUsers();
