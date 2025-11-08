// prisma/seed.ts
import { PrismaClient, Gender } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // Create Cafes
  const cafe1 = await prisma.cafe.create({
    data: {
      name: 'Morning Brew',
      description: 'Best coffee in town.',
      location: 'Downtown',
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const cafe2 = await prisma.cafe.create({
    data: {
      name: 'The Grind',
      description: 'A place to work and relax.',
      location: 'Uptown',
    },
  });

  // Create Employees
  await prisma.employee.create({
    data: {
      id: 'UI1234567',
      name: 'Alice',
      email_address: 'alice@test.com',
      phone_number: '98765432',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      gender: Gender.Female,
      start_date: new Date('2023-05-10'),
      cafe: {
        connect: { id: cafe1.id }, // Connect to Morning Brew
      },
    },
  });

  await prisma.employee.create({
    data: {
      id: 'UI7654321',
      name: 'Bob',
      email_address: 'bob@test.com',
      phone_number: '81234567',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      gender: Gender.Male,
      start_date: new Date('2022-11-20'),
      cafe: {
        connect: { id: cafe1.id }, // Connect to Morning Brew
      },
    },
  });

  await prisma.employee.create({
    data: {
      id: 'UIABCDEFG',
      name: 'Charlie',
      email_address: 'charlie@test.com',
      phone_number: '99998888',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      gender: Gender.Male,
      // No cafe assignment
    },
  });

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
