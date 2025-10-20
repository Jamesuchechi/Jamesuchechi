const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@portfolio.com' },
    update: {},
    create: {
      email: 'admin@portfolio.com',
      password: hashedPassword,
      name: 'Admin User'
    }
  });

  console.log('Admin user created:', admin.email);

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Modern Marketing Website',
      category: 'NURA',
      year: 2025,
      description: 'A sleek and modern marketing website built with cutting-edge technologies, featuring smooth animations and responsive design.',
      imageUrl: '/images/project1.jpg',
      projectUrl: 'https://example.com/project1',
      githubUrl: 'https://github.com/username/project1',
      technologies: JSON.stringify(['Next.js', 'TailwindCSS', 'Framer Motion']),
      featured: true,
      order: 1
    }
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Full-Stack Recruitment Platform',
      category: 'Job Portal',
      year: 2025,
      description: 'A comprehensive job portal with user authentication, job listings, and application tracking system.',
      imageUrl: '/images/project2.jpg',
      projectUrl: 'https://example.com/project2',
      githubUrl: 'https://github.com/username/project2',
      technologies: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Express']),
      featured: true,
      order: 2
    }
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'SAAS Platform',
      category: 'Productivity SAAS',
      year: 2025,
      description: 'A productivity SaaS platform with subscription management, real-time collaboration, and analytics.',
      imageUrl: '/images/project3.jpg',
      projectUrl: 'https://example.com/project3',
      technologies: JSON.stringify(['Next.js', 'Prisma', 'PostgreSQL', 'Stripe']),
      featured: false,
      order: 3
    }
  });

  console.log('Sample projects created');
  console.log('\nâœ… Database seeded successfully!');
  console.log('\ní³§ Admin credentials:');
  console.log('   Email: admin@portfolio.com');
  console.log('   Password: admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
