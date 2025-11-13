/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// prisma/seed.ts
// Names of cafe and employee should be >6 and < 10 characters
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Cafes
  const cafe1 = await prisma.cafe.upsert({
    where: { name: 'Morning' },
    update: {},
    create: {
      name: 'Morning',
      description: 'Best coffee in town.',
      location: 'Downtown',
    },
  });

  const cafe2 = await prisma.cafe.upsert({
    where: { name: 'The Grind' },
    update: {},
    create: {
      name: 'The Grind',
      description: 'A place to work and relax.',
      location: 'Uptown',
    },
  });

  const cafe3 = await prisma.cafe.upsert({
    where: { name: 'Bean Bar' },
    update: {},
    create: {
      name: 'Bean Bar',
      description: 'Artisan coffee and pastries.',
      location: 'Downtown',
    },
  });

  const cafe4 = await prisma.cafe.upsert({
    where: { name: 'Espresso' },
    update: {},
    create: {
      name: 'Espresso',
      description: 'Quick coffee on the go.',
      location: 'Central',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cafe5 = await prisma.cafe.upsert({
    where: { name: 'Latte Lab' },
    update: {},
    create: {
      name: 'Latte Lab',
      description: 'Experimental coffee creations.',
      location: 'Westside',
    },
  });

  // Create Employees for cafe1 (Morning) - 5 employees
  await prisma.employee.upsert({
    where: { id: 'UI1234567' },
    update: {},
    create: {
      id: 'UI1234567',
      name: 'Alicia',
      email_address: 'alicia@test.com',
      phone_number: '98765432',
      gender: Gender.female,
      start_date: new Date('2023-05-10'),
      cafe: {
        connect: { id: cafe1.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UI7654321' },
    update: {},
    create: {
      id: 'UI7654321',
      name: 'Brobby',
      email_address: 'brobby@test.com',
      phone_number: '81234567',
      gender: Gender.male,
      start_date: new Date('2022-11-20'),
      cafe: {
        connect: { id: cafe1.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UIAA11BB2' },
    update: {},
    create: {
      id: 'UIAA11BB2',
      name: 'Driana',
      email_address: 'driana@test.com',
      phone_number: '92223333',
      gender: Gender.female,
      start_date: new Date('2024-01-15'),
      cafe: {
        connect: { id: cafe1.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UICC33DD4' },
    update: {},
    create: {
      id: 'UICC33DD4',
      name: 'Edward',
      email_address: 'edward@test.com',
      phone_number: '88887777',
      gender: Gender.male,
      start_date: new Date('2023-08-22'),
      cafe: {
        connect: { id: cafe1.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UIEE55FF6' },
    update: {},
    create: {
      id: 'UIEE55FF6',
      name: 'Fioana',
      email_address: 'fioana@test.com',
      phone_number: '91112222',
      gender: Gender.female,
      start_date: new Date('2024-06-01'),
      cafe: {
        connect: { id: cafe1.id },
      },
    },
  });

  // Create Employees for cafe2 (The Grind) - 3 employees
  await prisma.employee.upsert({
    where: { id: 'UIGG77HH8' },
    update: {},
    create: {
      id: 'UIGG77HH8',
      name: 'George',
      email_address: 'george@test.com',
      phone_number: '93334444',
      gender: Gender.male,
      start_date: new Date('2023-03-10'),
      cafe: {
        connect: { id: cafe2.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UIII99JJ0' },
    update: {},
    create: {
      id: 'UIII99JJ0',
      name: 'Hannah',
      email_address: 'hannah@test.com',
      phone_number: '85556666',
      gender: Gender.female,
      start_date: new Date('2024-02-20'),
      cafe: {
        connect: { id: cafe2.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UIKKLLMM1' },
    update: {},
    create: {
      id: 'UIKKLLMM1',
      name: 'Briant',
      email_address: 'briant@test.com',
      phone_number: '97778888',
      gender: Gender.male,
      start_date: new Date('2023-12-05'),
      cafe: {
        connect: { id: cafe2.id },
      },
    },
  });

  // Create Employees for cafe3 (Bean Bar) - 2 employees
  await prisma.employee.upsert({
    where: { id: 'UINNOOPP2' },
    update: {},
    create: {
      id: 'UINNOOPP2',
      name: 'Julisa',
      email_address: 'julisa@test.com',
      phone_number: '89990000',
      gender: Gender.female,
      start_date: new Date('2024-04-12'),
      cafe: {
        connect: { id: cafe3.id },
      },
    },
  });

  await prisma.employee.upsert({
    where: { id: 'UIQQRRSS3' },
    update: {},
    create: {
      id: 'UIQQRRSS3',
      name: 'Kevina',
      email_address: 'kevina@test.com',
      phone_number: '91113333',
      gender: Gender.male,
      start_date: new Date('2023-09-18'),
      cafe: {
        connect: { id: cafe3.id },
      },
    },
  });

  // Create Employee for cafe4 (Espresso) - 1 employee
  await prisma.employee.upsert({
    where: { id: 'UITTUVWW4' },
    update: {},
    create: {
      id: 'UITTUVWW4',
      name: 'Laurra',
      email_address: 'laura@test.com',
      phone_number: '94445555',
      gender: Gender.female,
      start_date: new Date('2024-07-01'),
      cafe: {
        connect: { id: cafe4.id },
      },
    },
  });

  // Cafe5 (Latte Lab) - No employees (to test empty cafe)

  await prisma.employee.upsert({
    where: { id: 'UIABCDEFG' },
    update: {},
    create: {
      id: 'UIABCDEFG',
      name: 'Charlie',
      email_address: 'charlie@test.com',
      phone_number: '99998888',
      gender: Gender.male,
      // No cafe assignment
    },
  });

  console.log(`Seeding finished.`);
  console.log(`Created 5 cafes and 13 employees`);
  console.log(`- Morning: 5 employees`);
  console.log(`- The Grind: 3 employees`);
  console.log(`- Bean Bar: 2 employees`);
  console.log(`- Espresso: 1 employee`);
  console.log(`- Latte Lab: 0 employees`);
  console.log(`- Unassigned: 1 employee`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
