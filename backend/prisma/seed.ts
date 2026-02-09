import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: hashedPassword,
      name: 'Dr. John Smith',
      role: 'ADMIN',
      phone: '+1234567890',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create Provider Profile
  const provider = await prisma.provider.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      specialty: 'General Consultation',
      timezone: 'UTC',
      defaultServiceDuration: 30,
    },
  });

  console.log('✅ Provider profile created');

  // Create Working Hours (Monday to Friday)
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  
  for (const day of days) {
    const existing = await prisma.workingHour.findFirst({
      where: {
        providerId: provider.id,
        dayOfWeek: day as any,
      },
    });

    if (!existing) {
      await prisma.workingHour.create({
        data: {
          providerId: provider.id,
          dayOfWeek: day as any,
          shiftType: 'FULL_DAY',
          startTime: '09:00',
          endTime: '18:00',
          isActive: true,
        },
      });
    }
  }

  console.log('✅ Working hours created (Mon-Fri, 9 AM - 6 PM)');

  // Create Services
  const services = [
    { name: 'General Consultation', duration: 30, price: 50 },
    { name: 'Follow-up Visit', duration: 15, price: 25 },
    { name: 'Extended Consultation', duration: 60, price: 100 },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: {
        providerId: provider.id,
        ...service,
      },
    });
  }

  console.log('✅ Services created');

  // Create Sample Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      password: hashedPassword,
      name: 'Jane Doe',
      role: 'USER',
      phone: '+1987654321',
    },
  });

  console.log('✅ Sample patient created:', patient.email);

  // Create Sample Appointments
  const service = await prisma.service.findFirst({
    where: { providerId: provider.id },
  });

  if (service) {
    const today = new Date();
    today.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        providerId: provider.id,
        userId: patient.id,
        serviceId: service.id,
        startTime: today,
        endTime: new Date(today.getTime() + 30 * 60000),
        status: 'CONFIRMED',
        notes: 'Regular checkup',
      },
    });

    console.log('✅ Sample appointment created');
  }

  console.log('\n🎉 Seeding completed!');
  console.log('\n📝 Login Credentials:');
  console.log('Admin: admin@test.com / password123');
  console.log('Patient: patient@test.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
