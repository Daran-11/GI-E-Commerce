
import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';
const prisma = new PrismaClient();


async function seed() {
    try {
      const response = await fetch('https://raw.githubusercontent.com/kongvut/thai-province-data/master/api_province_with_amphure_tambon.json');
      const data = response.data;
  
      const provinces = [];
      const amphoes = [];
      const tambons = [];
  
      data.forEach(item => {
        // Create provinces
        if (!provinces.find(p => p.id === item.province_id)) {
          provinces.push({
            id: item.province_id,
            name_th: item.province_name_th,
            name_en: item.province_name_en
          });
        }
  
        // Create amphoes
        if (!amphoes.find(a => a.id === item.amphoe_id)) {
          amphoes.push({
            id: item.amphoe_id,
            name_th: item.amphoe_name_th,
            name_en: item.amphoe_name_en,
            provinceId: item.province_id
          });
        }
  
        // Create tambons
        tambons.push({
          id: item.tambon_id,
          name_th: item.tambon_name_th,
          name_en: item.tambon_name_en,
          amphoeId: item.amphoe_id
        });
      });
  
      // Insert data into database
      await prisma.province.createMany({ data: provinces });
      await prisma.amphoe.createMany({ data: amphoes });
      await prisma.tambon.createMany({ data: tambons });
  
      console.log('Data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  
  seed();