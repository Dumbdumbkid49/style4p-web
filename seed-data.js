/**
 * Style4P Seed Data
 * Curated digital closet dataset for a fashion-conscious user
 * High quality fashion imagery, realistic wear stats, and outfit combinations
 */

const SEED_USER = {
  id: "usr_01h8x9k2p",
  name: "Alex Morgan",
  email: "alex.morgan@style4p.io",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  bio: "Streetwear & Minimalist enthusiast. Trying to maximize my wardrobe rotation.",
  createdAt: "2026-08-10T08:00:00.000Z"
};

const SEED_CLOTHING_ITEMS = [
  // TOPS
  {
    id: "item_top_01",
    userId: "usr_01h8x9k2p",
    name: "Black Oversized Boxy Tee",
    category: "Top",
    color: "Black",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    wearCount: 19,
    lastWorn: "2026-09-24T14:30:00.000Z",
    favorite: true,
    createdAt: "2026-08-11T10:00:00.000Z"
  },
  {
    id: "item_top_02",
    userId: "usr_01h8x9k2p",
    name: "Heavyweight Off-White Tee",
    category: "Top",
    color: "White",
    style: "Minimal",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80",
    wearCount: 14,
    lastWorn: "2026-09-22T09:15:00.000Z",
    favorite: true,
    createdAt: "2026-08-12T11:00:00.000Z"
  },
  {
    id: "item_top_03",
    userId: "usr_01h8x9k2p",
    name: "Vintage Washed Charcoal Hoodie",
    category: "Top",
    color: "Gray",
    style: "Streetwear",
    season: "Winter",
    imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    wearCount: 8,
    lastWorn: "2026-09-18T18:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-14T15:20:00.000Z"
  },
  {
    id: "item_top_04",
    userId: "usr_01h8x9k2p",
    name: "Sage Green Relaxed Linen Shirt",
    category: "Top",
    color: "Green",
    style: "Casual",
    season: "Summer",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    wearCount: 4,
    lastWorn: "2026-09-02T12:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-15T09:00:00.000Z"
  },
  {
    id: "item_top_05",
    userId: "usr_01h8x9k2p",
    name: "Striped Knit Polo Sweater",
    category: "Top",
    color: "Beige",
    style: "Vintage",
    season: "Spring/Fall",
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    wearCount: 2,
    lastWorn: "2026-08-20T17:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-16T14:10:00.000Z"
  },
  {
    id: "item_top_06",
    userId: "usr_01h8x9k2p",
    name: "Classic Oxford Blue Button-Down",
    category: "Top",
    color: "Blue",
    style: "Formal",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    wearCount: 6,
    lastWorn: "2026-09-10T10:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-17T16:00:00.000Z"
  },

  // BOTTOMS
  {
    id: "item_bot_01",
    userId: "usr_01h8x9k2p",
    name: "Wide Leg Vintage Blue Denim",
    category: "Bottom",
    color: "Blue",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    wearCount: 17,
    lastWorn: "2026-09-24T14:30:00.000Z",
    favorite: true,
    createdAt: "2026-08-11T10:30:00.000Z"
  },
  {
    id: "item_bot_02",
    userId: "usr_01h8x9k2p",
    name: "Black Parachute Cargo Pants",
    category: "Bottom",
    color: "Black",
    style: "Y2K",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
    wearCount: 11,
    lastWorn: "2026-09-21T11:00:00.000Z",
    favorite: true,
    createdAt: "2026-08-12T12:00:00.000Z"
  },
  {
    id: "item_bot_03",
    userId: "usr_01h8x9k2p",
    name: "Pleated Beige Tapered Chinos",
    category: "Bottom",
    color: "Beige",
    style: "Minimal",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    wearCount: 7,
    lastWorn: "2026-09-14T09:30:00.000Z",
    favorite: false,
    createdAt: "2026-08-13T13:00:00.000Z"
  },
  {
    id: "item_bot_04",
    userId: "usr_01h8x9k2p",
    name: "Faded Olive Carpenter Trousers",
    category: "Bottom",
    color: "Olive",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80",
    wearCount: 3,
    lastWorn: "2026-08-28T16:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-15T11:00:00.000Z"
  },
  {
    id: "item_bot_05",
    userId: "usr_01h8x9k2p",
    name: "Raw Indigo Selvedge Jeans",
    category: "Bottom",
    color: "Blue",
    style: "Vintage",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
    wearCount: 1,
    lastWorn: "2026-08-15T14:00:00.000Z", // FORGOTTEN ITEM (>40 days)
    favorite: false,
    createdAt: "2026-08-14T10:00:00.000Z"
  },

  // OUTERWEAR
  {
    id: "item_out_01",
    userId: "usr_01h8x9k2p",
    name: "Caramel Brown Suede Overshirt",
    category: "Outerwear",
    color: "Brown",
    style: "Vintage",
    season: "Spring/Fall",
    imageUrl: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80",
    wearCount: 1,
    lastWorn: "2026-08-12T15:00:00.000Z", // FORGOTTEN ITEM (>42 days ago!)
    favorite: false,
    createdAt: "2026-08-11T12:00:00.000Z"
  },
  {
    id: "item_out_02",
    userId: "usr_01h8x9k2p",
    name: "Black Technical Bomber Jacket",
    category: "Outerwear",
    color: "Black",
    style: "Streetwear",
    season: "Winter",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
    wearCount: 10,
    lastWorn: "2026-09-20T19:00:00.000Z",
    favorite: true,
    createdAt: "2026-08-13T14:00:00.000Z"
  },
  {
    id: "item_out_03",
    userId: "usr_01h8x9k2p",
    name: "Cream Wool Minimalist Oversized Blazer",
    category: "Outerwear",
    color: "Beige",
    style: "Minimal",
    season: "Spring/Fall",
    imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    wearCount: 5,
    lastWorn: "2026-09-12T18:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-16T11:00:00.000Z"
  },
  {
    id: "item_out_04",
    userId: "usr_01h8x9k2p",
    name: "Olive Drab M-65 Military Field Jacket",
    category: "Outerwear",
    color: "Olive",
    style: "Vintage",
    season: "Spring/Fall",
    imageUrl: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    wearCount: 2,
    lastWorn: "2026-08-25T11:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-17T09:30:00.000Z"
  },

  // SHOES
  {
    id: "item_shoe_01",
    userId: "usr_01h8x9k2p",
    name: "Retro White Platform Leather Sneakers",
    category: "Shoes",
    color: "White",
    style: "Minimal",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    wearCount: 22,
    lastWorn: "2026-09-24T14:30:00.000Z",
    favorite: true,
    createdAt: "2026-08-11T11:15:00.000Z"
  },
  {
    id: "item_shoe_02",
    userId: "usr_01h8x9k2p",
    name: "Chunky Black Lug Sole Loafers",
    category: "Shoes",
    color: "Black",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80",
    wearCount: 9,
    lastWorn: "2026-09-19T20:00:00.000Z",
    favorite: true,
    createdAt: "2026-08-13T10:00:00.000Z"
  },
  {
    id: "item_shoe_03",
    userId: "usr_01h8x9k2p",
    name: "Suede Sand Chelsea Boots",
    category: "Shoes",
    color: "Beige",
    style: "Casual",
    season: "Spring/Fall",
    imageUrl: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
    wearCount: 2,
    lastWorn: "2026-08-18T19:00:00.000Z", // FORGOTTEN ITEM (>38 days ago)
    favorite: false,
    createdAt: "2026-08-15T13:40:00.000Z"
  },
  {
    id: "item_shoe_04",
    userId: "usr_01h8x9k2p",
    name: "Silver Metallic Y2K Runner",
    category: "Shoes",
    color: "Gray",
    style: "Y2K",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=800&q=80",
    wearCount: 5,
    lastWorn: "2026-09-16T15:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-18T10:00:00.000Z"
  },

  // ACCESSORIES
  {
    id: "item_acc_01",
    userId: "usr_01h8x9k2p",
    name: "Matte Black Crossbody Sling Bag",
    category: "Accessory",
    color: "Black",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    wearCount: 15,
    lastWorn: "2026-09-24T14:30:00.000Z",
    favorite: true,
    createdAt: "2026-08-12T14:00:00.000Z"
  },
  {
    id: "item_acc_02",
    userId: "usr_01h8x9k2p",
    name: "Tortoise Shell Oval Sunglasses",
    category: "Accessory",
    color: "Brown",
    style: "Vintage",
    season: "Summer",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80",
    wearCount: 11,
    lastWorn: "2026-09-22T13:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-14T09:00:00.000Z"
  },
  {
    id: "item_acc_03",
    userId: "usr_01h8x9k2p",
    name: "Chunky Silver Chain Necklace",
    category: "Accessory",
    color: "Gray",
    style: "Streetwear",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    wearCount: 12,
    lastWorn: "2026-09-21T18:00:00.000Z",
    favorite: true,
    createdAt: "2026-08-13T16:00:00.000Z"
  },
  {
    id: "item_acc_04",
    userId: "usr_01h8x9k2p",
    name: "Natural Canvas Heavy Tote",
    category: "Accessory",
    color: "Beige",
    style: "Minimal",
    season: "All Season",
    imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    wearCount: 3,
    lastWorn: "2026-08-30T10:00:00.000Z",
    favorite: false,
    createdAt: "2026-08-16T12:00:00.000Z"
  }
];

