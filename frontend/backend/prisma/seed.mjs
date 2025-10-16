import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({ where: { name: 'admin' }, update: {}, create: { name: 'admin' } });
  await prisma.role.upsert({ where: { name: 'user' }, update: {}, create: { name: 'user' } });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'REEMPLAZA_CON_BCRYPT',
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: admin.id, roleId: 1 } },
    update: {},
    create: { userId: admin.id, roleId: 1 },
  });

  for (const name of ['Maíz', 'Trigo', 'Soja']) {
    await prisma.crop.upsert({ where: { name }, update: {}, create: { name } });
  }

  const sensors = [
    { kind: 'temperature', unit: '°C' },
    { kind: 'humidity', unit: '%' },
    { kind: 'rain', unit: 'mm' },
    { kind: 'solar', unit: 'W/m²' },
  ];
  for (const s of sensors) {
    await prisma.sensor.create({ data: s }).catch(() => {});
  }

  console.log('Seed OK');
}

main().finally(async () => prisma.$disconnect());
