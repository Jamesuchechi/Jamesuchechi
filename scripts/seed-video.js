const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const url = 'https://youtu.be/zJQyoY7g7Nw?si=gF9WuxCWHUmNnNDT';
  
  // Deactivate others
  await prisma.video.updateMany({
    where: { active: true },
    data: { active: false },
  });

  const video = await prisma.video.create({
    data: {
      url,
      title: 'Featured Project Showcase',
      active: true,
    },
  });

  console.log('Successfully added video:', video);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