const SEED_OUTFITS = [
  {
    id: "outfit_01",
    userId: "usr_01h8x9k2p",
    name: "Downtown Monochrome Uniform",
    style: "Streetwear",
    occasion: "Cafe",
    weather: "Warm",
    matchScore: 92,
    scoreBreakdown: {
      color: 95,
      style: 92,
      category: 100,
      occasion: 90,
      weather: 85
    },
    itemIds: ["item_top_01", "item_bot_01", "item_shoe_01", "item_acc_01"],
    createdAt: "2026-09-24T12:00:00.000Z",
    wearCount: 5,
    lastWorn: "2026-09-24T14:30:00.000Z",
    isFavorite: true
  },
  {
    id: "outfit_02",
    userId: "usr_01h8x9k2p",
    name: "Y2K Cyber Nightout",
    style: "Y2K",
    occasion: "Party",
    weather: "Warm",
    matchScore: 89,
    scoreBreakdown: {
      color: 90,
      style: 94,
      category: 100,
      occasion: 88,
      weather: 82
    },
    itemIds: ["item_top_01", "item_bot_02", "item_shoe_02", "item_acc_03"],
    createdAt: "2026-09-21T16:00:00.000Z",
    wearCount: 3,
    lastWorn: "2026-09-21T18:00:00.000Z",
    isFavorite: true
  },
  {
    id: "outfit_03",
    userId: "usr_01h8x9k2p",
    name: "Minimalist Gallery Hop",
    style: "Minimal",
    occasion: "Cafe",
    weather: "Warm",
    matchScore: 94,
    scoreBreakdown: {
      color: 98,
      style: 96,
      category: 100,
      occasion: 95,
      weather: 88
    },
    itemIds: ["item_top_02", "item_bot_03", "item_shoe_01", "item_acc_04"],
    createdAt: "2026-09-14T08:30:00.000Z",
    wearCount: 4,
    lastWorn: "2026-09-14T09:30:00.000Z",
    isFavorite: false
  },
  {
    id: "outfit_04",
    userId: "usr_01h8x9k2p",
    name: "Layered Autumn Street Spec",
    style: "Streetwear",
    occasion: "University",
    weather: "Cold",
    matchScore: 87,
    scoreBreakdown: {
      color: 88,
      style: 90,
      category: 100,
      occasion: 85,
      weather: 90
    },
    itemIds: ["item_top_03", "item_out_02", "item_bot_02", "item_shoe_02"],
    createdAt: "2026-09-19T17:00:00.000Z",
    wearCount: 2,
    lastWorn: "2026-09-20T19:00:00.000Z",
    isFavorite: false
  }
];

