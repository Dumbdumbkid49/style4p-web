/**
 * Style4P: Prisma Database Seed Script
 * Populates PostgreSQL database with realistic fashion data, outfits, wear logs, and feedback.
 * 
 * Usage:
 *   npx prisma db seed
 * or
 *   ts-node prisma/seed.ts
 */

import { PrismaClient, ClothingCategory, FashionStyle, Season, Occasion, WeatherCondition, FeedbackAction } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Style4P database seed...');

  // 1. Clean existing records (in reverse relation order)
  await prisma.outfitFeedback.deleteMany();
  await prisma.wearLog.deleteMany();
  await prisma.outfitItem.deleteMany();
  await prisma.outfit.deleteMany();
  await prisma.clothingItem.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Primary User
  const user = await prisma.user.create({
    data: {
      id: 'usr_01h8x9k2p',
      name: 'Alex Morgan',
      email: 'alex.morgan@style4p.io',
      passwordHash: '$2a$12$e80Yv8y6.9E54n8K3zW9Q.H7bT8O8l1a7h4Ie2s9O1m3l9k1j8h7g', // demo hash
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Streetwear & Minimalist enthusiast. Trying to maximize my wardrobe rotation.'
    }
  });
  console.log(`👤 Created user: ${user.name} (${user.email})`);

  // 3. Create Clothing Items
  const clothingData = [
    // TOPS
    {
      id: 'item_top_01',
      name: 'Black Oversized Boxy Tee',
      category: ClothingCategory.TOP,
      color: 'Black',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
      wearCount: 19,
      lastWorn: new Date('2026-09-24T14:30:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_top_02',
      name: 'Heavyweight Off-White Tee',
      category: ClothingCategory.TOP,
      color: 'White',
      style: FashionStyle.MINIMAL,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80',
      wearCount: 14,
      lastWorn: new Date('2026-09-22T09:15:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_top_03',
      name: 'Vintage Washed Charcoal Hoodie',
      category: ClothingCategory.TOP,
      color: 'Gray',
      style: FashionStyle.STREETWEAR,
      season: Season.WINTER,
      imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
      wearCount: 8,
      lastWorn: new Date('2026-09-18T18:00:00.000Z'),
      isFavorite: false
    },
    {
      id: 'item_top_04',
      name: 'Sage Green Relaxed Linen Shirt',
      category: ClothingCategory.TOP,
      color: 'Green',
      style: FashionStyle.CASUAL,
      season: Season.SUMMER,
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      wearCount: 4,
      lastWorn: new Date('2026-09-02T12:00:00.000Z'),
      isFavorite: false
    },
    {
      id: 'item_top_05',
      name: 'Striped Knit Polo Sweater',
      category: ClothingCategory.TOP,
      color: 'Beige',
      style: FashionStyle.VINTAGE,
      season: Season.SPRING_FALL,
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
      wearCount: 2,
      lastWorn: new Date('2026-08-20T17:00:00.000Z'),
      isFavorite: false
    },
    {
      id: 'item_top_06',
      name: 'Classic Oxford Blue Button-Down',
      category: ClothingCategory.TOP,
      color: 'Blue',
      style: FashionStyle.FORMAL,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      wearCount: 6,
      lastWorn: new Date('2026-09-10T10:00:00.000Z'),
      isFavorite: false
    },

    // BOTTOMS
    {
      id: 'item_bot_01',
      name: 'Wide Leg Vintage Blue Denim',
      category: ClothingCategory.BOTTOM,
      color: 'Blue',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
      wearCount: 17,
      lastWorn: new Date('2026-09-24T14:30:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_bot_02',
      name: 'Black Parachute Cargo Pants',
      category: ClothingCategory.BOTTOM,
      color: 'Black',
      style: FashionStyle.Y2K,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
      wearCount: 11,
      lastWorn: new Date('2026-09-21T11:00:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_bot_03',
      name: 'Pleated Beige Tapered Chinos',
      category: ClothingCategory.BOTTOM,
      color: 'Beige',
      style: FashionStyle.MINIMAL,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80',
      wearCount: 7,
      lastWorn: new Date('2026-09-14T09:30:00.000Z'),
      isFavorite: false
    },
    {
      id: 'item_bot_04',
      name: 'Faded Olive Carpenter Trousers',
      category: ClothingCategory.BOTTOM,
      color: 'Olive',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      wearCount: 3,
      lastWorn: new Date('2026-08-28T16:00:00.000Z'),
      isFavorite: false
    },
    {
      id: 'item_bot_05',
      name: 'Raw Indigo Selvedge Jeans',
      category: ClothingCategory.BOTTOM,
      color: 'Blue',
      style: FashionStyle.VINTAGE,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80',
      wearCount: 1,
      lastWorn: new Date('2026-08-15T14:00:00.000Z'), // FORGOTTEN ITEM
      isFavorite: false
    },

    // OUTERWEAR
    {
      id: 'item_out_01',
      name: 'Caramel Brown Suede Overshirt',
      category: ClothingCategory.OUTERWEAR,
      color: 'Brown',
      style: FashionStyle.VINTAGE,
      season: Season.SPRING_FALL,
      imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      wearCount: 1,
      lastWorn: new Date('2026-08-12T15:00:00.000Z'), // FORGOTTEN ITEM (>42 days ago)
      isFavorite: false
    },
    {
      id: 'item_out_02',
      name: 'Black Technical Bomber Jacket',
      category: ClothingCategory.OUTERWEAR,
      color: 'Black',
      style: FashionStyle.STREETWEAR,
      season: Season.WINTER,
      imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      wearCount: 10,
      lastWorn: new Date('2026-09-20T19:00:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_out_03',
      name: 'Cream Wool Minimalist Blazer',
      category: ClothingCategory.OUTERWEAR,
      color: 'Beige',
      style: FashionStyle.MINIMAL,
      season: Season.SPRING_FALL,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80',
      wearCount: 5,
      lastWorn: new Date('2026-09-12T18:00:00.000Z'),
      isFavorite: false
    },

    // SHOES
    {
      id: 'item_shoe_01',
      name: 'Retro White Platform Leather Sneakers',
      category: ClothingCategory.SHOES,
      color: 'White',
      style: FashionStyle.MINIMAL,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
      wearCount: 22,
      lastWorn: new Date('2026-09-24T14:30:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_shoe_02',
      name: 'Chunky Black Lug Sole Loafers',
      category: ClothingCategory.SHOES,
      color: 'Black',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      wearCount: 9,
      lastWorn: new Date('2026-09-19T20:00:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_shoe_03',
      name: 'Suede Sand Chelsea Boots',
      category: ClothingCategory.SHOES,
      color: 'Beige',
      style: FashionStyle.CASUAL,
      season: Season.SPRING_FALL,
      imageUrl: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80',
      wearCount: 2,
      lastWorn: new Date('2026-08-18T19:00:00.000Z'), // FORGOTTEN ITEM
      isFavorite: false
    },

    // ACCESSORIES
    {
      id: 'item_acc_01',
      name: 'Matte Black Crossbody Sling Bag',
      category: ClothingCategory.ACCESSORY,
      color: 'Black',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
      wearCount: 15,
      lastWorn: new Date('2026-09-24T14:30:00.000Z'),
      isFavorite: true
    },
    {
      id: 'item_acc_02',
      name: 'Chunky Silver Chain Necklace',
      category: ClothingCategory.ACCESSORY,
      color: 'Gray',
      style: FashionStyle.STREETWEAR,
      season: Season.ALL_SEASON,
      imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      wearCount: 12,
      lastWorn: new Date('2026-09-21T18:00:00.000Z'),
      isFavorite: true
    }
  ];

  for (const item of clothingData) {
    await prisma.clothingItem.create({
      data: {
        ...item,
        userId: user.id
      }
    });
  }
  console.log(`👗 Created ${clothingData.length} clothing items.`);

  // 4. Create Pre-saved Outfits & OutfitItems
  const outfitsData = [
    {
      id: 'outfit_01',
      name: 'Downtown Monochrome Uniform',
      style: FashionStyle.STREETWEAR,
      occasion: Occasion.CAFE,
      weather: WeatherCondition.WARM,
      matchScore: 92,
      scoreBreakdown: { color: 95, style: 92, category: 100, occasion: 90, weather: 85 },
      wearCount: 5,
      lastWorn: new Date('2026-09-24T14:30:00.000Z'),
      isFavorite: true,
      itemIds: [
        { id: 'item_top_01', slot: ClothingCategory.TOP },
        { id: 'item_bot_01', slot: ClothingCategory.BOTTOM },
        { id: 'item_shoe_01', slot: ClothingCategory.SHOES },
        { id: 'item_acc_01', slot: ClothingCategory.ACCESSORY }
      ]
    },
    {
      id: 'outfit_02',
      name: 'Y2K Cyber Nightout',
      style: FashionStyle.Y2K,
      occasion: Occasion.PARTY,
      weather: WeatherCondition.WARM,
      matchScore: 89,
      scoreBreakdown: { color: 90, style: 94, category: 100, occasion: 88, weather: 82 },
      wearCount: 3,
      lastWorn: new Date('2026-09-21T18:00:00.000Z'),
      isFavorite: true,
      itemIds: [
        { id: 'item_top_01', slot: ClothingCategory.TOP },
        { id: 'item_bot_02', slot: ClothingCategory.BOTTOM },
        { id: 'item_shoe_02', slot: ClothingCategory.SHOES },
        { id: 'item_acc_02', slot: ClothingCategory.ACCESSORY }
      ]
    },
    {
      id: 'outfit_03',
      name: 'Minimalist Gallery Hop',
      style: FashionStyle.MINIMAL,
      occasion: Occasion.CAFE,
      weather: WeatherCondition.WARM,
      matchScore: 94,
      scoreBreakdown: { color: 98, style: 96, category: 100, occasion: 95, weather: 88 },
      wearCount: 4,
      lastWorn: new Date('2026-09-14T09:30:00.000Z'),
      isFavorite: false,
      itemIds: [
        { id: 'item_top_02', slot: ClothingCategory.TOP },
        { id: 'item_bot_03', slot: ClothingCategory.BOTTOM },
        { id: 'item_shoe_01', slot: ClothingCategory.SHOES }
      ]
    }
  ];

  for (const o of outfitsData) {
    const { itemIds, ...outfitPayload } = o;
    const createdOutfit = await prisma.outfit.create({
      data: {
        ...outfitPayload,
        userId: user.id
      }
    });

    for (const itemRef of itemIds) {
      await prisma.outfitItem.create({
        data: {
          outfitId: createdOutfit.id,
          clothingItemId: itemRef.id,
          slotCategory: itemRef.slot
        }
      });
    }
  }
  console.log(`✨ Created ${outfitsData.length} curated outfits with relational junction items.`);

  // 5. Create Wear Logs
  const wearLogsData = [
    {
      outfitId: 'outfit_01',
      occasion: Occasion.CAFE,
      notes: 'Breezy day in the city. Great compliment on denim silhouette.',
      wornAt: new Date('2026-09-24T14:30:00.000Z')
    },
    {
      outfitId: 'outfit_02',
      occasion: Occasion.PARTY,
      notes: 'Comfortable for walking downtown late.',
      wornAt: new Date('2026-09-21T18:00:00.000Z')
    },
    {
      outfitId: 'outfit_03',
      occasion: Occasion.CAFE,
      notes: 'Clean gallery look.',
      wornAt: new Date('2026-09-14T09:30:00.000Z')
    }
  ];

  for (const log of wearLogsData) {
    await prisma.wearLog.create({
      data: {
        ...log,
        userId: user.id
      }
    });
  }
  console.log(`👟 Created ${wearLogsData.length} verified wear logs.`);

  // 6. Create Feedback Records
  const feedbackData = [
    { outfitId: 'outfit_01', action: FeedbackAction.LIKE },
    { outfitId: 'outfit_02', action: FeedbackAction.LIKE }
  ];

  for (const fb of feedbackData) {
    await prisma.outfitFeedback.create({
      data: {
        ...fb,
        userId: user.id
      }
    });
  }
  console.log(`❤️ Created feedback learning interactions.`);
  console.log(`🚀 Style4P database seed completed successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
