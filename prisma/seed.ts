import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Hash password
  const hashedPassword = await bcrypt.hash('@adminbkn', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {
      password: hashedPassword,
    },
    create: {
      email: 'admin',
      name: 'Administrator',
      password: hashedPassword,
      role: 'admin',
    },
  })

  console.log('✅ Admin user created/updated:')
  console.log('   Email:', admin.email)
  console.log('   Username: admin')
  console.log('   Password: @adminbkn')
  console.log('   Role:', admin.role)
  console.log('   ID:', admin.id)
  
  console.log('\n🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
