import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking database data...\n');

  // Check providers
  const providers = await prisma.provider.findMany({
    include: { user: true }
  });
  console.log('✅ Providers:', providers.length);
  providers.forEach(p => console.log(`   - ${p.user.name} (${p.id})`));

  // Check working hours
  const workingHours = await prisma.workingHour.findMany();
  console.log('\n✅ Working Hours:', workingHours.length);
  workingHours.forEach(wh => console.log(`   - ${wh.dayOfWeek}: ${wh.startTime} - ${wh.endTime}`));

  // Check services
  const services = await prisma.service.findMany();
  console.log('\n✅ Services:', services.length);
  services.forEach(s => console.log(`   - ${s.name} (${s.duration} min)`));

  // Check appointments
  const appointments = await prisma.appointment.findMany();
  console.log('\n✅ Appointments:', appointments.length);

  console.log('\n📋 Test slot generation:');
  if (providers.length > 0) {
    console.log(`Provider ID: ${providers[0].id}`);
    console.log(`Use this in the booking page!`);
  }

  await prisma.$disconnect();
}

checkData();
