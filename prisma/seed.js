const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const bcrypt = require('bcryptjs');

require('dotenv').config();

// Use the same configuration as the app
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'famutimi95@gmail.com' },
    update: {},
    create: {
      email: 'famutimi95@gmail.com',
      name: 'Test User',
      password: hashedPassword,
      role: 'user',
      phone: '+1234567890',
    },
  });

  console.log('✅ Created test user:', user.email);
  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
