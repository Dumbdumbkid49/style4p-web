/**
 * Style4P Rule-based Outfit Discovery & Scoring Engine
 * Implements architectural specifications for Color, Style, Category, Occasion, Weather,
 * Outfit Potential calculation, and Preference learning.
 */

// Color Harmony definitions
const COLOR_HARMONY_MATRIX = {
  Black: { Black: 100, White: 98, Gray: 95, Blue: 90, Beige: 88, Olive: 90, Brown: 85, Green: 88 },
  White: { Black: 98, White: 95, Gray: 95, Blue: 92, Beige: 94, Olive: 90, Brown: 90, Green: 90 },
  Gray: { Black: 95, White: 95, Gray: 90, Blue: 88, Beige: 82, Olive: 85, Brown: 80, Green: 85 },
  Blue: { Black: 90, White: 92, Gray: 88, Blue: 90, Beige: 92, Olive: 85, Brown: 90, Green: 80 },
  Beige: { Black: 88, White: 94, Gray: 82, Blue: 92, Beige: 92, Olive: 95, Brown: 96, Green: 88 },
  Olive: { Black: 90, White: 90, Gray: 85, Blue: 85, Beige: 95, Olive: 90, Brown: 92, Green: 85 },
  Brown: { Black: 85, White: 90, Gray: 80, Blue: 90, Beige: 96, Olive: 92, Brown: 90, Green: 84 },
  Green: { Black: 88, White: 90, Gray: 85, Blue: 80, Beige: 88, Olive: 85, Brown: 84, Green: 88 }
};

// Style affinity matrix (0-100)
const STYLE_COMPATIBILITY_MATRIX = {
  Streetwear: { Streetwear: 100, Y2K: 92, Casual: 90, Vintage: 86, Sport: 88, Minimal: 82, Formal: 60 },
  Minimal: { Minimal: 100, Casual: 94, Formal: 90, Vintage: 84, Streetwear: 82, Y2K: 70, Sport: 75 },
  Casual: { Casual: 100, Minimal: 94, Streetwear: 90, Vintage: 90, Sport: 88, Formal: 75, Y2K: 80 },
  Vintage: { Vintage: 100, Casual: 90, Streetwear: 86, Minimal: 84, Y2K: 88, Formal: 78, Sport: 65 },
  Y2K: { Y2K: 100, Streetwear: 92, Vintage: 88, Casual: 80, Sport: 85, Minimal: 70, Formal: 55 },
  Formal: { Formal: 100, Minimal: 90, Casual: 75, Vintage: 78, Streetwear: 60, Sport: 50, Y2K: 55 },
  Sport: { Sport: 100, Casual: 88, Streetwear: 88, Y2K: 85, Minimal: 75, Vintage: 65, Formal: 50 }
};

// Occasion Suitability Matrix
const OCCASION_STYLE_AFFINITY = {
  Casual: { Casual: 100, Minimal: 95, Streetwear: 92, Vintage: 90, Y2K: 88, Sport: 90, Formal: 70 },
  Cafe: { Minimal: 100, Casual: 95, Vintage: 92, Streetwear: 90, Y2K: 85, Formal: 80, Sport: 70 },
  University: { Casual: 100, Streetwear: 96, Minimal: 92, Vintage: 90, Y2K: 85, Sport: 80, Formal: 75 },
  School: { Casual: 100, Minimal: 95, Streetwear: 90, Vintage: 85, Sport: 85, Y2K: 75, Formal: 80 },
  Party: { Streetwear: 100, Y2K: 98, Vintage: 90, Minimal: 85, Casual: 80, Formal: 85, Sport: 65 },
  Formal: { Formal: 100, Minimal: 92, Casual: 70, Vintage: 75, Streetwear: 50, Y2K: 45, Sport: 40 },
  Sport: { Sport: 100, Casual: 85, Streetwear: 85, Y2K: 75, Minimal: 70, Vintage: 60, Formal: 40 }
};

// Weather suitability rules
const WEATHER_RULES = {
  Hot: {
    preferredSeasons: ["Summer", "All Season"],
    disallowHeavyOuterwear: true,
    bonusKeywords: ["Tee", "Shorts", "Linen", "Shirt", "Sneakers", "Sunglasses"],
    penaltyKeywords: ["Wool", "Heavyweight", "Boots", "Hoodie", "Blazer", "Sweater"]
  },
  Warm: {
    preferredSeasons: ["Summer", "Spring/Fall", "All Season"],
    disallowHeavyOuterwear: false,
    bonusKeywords: ["Tee", "Chinos", "Denim", "Sneakers", "Loafers"],
    penaltyKeywords: ["Heavyweight", "Wool"]
  },
  Rainy: {
    preferredSeasons: ["Rainy", "All Season", "Spring/Fall"],
    disallowHeavyOuterwear: false,
    bonusKeywords: ["Bomber", "Field Jacket", "Cargo", "Boots", "Dark"],
    penaltyKeywords: ["White", "Linen", "Suede"]
  },
  Cold: {
    preferredSeasons: ["Winter", "Spring/Fall", "All Season"],
    requiresOuterwearOrHeavy: true,
    bonusKeywords: ["Hoodie", "Jacket", "Boots", "Blazer", "Sweater", "Bomber"],
    penaltyKeywords: ["Linen", "Shorts"]
  }
};

