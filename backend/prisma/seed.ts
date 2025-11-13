/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// prisma/seed.ts
// Names of cafe and employee should be >6 and < 10 characters
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Upsert Cafes
  const cafesData = [
    {
      name: 'Morning',
      description: 'Best coffee in town.',
      location: 'Downtown',
    },
    {
      name: 'The Grind',
      description: 'A place to work and relax.',
      location: 'Uptown',
    },
    {
      name: 'Bean Bar',
      description: 'Artisan coffee and pastries.',
      location: 'Downtown',
    },
    {
      name: 'Espresso',
      description: 'Quick coffee on the go.',
      location: 'Central',
    },
    {
      name: 'Latte Lab',
      description: 'Experimental coffee creations.',
      location: 'Westside',
    },
  ];

  for (const cafe of cafesData) {
    await prisma.cafe.upsert({
      where: { name: cafe.name },
      update: {},
      create: cafe,
    });
  }
  console.log('Cafes seeded.');

  // Fetch cafes to get their IDs
  const cafe1 = await prisma.cafe.findUnique({ where: { name: 'Morning' } });
  const cafe2 = await prisma.cafe.findUnique({ where: { name: 'The Grind' } });
  const cafe3 = await prisma.cafe.findUnique({ where: { name: 'Bean Bar' } });
  const cafe4 = await prisma.cafe.findUnique({ where: { name: 'Espresso' } });

  if (!cafe1 || !cafe2 || !cafe3 || !cafe4) {
    console.error('Could not find all cafes after seeding.');
    process.exit(1);
  }

  // Create Employees
  const employeesData = [
    {
      id: 'UI1234567',
      name: 'Alicia',
      email_address: 'alicia@test.com',
      phone_number: '98765432',
      gender: Gender.female,
      start_date: new Date('2023-05-10'),
      cafeId: cafe1.id,
    },
    {
      id: 'UI7654321',
      name: 'Brobby',
      email_address: 'brobby@test.com',
      phone_number: '81234567',
      gender: Gender.male,
      start_date: new Date('2022-11-20'),
      cafeId: cafe1.id,
    },
    {
      id: 'UIAA11BB2',
      name: 'Driana',
      email_address: 'driana@test.com',
      phone_number: '92223333',
      gender: Gender.female,
      start_date: new Date('2024-01-15'),
      cafeId: cafe1.id,
    },
    {
      id: 'UICC33DD4',
      name: 'Edward',
      email_address: 'edward@test.com',
      phone_number: '88887777',
      gender: Gender.male,
      start_date: new Date('2023-08-22'),
      cafeId: cafe1.id,
    },
    {
      id: 'UIEE55FF6',
      name: 'Fioana',
      email_address: 'fioana@test.com',
      phone_number: '91112222',
      gender: Gender.female,
      start_date: new Date('2024-06-01'),
      cafeId: cafe1.id,
    },
    {
      id: 'UIGG77HH8',
      name: 'George',
      email_address: 'george@test.com',
      phone_number: '93334444',
      gender: Gender.male,
      start_date: new Date('2023-03-10'),
      cafeId: cafe2.id,
    },
    {
      id: 'UIII99JJ0',
      name: 'Hannah',
      email_address: 'hannah@test.com',
      phone_number: '85556666',
      gender: Gender.female,
      start_date: new Date('2024-02-20'),
      cafeId: cafe2.id,
    },
    {
      id: 'UIKKLLMM1',
      name: 'Briant',
      email_address: 'briant@test.com',
      phone_number: '97778888',
      gender: Gender.male,
      start_date: new Date('2023-12-05'),
      cafeId: cafe2.id,
    },
    {
      id: 'UINNOOPP2',
      name: 'Julisa',
      email_address: 'julisa@test.com',
      phone_number: '89990000',
      gender: Gender.female,
      start_date: new Date('2024-04-12'),
      cafeId: cafe3.id,
    },
    {
      id: 'UIQQRRSS3',
      name: 'Kevina',
      email_address: 'kevina@test.com',
      phone_number: '91113333',
      gender: Gender.male,
      start_date: new Date('2023-09-18'),
      cafeId: cafe3.id,
    },
    {
      id: 'UITTUVWW4',
      name: 'Laurra',
      email_address: 'laura@test.com',
      phone_number: '94445555',
      gender: Gender.female,
      start_date: new Date('2024-07-01'),
      cafeId: cafe4.id,
    },
    {
      id: 'UIABCDEFG',
      name: 'Charlie',
      email_address: 'charlie@test.com',
      phone_number: '99998888',
      gender: Gender.male,
    },
  ];

  for (const emp of employeesData) {
    await prisma.employee.upsert({
      where: { id: emp.id },
      update: {},
      create: emp,
    });
  }
  console.log('Employees seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
