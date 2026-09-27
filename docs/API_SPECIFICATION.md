# Style4P — RESTful API Specification

> **Version:** 1.0.0-MVP  
> **Base URL:** `https://api.style4p.io/v1` or `/api` (Next.js API Routes / Express)  
> **Content-Type:** `application/json`  
> **Authentication:** Bearer Token (JWT / Auth.js Session Cookie)

---

## 1. Authentication Endpoints

### 1.1 Register New User
- **Method:** `POST`
- **Path:** `/api/auth/register`
- **Description:** Creates a new user profile with email and password.

#### Request Body
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@style4p.io",
  "password": "SecurePassword123!"
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_01h8x9k2p",
      "name": "Alex Morgan",
      "email": "alex.morgan@style4p.io",
      "profileImage": null,
      "createdAt": "2026-09-26T13:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.2 User Login
- **Method:** `POST`
- **Path:** `/api/auth/login`
- **Description:** Authenticates user credentials and returns session token.

#### Request Body
```json
{
  "email": "alex.morgan@style4p.io",
  "password": "SecurePassword123!"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_01h8x9k2p",
      "name": "Alex Morgan",
      "email": "alex.morgan@style4p.io",
      "profileImage": "https://images.unsplash.com/..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 1.3 Get Current User Session
- **Method:** `GET`
- **Path:** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "id": "usr_01h8x9k2p",
    "name": "Alex Morgan",
    "email": "alex.morgan@style4p.io",
    "profileImage": "https://images.unsplash.com/...",
    "bio": "Streetwear & Minimalist enthusiast."
  }
}
```

---

## 2. Clothing Items Endpoints

### 2.1 List All Clothing Items
- **Method:** `GET`
- **Path:** `/api/clothing`
- **Query Parameters:**
  - `category` *(optional)*: `TOP` | `BOTTOM` | `OUTERWEAR` | `SHOES` | `ACCESSORY`
  - `style` *(optional)*: `STREETWEAR` | `MINIMAL` | `CASUAL` | `VINTAGE` | `Y2K` | `FORMAL` | `SPORT`
  - `color` *(optional)*: `Black` | `White` | `Blue` | `Beige` | etc.
  - `season` *(optional)*: `ALL_SEASON` | `SUMMER` | `WINTER` | `SPRING_FALL` | `RAINY`
  - `search` *(optional)*: Search query string for item name

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "total": 24,
    "items": [
      {
        "id": "item_top_01",
        "name": "Black Oversized Boxy Tee",
        "category": "TOP",
        "color": "Black",
        "style": "STREETWEAR",
        "season": "ALL_SEASON",
        "imageUrl": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?...",
        "wearCount": 19,
        "lastWorn": "2026-09-24T14:30:00.000Z",
        "isFavorite": true,
        "potentialCombos": 54
      }
    ]
  }
}
```

---

### 2.2 Add New Clothing Item
- **Method:** `POST`
- **Path:** `/api/clothing`

#### Request Body
```json
{
  "name": "Acid Washed Charcoal Zip Hoodie",
  "category": "TOP",
  "color": "Gray",
  "style": "STREETWEAR",
  "season": "WINTER",
  "imageUrl": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?..."
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "id": "item_top_07",
    "name": "Acid Washed Charcoal Zip Hoodie",
    "category": "TOP",
    "color": "Gray",
    "style": "STREETWEAR",
    "season": "WINTER",
    "imageUrl": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?...",
    "wearCount": 0,
    "lastWorn": null,
    "isFavorite": false,
    "createdAt": "2026-09-26T13:30:00.000Z"
  }
}
```

---

### 2.3 Get Forgotten Clothing Items
- **Method:** `GET`
- **Path:** `/api/clothing/forgotten`
- **Query Parameters:**
  - `thresholdDays` *(default: 25)*: Days since item was last worn
  - `maxWearCount` *(default: 2)*: Maximum lifetime wears to qualify

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "count": 3,
    "items": [
      {
        "id": "item_out_01",
        "name": "Caramel Brown Suede Overshirt",
        "category": "OUTERWEAR",
        "color": "Brown",
        "style": "VINTAGE",
        "imageUrl": "https://images.unsplash.com/...",
        "wearCount": 1,
        "lastWorn": "2026-08-12T15:00:00.000Z",
        "daysDormant": 45,
        "potentialCombos": 48
      }
    ]
  }
}
```

---

## 3. Outfit Discovery & Recommendation

### 3.1 Discover Outfit Candidates
- **Method:** `POST`
- **Path:** `/api/outfits/discover`
- **Description:** Runs the rule-based compatibility engine to generate outfit candidates from user's closet.

