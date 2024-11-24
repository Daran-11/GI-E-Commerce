// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Define the path to your SQL file
  const sqlFilePath = path.join(__dirname, 'sql', 'server_seed.sql');
  
  // Read the SQL file
  const sql = fs.readFileSync(sqlFilePath, 'utf-8');

  // Split the SQL commands if you have multiple commands
  const sqlCommands = sql.split(';').filter(command => command.trim());

  // Execute each command
  for (const command of sqlCommands) {
    await prisma.$executeRawUnsafe(command);
  }

  console.log(`Seeding completed!`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