const SEED_WEAR_LOGS = [
  {
    id: "wear_01",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_01",
    outfitName: "Downtown Monochrome Uniform",
    occasion: "Cafe",
    wornAt: "2026-09-24T14:30:00.000Z",
    notes: "Perfect breezy day outfit. Great compliment on the wide denim."
  },
  {
    id: "wear_02",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_02",
    outfitName: "Y2K Cyber Nightout",
    occasion: "Party",
    wornAt: "2026-09-21T18:00:00.000Z",
    notes: "Comfortable for all evening walking."
  },
  {
    id: "wear_03",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_04",
    outfitName: "Layered Autumn Street Spec",
    occasion: "University",
    wornAt: "2026-09-20T19:00:00.000Z",
    notes: "Kept warm when AC was blasting in auditorium."
  },
  {
    id: "wear_04",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_03",
    outfitName: "Minimalist Gallery Hop",
    occasion: "Casual",
    wornAt: "2026-09-14T09:30:00.000Z",
    notes: "Super light and clean."
  },
  {
    id: "wear_05",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_01",
    outfitName: "Downtown Monochrome Uniform",
    occasion: "Casual",
    wornAt: "2026-09-08T11:00:00.000Z",
    notes: "Quick run around town."
  }
];

const SEED_FEEDBACK = [
  {
    id: "fb_01",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_01",
    action: "LIKE",
    createdAt: "2026-09-24T12:05:00.000Z"
  },
  {
    id: "fb_02",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_02",
    action: "LIKE",
    createdAt: "2026-09-21T16:02:00.000Z"
  },
  {
    id: "fb_03",
    userId: "usr_01h8x9k2p",
    outfitId: "outfit_04",
    action: "LIKE",
    createdAt: "2026-09-19T17:05:00.000Z"
  }
];

// Export for browser script or node environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SEED_USER,
    SEED_CLOTHING_ITEMS,
    SEED_OUTFITS,
    SEED_WEAR_LOGS,
    SEED_FEEDBACK
  };
}