#### Request Body
```json
{
  "occasion": "Cafe",
  "weather": "Warm",
  "seedItemId": "item_out_01",
  "limit": 10
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "candidatesCount": 10,
    "candidates": [
      {
        "id": "cand_9f82k1",
        "name": "Downtown Espresso Fit",
        "style": "Streetwear",
        "occasion": "Cafe",
        "weather": "Warm",
        "matchScore": 92,
        "scoreBreakdown": {
          "color": 95,
          "style": 92,
          "category": 100,
          "occasion": 90,
          "weather": 85
        },
        "items": [
          {
            "id": "item_top_01",
            "name": "Black Oversized Boxy Tee",
            "category": "TOP",
            "color": "Black",
            "imageUrl": "https://images.unsplash.com/..."
          },
          {
            "id": "item_bot_01",
            "name": "Wide Leg Vintage Blue Denim",
            "category": "BOTTOM",
            "color": "Blue",
            "imageUrl": "https://images.unsplash.com/..."
          },
          {
            "id": "item_shoe_01",
            "name": "Retro White Platform Leather Sneakers",
            "category": "SHOES",
            "color": "White",
            "imageUrl": "https://images.unsplash.com/..."
          }
        ]
      }
    ]
  }
}
```

---

### 3.2 Remix Outfit Slot
- **Method:** `POST`
- **Path:** `/api/outfits/:id/remix`
- **Description:** Replaces a single item category slot with alternative pieces from the user's closet and recalculates compatibility scores.

#### Request Body
```json
{
  "slotCategory": "BOTTOM",
  "occasion": "Cafe",
  "weather": "Warm"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "originalOutfitId": "outfit_01",
    "slotCategory": "BOTTOM",
    "alternativeRemixes": [
      {
        "replacementItem": {
          "id": "item_bot_02",
          "name": "Black Parachute Cargo Pants",
          "category": "BOTTOM",
          "color": "Black",
          "style": "Y2K",
          "imageUrl": "https://images.unsplash.com/..."
        },
        "newMatchScore": 90,
        "scoreBreakdown": {
          "color": 96,
          "style": 91,
          "category": 100,
          "occasion": 88,
          "weather": 85
        }
      }
    ]
  }
}
```

---

### 3.3 Record Discovery Feedback
- **Method:** `POST`
- **Path:** `/api/outfits/:id/feedback`
- **Description:** Records Like or Skip action to adjust user preference weights.

#### Request Body
```json
{
  "action": "LIKE"
}
```

#### Response (`200 OK`)
```json
{
  "success": true,
  "message": "Feedback recorded. Style preference updated.",
  "data": {
    "outfitId": "outfit_01",
    "action": "LIKE",
    "updatedPreferences": {
      "Streetwear": 4,
      "Minimal": 2
    }
  }
}
```

---

## 4. Wear Tracking & Analytics

### 4.1 Record Outfit Wear ("I WORE THIS")
- **Method:** `POST`
- **Path:** `/api/wear-logs`
- **Description:** Logs that an outfit was worn today. Increments wear counts on the outfit and all constituent clothing items.

#### Request Body
```json
{
  "outfitId": "outfit_01",
  "occasion": "Cafe",
  "wornAt": "2026-09-26T14:00:00.000Z",
  "notes": "Crisp autumn morning, great drape on the denim."
}
```

#### Response (`201 Created`)
```json
{
  "success": true,
  "data": {
    "logId": "wear_1727359200",
    "outfitId": "outfit_01",
    "wornAt": "2026-09-26T14:00:00.000Z",
    "updatedWearCounts": {
      "outfit": 6,
      "itemsUpdated": ["item_top_01", "item_bot_01", "item_shoe_01", "item_acc_01"]
    }
  }
}
```

---

### 4.2 Get Closet Analytics Summary
- **Method:** `GET`
- **Path:** `/api/analytics/closet-summary`

#### Response (`200 OK`)
```json
{
  "success": true,
  "data": {
    "totalItems": 24,
    "totalOutfits": 18,
    "wardrobeRotationRate": "72%",
    "mostWornItem": {
      "id": "item_shoe_01",
      "name": "Retro White Platform Leather Sneakers",
      "wearCount": 22,
      "imageUrl": "https://images.unsplash.com/..."
    },
    "leastWornItem": {
      "id": "item_out_01",
      "name": "Caramel Brown Suede Overshirt",
      "wearCount": 1,
      "daysDormant": 45,
      "imageUrl": "https://images.unsplash.com/..."
    },
    "categoryDistribution": [
      { "category": "TOP", "count": 6, "percentage": 25 },
      { "category": "BOTTOM", "count": 5, "percentage": 21 },
      { "category": "OUTERWEAR", "count": 4, "percentage": 17 },
      { "category": "SHOES", "count": 4, "percentage": 17 },
      { "category": "ACCESSORY", "count": 5, "percentage": 20 }
    ],
    "colorSpectrum": [
      { "color": "Black", "count": 8 },
      { "color": "Blue", "count": 4 },
      { "color": "Beige", "count": 4 },
      { "color": "White", "count": 3 },
      { "color": "Olive", "count": 2 },
      { "color": "Gray", "count": 3 }
    ],
    "styleDistribution": [
      { "style": "Streetwear", "count": 9 },
      { "style": "Minimal", "count": 6 },
      { "style": "Casual", "count": 4 },
      { "style": "Vintage", "count": 3 },
      { "style": "Y2K", "count": 2 }
    ]
  }
}
```