class MatchingEngine {
  /**
   * Calculate Color Compatibility Score (0 - 100)
   * Averages pairwise color compatibilities between all items in the outfit
   */
  static calculateColorScore(items) {
    if (!items || items.length < 2) return 90;
    let totalScore = 0;
    let pairCount = 0;

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const c1 = items[i].color || "Black";
        const c2 = items[j].color || "Black";
        const matrixRow = COLOR_HARMONY_MATRIX[c1] || COLOR_HARMONY_MATRIX["Black"];
        const pairScore = matrixRow[c2] ?? 85;
        totalScore += pairScore;
        pairCount++;
      }
    }

    return pairCount > 0 ? Math.round(totalScore / pairCount) : 90;
  }

  /**
   * Calculate Style Compatibility Score (0 - 100)
   */
  static calculateStyleScore(items, preferredStyles = {}) {
    if (!items || items.length === 0) return 85;
    let totalScore = 0;
    let pairCount = 0;

    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const s1 = items[i].style || "Casual";
        const s2 = items[j].style || "Casual";
        const matrixRow = STYLE_COMPATIBILITY_MATRIX[s1] || STYLE_COMPATIBILITY_MATRIX["Casual"];
        const pairScore = matrixRow[s2] ?? 80;
        totalScore += pairScore;
        pairCount++;
      }
    }

    let baseScore = pairCount > 0 ? Math.round(totalScore / pairCount) : 85;

    // Apply user learned preference boost if any item matches heavily liked styles
    const stylesPresent = items.map(it => it.style);
    let boost = 0;
    for (const style of stylesPresent) {
      if (preferredStyles[style]) {
        boost += Math.min(preferredStyles[style] * 2, 8); // Up to +8 pts
      }
    }

    return Math.min(100, Math.max(50, Math.round(baseScore + boost)));
  }

  /**
   * Calculate Category Compatibility Score (0 - 100)
   * Valid complete outfits MUST have: Top + Bottom + Shoes
   * Outerwear and Accessories provide bonus points.
   */
  static calculateCategoryScore(items) {
    const categories = new Set(items.map(it => it.category));
    let score = 0;

    if (categories.has("Top")) score += 35;
    if (categories.has("Bottom")) score += 35;
    if (categories.has("Shoes")) score += 20;
    if (categories.has("Outerwear")) score += 5;
    if (categories.has("Accessory")) score += 5;

    return Math.min(100, score);
  }

  /**
   * Calculate Occasion Compatibility Score (0 - 100)
   */
  static calculateOccasionScore(items, occasion = "Casual") {
    if (!items || items.length === 0) return 85;
    const lookup = OCCASION_STYLE_AFFINITY[occasion] || OCCASION_STYLE_AFFINITY["Casual"];
    
    let total = 0;
    for (const item of items) {
      const s = item.style || "Casual";
      total += lookup[s] ?? 80;
    }
    return Math.round(total / items.length);
  }

  /**
   * Calculate Weather Compatibility Score (0 - 100)
   */
  static calculateWeatherScore(items, weather = "Warm") {
    const rules = WEATHER_RULES[weather] || WEATHER_RULES["Warm"];
    let score = 85;

    const hasOuterwear = items.some(it => it.category === "Outerwear");
    const itemNames = items.map(it => it.name.toLowerCase()).join(" ");
    const itemSeasons = items.map(it => it.season);

    // Weather rules check
    if (weather === "Hot") {
      if (hasOuterwear) score -= 25;
      if (itemNames.includes("hoodie") || itemNames.includes("wool") || itemNames.includes("boots")) score -= 15;
      if (itemNames.includes("linen") || itemNames.includes("tee")) score += 10;
    } else if (weather === "Cold") {
      if (!hasOuterwear && !itemNames.includes("hoodie") && !itemNames.includes("sweater")) score -= 20;
      if (hasOuterwear || itemNames.includes("boots")) score += 12;
    } else if (weather === "Rainy") {
      if (itemNames.includes("suede") || itemNames.includes("white")) score -= 15;
      if (hasOuterwear || itemNames.includes("boots") || itemNames.includes("cargo")) score += 10;
    }

    // Season match bonus
    const seasonMatches = itemSeasons.filter(s => rules.preferredSeasons.includes(s) || s === "All Season").length;
    score += Math.round((seasonMatches / items.length) * 8);

    return Math.min(100, Math.max(50, score));
  }

  /**
   * Calculate overall Match Score using Style4P weighting architecture:
   * Color Compatibility: 30%
   * Style Compatibility: 25%
   * Category Compatibility: 20%
   * Occasion: 15%
   * Weather: 10%
   */
  static calculateOverallMatchScore(items, occasion = "Casual", weather = "Warm", preferredStyles = {}) {
    const color = this.calculateColorScore(items);
    const style = this.calculateStyleScore(items, preferredStyles);
    const category = this.calculateCategoryScore(items);
    const occasionScore = this.calculateOccasionScore(items, occasion);
    const weatherScore = this.calculateWeatherScore(items, weather);

    const overall = Math.round(
      color * 0.30 +
      style * 0.25 +
      category * 0.20 +
      occasionScore * 0.15 +
      weatherScore * 0.10
    );

    return {
      overall: Math.min(99, Math.max(60, overall)),
      breakdown: {
        color,
        style,
        category,
        occasion: occasionScore,
        weather: weatherScore
      }
    };
  }

  /**
   * Compute Outfit Potential for a given clothing item
   * Counts how many compatible combinations can be made with current closet
   */
  static calculateOutfitPotential(item, allClosetItems) {
    const tops = allClosetItems.filter(i => i.category === "Top" && i.id !== item.id);
    const bottoms = allClosetItems.filter(i => i.category === "Bottom" && i.id !== item.id);
    const shoes = allClosetItems.filter(i => i.category === "Shoes" && i.id !== item.id);
    const outerwears = allClosetItems.filter(i => i.category === "Outerwear" && i.id !== item.id);
    const accessories = allClosetItems.filter(i => i.category === "Accessory" && i.id !== item.id);

    let baseCombos = 0;
    if (item.category === "Top") {
      baseCombos = bottoms.length * shoes.length;
    } else if (item.category === "Bottom") {
      baseCombos = tops.length * shoes.length;
    } else if (item.category === "Shoes") {
      baseCombos = tops.length * bottoms.length;
    } else if (item.category === "Outerwear") {
      baseCombos = tops.length * bottoms.length * Math.max(1, shoes.length);
    } else if (item.category === "Accessory") {
      baseCombos = tops.length * bottoms.length * Math.max(1, shoes.length);
    }

    // Multiply by optional layer variations
    const layerFactor = 1 + (outerwears.length > 0 ? 0.8 : 0) + (accessories.length > 0 ? 0.5 : 0);
    const estimatedPotential = Math.max(4, Math.round(baseCombos * layerFactor));

    return {
      potentialCombos: estimatedPotential,
      matchingBottoms: bottoms.length,
      matchingTops: tops.length,
      matchingShoes: shoes.length,
      matchingLayers: outerwears.length + accessories.length
    };
  }

  /**
   * Generate Outfit Candidates from a user's closet
   * @param {Array} closetItems 
   * @param {Object} options { occasion, weather, seedItemId, preferredStyles, limit }
   */
  static generateCandidates(closetItems, options = {}) {
    const {
      occasion = "Casual",
      weather = "Warm",
      seedItemId = null,
      preferredStyles = {},
      limit = 10
    } = options;

    const tops = closetItems.filter(i => i.category === "Top");
    const bottoms = closetItems.filter(i => i.category === "Bottom");
    const shoes = closetItems.filter(i => i.category === "Shoes");
    const outerwears = closetItems.filter(i => i.category === "Outerwear");
    const accessories = closetItems.filter(i => i.category === "Accessory");

    if (tops.length === 0 || bottoms.length === 0 || shoes.length === 0) {
      return [];
    }

    const seedItem = seedItemId ? closetItems.find(i => i.id === seedItemId) : null;
    const candidates = [];
    const usedCombos = new Set();

    // Iterate combinations
    for (const top of tops) {
      for (const bottom of bottoms) {
        for (const shoe of shoes) {
          // If seedItem specified, ensure it is included
          const baseItems = [top, bottom, shoe];
          if (seedItem && !baseItems.some(i => i.id === seedItem.id) && seedItem.category !== "Outerwear" && seedItem.category !== "Accessory") {
            continue;
          }

          // Test without outerwear, then with compatible outerwear
          const possibleLayers = [null];
          if (weather === "Cold" || weather === "Rainy" || Math.random() > 0.5) {
            outerwears.forEach(o => possibleLayers.push(o));
          }

          for (const outer of possibleLayers) {
            // Optional accessory
            const acc = accessories.length > 0 && Math.random() > 0.4 ? accessories[Math.floor(Math.random() * accessories.length)] : null;
            
            const comboItems = [...baseItems];
            if (outer) comboItems.push(outer);
            if (acc) comboItems.push(acc);

            if (seedItem && !comboItems.some(i => i.id === seedItem.id)) {
              if (seedItem.category === "Outerwear") {
                comboItems.push(seedItem);
              } else if (seedItem.category === "Accessory") {
                comboItems.push(seedItem);
              } else {
                continue;
              }
            }

            const key = comboItems.map(i => i.id).sort().join("|");
            if (usedCombos.has(key)) continue;
            usedCombos.add(key);

            const scoreData = this.calculateOverallMatchScore(comboItems, occasion, weather, preferredStyles);
            
            // Generate a creative, fashion-forward name for the outfit
            const primaryStyle = top.style || bottom.style || "Streetwear";
            const name = this.generateOutfitName(primaryStyle, comboItems, occasion);

            candidates.push({
              id: "cand_" + Math.random().toString(36).substring(2, 9),
              name,
              style: primaryStyle,
              occasion,
              weather,
              matchScore: scoreData.overall,
              scoreBreakdown: scoreData.breakdown,
              items: comboItems,
              itemIds: comboItems.map(i => i.id)
            });
          }
        }
      }
    }

    // Sort candidates by matchScore descending, with slight novelty jitter
    candidates.sort((a, b) => b.matchScore - a.matchScore);

    return candidates.slice(0, limit);
  }

  /**
   * Helper: Generate evocative outfit titles
   */
  static generateOutfitName(style, items, occasion) {
    const adjectives = {
      Streetwear: ["Downtown", "Tokyo", "Cyber", "Underground", "Heavy Duty", "Raw Boxy", "Subway"],
      Minimal: ["Quiet Luxe", "Gallery", "Clean Silhouette", "Nordic", "Monochrome", "Architect"],
      Casual: ["Weekend", "Off-Duty", "Breezy", "Daily Routine", "Neighborhood", "Sunlight"],
      Vintage: ["Retro Heritage", "70s Revival", "Analog", "Washed Classics", "Thrifted", "Archive"],
      Y2K: ["Millennium", "Acid Chrome", "Futuristic", "Pop Matrix", "Glitch", "Hyper"],
      Formal: ["Sharp Tailored", "Executive", "Sartorial", "Contemporary Suit", "Curated"]
    };

    const nouns = {
      Cafe: ["Espresso Fit", "Morning Run", "Reading Corner", "Sunday Stroll"],
      University: ["Lecture Spec", "Campus Uniform", "Library Session", "Quad Relax"],
      Party: ["Night Echo", "Club Layering", "Afterhours", "Neon Scene"],
      Formal: ["Curated Dress", "Boardroom", "Modern Suiting"],
      Casual: ["Effortless Ensemble", "Daily Essential", "Signature Look"]
    };

    const adjList = adjectives[style] || adjectives.Streetwear;
    const nounList = nouns[occasion] || nouns.Casual;

    const adj = adjList[Math.floor(Math.random() * adjList.length)];
    const noun = nounList[Math.floor(Math.random() * nounList.length)];

    return `${adj} ${noun}`;
  }

  /**
   * Outfit Remix Algorithm
   * Given an existing outfit and a slot (category) to swap out,
   * finds top replacement candidates from user's closet and recalculates match scores!
   */
  static remixSlot(outfit, slotCategory, allClosetItems, occasion = "Casual", weather = "Warm", preferredStyles = {}) {
    const availableAlternatives = allClosetItems.filter(i => 
      i.category === slotCategory && 
      !outfit.items.some(existing => existing.id === i.id)
    );

    if (availableAlternatives.length === 0) {
      return [];
    }

    const currentNonSlotItems = outfit.items.filter(i => i.category !== slotCategory);

    return availableAlternatives.map(alternativeItem => {
      const newItems = [...currentNonSlotItems, alternativeItem];
      const scoreData = this.calculateOverallMatchScore(newItems, occasion, weather, preferredStyles);
      
      return {
        replacementItem: alternativeItem,
        newOutfit: {
          ...outfit,
          id: "remix_" + Math.random().toString(36).substring(2, 9),
          name: `Remix: ${outfit.name.replace(/^Remix:\s*/, "")} (with ${alternativeItem.name})`,
          items: newItems,
          itemIds: newItems.map(i => i.id),
          matchScore: scoreData.overall,
          scoreBreakdown: scoreData.breakdown
        }
      };
    }).sort((a, b) => b.newOutfit.matchScore - a.newOutfit.matchScore);
  }
}

// Export for browser and node
if (typeof module !== "undefined" && module.exports) {
  module.exports = { MatchingEngine };
}
