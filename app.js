/**
 * Style4P: Application Controller & State Engine
 * Manages all user flows: Home, Digital Closet, Outfit Discovery, Remix Studio,
 * Forgotten Items, Wear Tracking, Closet Analytics, and Persistence.
 */

import {
  auth,
  db,
  loginWithGoogle,
  logout,
  onAuthStateChanged,
  addClothingItem,
  fetchClothingItems
} from "./firebase-config.js";


// Storage Keys
const STORAGE_KEYS = {
  USER: "style4p_user",
  CLOTHING: "style4p_clothing",
  OUTFITS: "style4p_outfits",
  WEAR_LOGS: "style4p_wear_logs",
  FEEDBACK: "style4p_feedback",
  THEME: "style4p_theme",
  PREFS: "style4p_preferences"
};

class Style4PApp {
  constructor() {
    this.user = this.loadData(STORAGE_KEYS.USER, SEED_USER);
    this.clothingItems = this.loadData(STORAGE_KEYS.CLOTHING, SEED_CLOTHING_ITEMS);
    this.outfits = this.loadData(STORAGE_KEYS.OUTFITS, SEED_OUTFITS);
    this.wearLogs = this.loadData(STORAGE_KEYS.WEAR_LOGS, SEED_WEAR_LOGS);
    this.feedback = this.loadData(STORAGE_KEYS.FEEDBACK, SEED_FEEDBACK);
    this.preferences = this.loadData(STORAGE_KEYS.PREFS, { Streetwear: 3, Minimal: 2 });

    this.activeView = "home";
    this.selectedCategory = "ALL";
    this.currentCandidateIndex = 0;
    this.discoveryCandidates = [];
    this.seedItemId = null; // Locked item for discovery

    // Remix state
    this.activeRemixOutfit = null;
    this.originalRemixOutfit = null;
    this.activeRemixSlot = "Bottom";

    this.init();
  }

  loadData(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
    } catch (e) {
      console.error("Error loading localStorage key:", key, e);
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  saveData(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving localStorage key:", key, e);
    }
  }

  init() {
    this.initTheme();
    this.initNavigation();
    this.initUserHeader();
    this.initClosetFilters();
    this.initDiscoveryControls();
    this.initRemixControls();
    this.initModals();
    this.initFirebaseAuth();
    this.updateBadges();

    // Generate initial discovery candidates
    this.regenerateCandidates();

    // Default to Home view
    this.showView("home");
  }

  // ==========================================
  // THEME & HEADER
  // ==========================================
  initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const toggleBtn = document.getElementById("btn-theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem(STORAGE_KEYS.THEME, next);
        this.showToast(`Switched to ${next} theme`, "lime");
      });
    }
  }

  initUserHeader() {
    const avatar = document.getElementById("sidebar-user-avatar");
    const name = document.getElementById("sidebar-user-name");
    const email = document.getElementById("sidebar-user-email");
    const greeting = document.getElementById("home-greeting-heading");

    if (avatar) avatar.src = this.user.avatarUrl;
    if (name) name.textContent = this.user.name;
    if (email) email.textContent = this.user.email;
    if (greeting) greeting.textContent = `GOOD MORNING, ${this.user.name.split(" ")[0].toUpperCase()}`;
  }

  updateBadges() {
    const closetCountBadge = document.getElementById("nav-closet-count");
    if (closetCountBadge) closetCountBadge.textContent = this.clothingItems.length;

    const forgotten = this.getForgottenItems();
    const forgottenCountBadge = document.getElementById("nav-forgotten-count");
    if (forgottenCountBadge) forgottenCountBadge.textContent = forgotten.length;
  }

  // ==========================================
  // NAVIGATION ROUTING
  // ==========================================
  initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const targetView = link.getAttribute("data-view");
        this.showView(targetView);

        // Close mobile drawer if open
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar) sidebar.classList.remove("open");
      });
    });

    const mobileToggle = document.getElementById("btn-mobile-nav");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        const sidebar = document.getElementById("app-sidebar");
        if (sidebar) sidebar.classList.toggle("open");
      });
    }

    // Home quick CTAs
    const ctaDiscover = document.getElementById("home-cta-discover");
    if (ctaDiscover) ctaDiscover.addEventListener("click", () => this.showView("discover"));

    const ctaCloset = document.getElementById("home-cta-closet");
    if (ctaCloset) ctaCloset.addEventListener("click", () => this.showView("closet"));

    const seeAllOutfits = document.getElementById("btn-see-all-outfits");
    if (seeAllOutfits) seeAllOutfits.addEventListener("click", () => this.showView("discover"));
  }

  showView(viewName) {
    this.activeView = viewName;

    // Update nav link active state
    document.querySelectorAll(".nav-link").forEach(link => {
      if (link.getAttribute("data-view") === viewName) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });

    // Hide all views, display target
    document.querySelectorAll(".page-view").forEach(section => {
      section.classList.remove("active");
    });

    const targetSection = document.getElementById(`view-${viewName}`);
    if (targetSection) {
      targetSection.classList.add("active");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Render corresponding view data
    if (viewName === "home") this.renderHomeView();
    if (viewName === "closet") this.renderClosetView();
    if (viewName === "discover") this.renderDiscoveryView();
    if (viewName === "remix") this.renderRemixView();
    if (viewName === "forgotten") this.renderForgottenView();
    if (viewName === "history") this.renderHistoryView();
    if (viewName === "analytics") this.renderAnalyticsView();
  }

  // ==========================================
  // VIEW 1: HOME (DASHBOARD)
  // ==========================================
  renderHomeView() {
    // Stats
    const elItems = document.getElementById("home-stat-items");
    const elOutfits = document.getElementById("home-stat-outfits");
    const elRotation = document.getElementById("home-stat-rotation");
    const elCombos = document.getElementById("home-stat-combos");

    if (elItems) elItems.textContent = this.clothingItems.length;
    if (elOutfits) elOutfits.textContent = this.outfits.length;

    // Wardrobe rotation rate (% worn in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeWornItems = this.clothingItems.filter(item => {
      if (!item.lastWorn) return false;
      return new Date(item.lastWorn) >= thirtyDaysAgo;
    });
    const rotationRate = this.clothingItems.length > 0
      ? Math.round((activeWornItems.length / this.clothingItems.length) * 100)
      : 0;
    if (elRotation) elRotation.textContent = `${rotationRate}%`;

    // Estimate potential combinations
    const tops = this.clothingItems.filter(i => i.category === "Top").length;
    const bottoms = this.clothingItems.filter(i => i.category === "Bottom").length;
    const shoes = this.clothingItems.filter(i => i.category === "Shoes").length;
    const totalCombos = Math.max(tops * bottoms * shoes, 12);
    if (elCombos) elCombos.textContent = `${totalCombos}+`;

    // Forgotten Spotlight
    const forgottenItems = this.getForgottenItems();
    const spotlightItem = forgottenItems.length > 0 ? forgottenItems[0] : null;
    const spotlightEl = document.getElementById("home-forgotten-spotlight");

    if (spotlightItem && spotlightEl) {
      spotlightEl.style.display = "flex";
      document.getElementById("home-forgotten-img").src = spotlightItem.imageUrl;
      document.getElementById("home-forgotten-name").textContent = spotlightItem.name;
      const days = this.getDaysSince(spotlightItem.lastWorn);
      document.getElementById("home-forgotten-days").textContent = days ? `${days} days ago` : "Never worn";
      document.getElementById("home-forgotten-wears").textContent = spotlightItem.wearCount || 0;

      const remixBtn = document.getElementById("home-forgotten-remix-btn");
      remixBtn.onclick = () => {
        this.seedItemId = spotlightItem.id;
        this.regenerateCandidates();
        this.showView("discover");
        this.showToast(`Focused discovery around ${spotlightItem.name}`, "lime");
      };
    } else if (spotlightEl) {
      spotlightEl.style.display = "none";
    }

    // Recent Outfits Shelf
    const shelfGrid = document.getElementById("home-recent-outfits-grid");
    if (shelfGrid) {
      shelfGrid.innerHTML = "";
      const displayOutfits = this.outfits.slice(0, 4);

      displayOutfits.forEach(outfit => {
        const outfitItems = outfit.itemIds.map(id => this.clothingItems.find(i => i.id === id)).filter(Boolean);
        const card = document.createElement("div");
        card.className = "outfit-mini-card";

        // Gallery images
        const galleryImgs = outfitItems.slice(0, 2).map(item => `
          <img src="${item.imageUrl}" alt="${item.name}" class="outfit-mini-img">
        `).join("");

        card.innerHTML = `
          <div class="outfit-mini-gallery">
            ${galleryImgs}
          </div>
          <div class="outfit-mini-content">
            <div class="outfit-mini-header">
              <h4 class="outfit-mini-name">${outfit.name}</h4>
              <span class="match-score-pill">${outfit.matchScore}% Match</span>
            </div>
            <div class="outfit-mini-footer">
              <span>Style: <strong>${outfit.style}</strong></span>
              <span>Worn ${outfit.wearCount || 0} times</span>
            </div>
          </div>
        `;

        card.addEventListener("click", () => {
          this.activeRemixOutfit = {
            ...outfit,
            items: outfitItems
          };
          this.originalRemixOutfit = JSON.parse(JSON.stringify(this.activeRemixOutfit));
          this.showView("remix");
        });

        shelfGrid.appendChild(card);
      });
    }
  }

  // ==========================================
  // VIEW 2: DIGITAL CLOSET
  // ==========================================
  initClosetFilters() {
    const searchInput = document.getElementById("closet-search-input");
    const styleSelect = document.getElementById("filter-style-select");
    const colorSelect = document.getElementById("filter-color-select");
    const seasonSelect = document.getElementById("filter-season-select");
    const catTabs = document.querySelectorAll(".category-tab-btn");

    if (searchInput) {
      searchInput.addEventListener("input", () => this.renderClosetView());
    }
    if (styleSelect) {
      styleSelect.addEventListener("change", () => this.renderClosetView());
    }
    if (colorSelect) {
      colorSelect.addEventListener("change", () => this.renderClosetView());
    }
    if (seasonSelect) {
      seasonSelect.addEventListener("change", () => this.renderClosetView());
    }

    catTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        catTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        this.selectedCategory = tab.getAttribute("data-cat");
        this.renderClosetView();
      });
    });
  }

  renderClosetView() {
    const grid = document.getElementById("closet-items-grid");
    if (!grid) return;

    // Update category badge counts
    const counts = {
      all: this.clothingItems.length,
      top: this.clothingItems.filter(i => i.category === "Top").length,
      bot: this.clothingItems.filter(i => i.category === "Bottom").length,
      out: this.clothingItems.filter(i => i.category === "Outerwear").length,
      shoe: this.clothingItems.filter(i => i.category === "Shoes").length,
      acc: this.clothingItems.filter(i => i.category === "Accessory").length
    };
    document.getElementById("cat-count-all").textContent = counts.all;
    document.getElementById("cat-count-top").textContent = counts.top;
    document.getElementById("cat-count-bot").textContent = counts.bot;
    document.getElementById("cat-count-out").textContent = counts.out;
    document.getElementById("cat-count-shoe").textContent = counts.shoe;
    document.getElementById("cat-count-acc").textContent = counts.acc;

    // Filters
    const query = (document.getElementById("closet-search-input")?.value || "").toLowerCase().trim();
    const styleFilter = document.getElementById("filter-style-select")?.value || "ALL";
    const colorFilter = document.getElementById("filter-color-select")?.value || "ALL";
    const seasonFilter = document.getElementById("filter-season-select")?.value || "ALL";

    const filtered = this.clothingItems.filter(item => {
      if (this.selectedCategory !== "ALL" && item.category !== this.selectedCategory) return false;
      if (styleFilter !== "ALL" && item.style !== styleFilter) return false;
      if (colorFilter !== "ALL" && item.color !== colorFilter) return false;
      if (seasonFilter !== "ALL" && item.season !== seasonFilter && item.season !== "All Season") return false;
      if (query && !item.name.toLowerCase().includes(query) && !item.color.toLowerCase().includes(query) && !item.style.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });

    grid.innerHTML = "";

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <svg style="width: 48px; height: 48px; margin: 0 auto 1rem; stroke-width: 1.5;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
          <h3>No clothing items matched your filter</h3>
          <p style="margin-top: 0.5rem;">Try adjusting your search criteria or add new clothes.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "clothing-card";

      const potential = MatchingEngine.calculateOutfitPotential(item, this.clothingItems);

      card.innerHTML = `
        <div class="clothing-img-box">
          <img src="${item.imageUrl}" alt="${item.name}" class="clothing-img" loading="lazy">
          <div class="clothing-overlay-badges">
            <span class="tag-chip accent">${item.category}</span>
            <span class="tag-chip" style="background: rgba(0,0,0,0.6);">${item.wearCount || 0} Wears</span>
          </div>
        </div>
        <div class="clothing-details">
          <h4 class="clothing-name">${item.name}</h4>
          <div class="clothing-tags-row">
            <span class="tag-chip">${item.color}</span>
            <span class="tag-chip">${item.style}</span>
            <span class="tag-chip">${item.season}</span>
          </div>
          <div class="clothing-potential" title="Estimated combinations with current closet">
            <span>⚡ ${potential.potentialCombos}+ Outfit Potentials</span>
          </div>
          <div class="clothing-actions-row">
            <button class="btn btn-secondary btn-sm" data-action="seed-discover" data-id="${item.id}" title="Build outfits with this piece">
              <span>Try In Outfit</span>
            </button>
            <button class="btn btn-ghost btn-sm" data-action="delete-item" data-id="${item.id}" title="Delete item" style="flex: 0 0 auto; color: var(--accent-danger);">
              🗑️
            </button>
          </div>
        </div>
      `;

      // Event listener for action buttons
      const btnDiscover = card.querySelector(`[data-action="seed-discover"]`);
      if (btnDiscover) {
        btnDiscover.addEventListener("click", () => {
          this.seedItemId = item.id;
          this.regenerateCandidates();
          this.showView("discover");
          this.showToast(`Discovering outfits featuring ${item.name}`, "lime");
        });
      }

      const btnDelete = card.querySelector(`[data-action="delete-item"]`);
      if (btnDelete) {
        btnDelete.addEventListener("click", () => {
          if (confirm(`Remove "${item.name}" from your closet?`)) {
            this.clothingItems = this.clothingItems.filter(i => i.id !== item.id);
            this.saveData(STORAGE_KEYS.CLOTHING, this.clothingItems);
            this.renderClosetView();
            this.updateBadges();
            this.showToast(`Removed "${item.name}"`, "primary");
          }
        });
      }

      grid.appendChild(card);
    });
  }

  // ==========================================
  // VIEW 3: OUTFIT DISCOVERY (HERO FEATURE)
  // ==========================================
  initDiscoveryControls() {
    const occSelect = document.getElementById("discover-occasion-select");
    const weaSelect = document.getElementById("discover-weather-select");
    const btnShuffle = document.getElementById("btn-shuffle-discovery");
    const btnClearSeed = document.getElementById("btn-clear-seed");

    if (occSelect) {
      occSelect.addEventListener("change", () => this.regenerateCandidates());
    }
    if (weaSelect) {
      weaSelect.addEventListener("change", () => this.regenerateCandidates());
    }
    if (btnShuffle) {
      btnShuffle.addEventListener("click", () => {
        this.regenerateCandidates();
        this.showToast("Generated new candidate combinations!", "lime");
      });
    }
    if (btnClearSeed) {
      btnClearSeed.addEventListener("click", () => {
        this.seedItemId = null;
        this.regenerateCandidates();
        this.showToast("Cleared item lock", "lime");
      });
    }

    // Action Controls: Skip, Remix, Wore, Like
    const btnSkip = document.getElementById("btn-discovery-skip");
    const btnRemix = document.getElementById("btn-discovery-remix");
    const btnWore = document.getElementById("btn-discovery-wear");
    const btnLike = document.getElementById("btn-discovery-like");

    if (btnSkip) {
      btnSkip.addEventListener("click", () => this.handleDiscoveryAction("SKIP"));
    }
    if (btnLike) {
      btnLike.addEventListener("click", () => this.handleDiscoveryAction("LIKE"));
    }
    if (btnWore) {
      btnWore.addEventListener("click", () => this.handleDiscoveryWear());
    }
    if (btnRemix) {
      btnRemix.addEventListener("click", () => {
        const candidate = this.getCurrentCandidate();
        if (candidate) {
          this.activeRemixOutfit = JSON.parse(JSON.stringify(candidate));
          this.originalRemixOutfit = JSON.parse(JSON.stringify(candidate));
          this.showView("remix");
        }
      });
    }
  }

  regenerateCandidates() {
    const occasion = document.getElementById("discover-occasion-select")?.value || "Casual";
    const weather = document.getElementById("discover-weather-select")?.value || "Warm";

    const seedIndicator = document.getElementById("seed-filter-indicator");
    const seedTag = document.getElementById("seed-item-tag");

    if (this.seedItemId) {
      const seedItem = this.clothingItems.find(i => i.id === this.seedItemId);
      if (seedIndicator && seedTag && seedItem) {
        seedIndicator.style.display = "flex";
        seedTag.textContent = `Seeded: ${seedItem.name}`;
      }
    } else if (seedIndicator) {
      seedIndicator.style.display = "none";
    }

    this.discoveryCandidates = MatchingEngine.generateCandidates(this.clothingItems, {
      occasion,
      weather,
      seedItemId: this.seedItemId,
      preferredStyles: this.preferences,
      limit: 15
    });

    this.currentCandidateIndex = 0;
    this.renderDiscoveryView();
  }

  getCurrentCandidate() {
    if (!this.discoveryCandidates || this.discoveryCandidates.length === 0) return null;
    return this.discoveryCandidates[this.currentCandidateIndex % this.discoveryCandidates.length];
  }

  renderDiscoveryView() {
    const candidate = this.getCurrentCandidate();
    const activeCard = document.getElementById("outfit-active-card");

    if (!candidate) {
      if (activeCard) {
        activeCard.innerHTML = `
          <div style="padding: 4rem 2rem; text-align: center; color: var(--text-muted);">
            <h3>No more outfit candidates with this filter</h3>
            <p style="margin-top: 0.5rem;">Add more Tops, Bottoms, or Shoes to your closet to unlock more looks!</p>
            <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="app.showModalAddItem()">+ Add Clothing</button>
          </div>
        `;
      }
      return;
    }

    // Name & Style tags
    document.getElementById("active-outfit-name").textContent = candidate.name;
    document.getElementById("active-outfit-style").textContent = candidate.style;
    document.getElementById("active-outfit-occasion").textContent = candidate.occasion;
    document.getElementById("active-outfit-score").textContent = candidate.matchScore;

    // Breakdown Panel
    const bd = candidate.scoreBreakdown;
    document.getElementById("side-score-overall").textContent = `${candidate.matchScore} / 100`;

    document.getElementById("score-val-color").textContent = bd.color;
    document.getElementById("bar-color").style.width = `${bd.color}%`;

    document.getElementById("score-val-style").textContent = bd.style;
    document.getElementById("bar-style").style.width = `${bd.style}%`;

    document.getElementById("score-val-cat").textContent = bd.category;
    document.getElementById("bar-cat").style.width = `${bd.category}%`;

    document.getElementById("score-val-occ").textContent = bd.occasion;
    document.getElementById("bar-occ").style.width = `${bd.occasion}%`;

    document.getElementById("score-val-wea").textContent = bd.weather;
    document.getElementById("bar-wea").style.width = `${bd.weather}%`;

    // Render Items in Discovery Deck
    const galleryDeck = document.getElementById("active-outfit-items-gallery");
    if (galleryDeck) {
      galleryDeck.innerHTML = "";
      candidate.items.forEach(item => {
        const tile = document.createElement("div");
        tile.className = "deck-item-tile";
        tile.innerHTML = `
          <img src="${item.imageUrl}" alt="${item.name}" class="deck-item-img">
          <div class="deck-item-info">
            <span class="deck-item-cat">${item.category}</span>
            <div class="deck-item-name">${item.name}</div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 0.25rem;">${item.color} • ${item.style}</div>
          </div>
        `;
        galleryDeck.appendChild(tile);
      });
    }
  }

  handleDiscoveryAction(action) {
    const candidate = this.getCurrentCandidate();
    if (!candidate) return;

    // Record feedback
    this.feedback.push({
      id: "fb_" + Date.now(),
      userId: this.user.id,
      outfitId: candidate.id,
      action,
      createdAt: new Date().toISOString()
    });
    this.saveData(STORAGE_KEYS.FEEDBACK, this.feedback);

    if (action === "LIKE") {
      // Reinforce preference
      this.preferences[candidate.style] = (this.preferences[candidate.style] || 0) + 1;
      this.saveData(STORAGE_KEYS.PREFS, this.preferences);

      // Save to outfits library if not already there
      const existing = this.outfits.find(o => o.id === candidate.id);
      if (!existing) {
        this.outfits.unshift({
          ...candidate,
          isFavorite: true,
          wearCount: 0,
          createdAt: new Date().toISOString()
        });
        this.saveData(STORAGE_KEYS.OUTFITS, this.outfits);
      }

      this.showToast(`Saved "${candidate.name}" to favorites! ❤️`, "primary");
    } else {
      this.showToast(`Skipped. Learning your style preferences...`, "lime");
    }

    // Advance to next candidate
    this.currentCandidateIndex++;
    this.renderDiscoveryView();
  }

  handleDiscoveryWear() {
    const candidate = this.getCurrentCandidate();
    if (!candidate) return;

    this.recordWear(candidate);
    this.showToast(`Wore "${candidate.name}"! Wear logs updated. 👟`, "lime");

    // Advance to next
    this.currentCandidateIndex++;
    this.renderDiscoveryView();
  }

  recordWear(outfit, notes = "Worn from Style4P") {
    // 1. Add wear log
    const newLog = {
      id: "wear_" + Date.now(),
      userId: this.user.id,
      outfitId: outfit.id,
      outfitName: outfit.name,
      occasion: outfit.occasion || "Casual",
      wornAt: new Date().toISOString(),
      notes
    };
    this.wearLogs.unshift(newLog);
    this.saveData(STORAGE_KEYS.WEAR_LOGS, this.wearLogs);

    // 2. Increment outfit wearCount
    const savedOutfit = this.outfits.find(o => o.id === outfit.id);
    if (savedOutfit) {
      savedOutfit.wearCount = (savedOutfit.wearCount || 0) + 1;
      savedOutfit.lastWorn = newLog.wornAt;
    } else {
      this.outfits.unshift({
        ...outfit,
        wearCount: 1,
        lastWorn: newLog.wornAt,
        createdAt: newLog.wornAt
      });
    }
    this.saveData(STORAGE_KEYS.OUTFITS, this.outfits);

    // 3. Increment wearCount on each constituent clothing item
    const itemIds = outfit.items ? outfit.items.map(i => i.id) : (outfit.itemIds || []);
    this.clothingItems.forEach(item => {
      if (itemIds.includes(item.id)) {
        item.wearCount = (item.wearCount || 0) + 1;
        item.lastWorn = newLog.wornAt;
      }
    });
    this.saveData(STORAGE_KEYS.CLOTHING, this.clothingItems);

    this.updateBadges();
  }

  // ==========================================
  // VIEW 4: OUTFIT REMIX (SIGNATURE FEATURE)
  // ==========================================
  initRemixControls() {
    const btnReset = document.getElementById("btn-remix-reset");
    const btnSave = document.getElementById("btn-save-remix");

    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (this.originalRemixOutfit) {
          this.activeRemixOutfit = JSON.parse(JSON.stringify(this.originalRemixOutfit));
          this.renderRemixView();
          this.showToast("Reset to original outfit combination", "lime");
        }
      });
    }

    if (btnSave) {
      btnSave.addEventListener("click", () => {
        if (!this.activeRemixOutfit) return;

        const newOutfit = {
          ...this.activeRemixOutfit,
          id: "outfit_remix_" + Date.now(),
          wearCount: 0,
          createdAt: new Date().toISOString()
        };

        this.outfits.unshift(newOutfit);
        this.saveData(STORAGE_KEYS.OUTFITS, this.outfits);
        this.showToast(`Saved "${newOutfit.name}" as new outfit!`, "lime");
        this.showView("closet");
      });
    }
  }

  renderRemixView() {
    if (!this.activeRemixOutfit) {
      // Pick first existing outfit or generate one
      if (this.outfits.length > 0) {
        const seed = this.outfits[0];
        const outfitItems = seed.itemIds.map(id => this.clothingItems.find(i => i.id === id)).filter(Boolean);
        this.activeRemixOutfit = {
          ...seed,
          items: outfitItems
        };
        this.originalRemixOutfit = JSON.parse(JSON.stringify(this.activeRemixOutfit));
      } else {
        const candidates = MatchingEngine.generateCandidates(this.clothingItems, { limit: 1 });
        if (candidates.length > 0) {
          this.activeRemixOutfit = candidates[0];
          this.originalRemixOutfit = JSON.parse(JSON.stringify(candidates[0]));
        }
      }
    }

    const outfit = this.activeRemixOutfit;
    if (!outfit) return;

    // Header banner
    document.getElementById("remix-active-title").textContent = `Remixing: ${outfit.name}`;
    document.getElementById("remix-live-score").textContent = `Live Score: ${outfit.matchScore}%`;

    // Render Slots: Top, Bottom, Outerwear, Shoes, Accessory
    const slotsContainer = document.getElementById("remix-slots-container");
    slotsContainer.innerHTML = "";

    const categories = ["Top", "Bottom", "Outerwear", "Shoes", "Accessory"];
    categories.forEach(cat => {
      const currentItem = outfit.items.find(i => i.category === cat);
      const isSelected = this.activeRemixSlot === cat;

      const slotCard = document.createElement("div");
      slotCard.className = `remix-slot-card ${isSelected ? "active-slot" : ""}`;

      if (currentItem) {
        slotCard.innerHTML = `
          <span class="remix-slot-badge">${cat} Slot</span>
          <img src="${currentItem.imageUrl}" alt="${currentItem.name}" class="remix-slot-img">
          <div class="remix-slot-name">${currentItem.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.75rem;">${currentItem.color} • ${currentItem.style}</div>
          <button class="btn btn-secondary btn-sm remix-slot-btn" data-slot="${cat}">
            <span>${isSelected ? "Remixing This ⚡" : "Swap Piece 🔄"}</span>
          </button>
        `;
      } else {
        slotCard.innerHTML = `
          <span class="remix-slot-badge">${cat} Slot (Empty)</span>
          <div style="width: 120px; height: 140px; display: flex; align-items: center; justify-content: center; background: var(--bg-card-elevated); border-radius: var(--radius-md); margin-bottom: 0.75rem; color: var(--text-muted);">
            + Empty
          </div>
          <div class="remix-slot-name">Add ${cat}</div>
          <button class="btn btn-lime btn-sm remix-slot-btn" data-slot="${cat}">
            <span>+ Add Piece</span>
          </button>
        `;
      }

      slotCard.querySelector(".remix-slot-btn").addEventListener("click", () => {
        this.activeRemixSlot = cat;
        this.renderRemixView();
      });

      slotsContainer.appendChild(slotCard);
    });

    // Render Alternative Choices for the active slot
    this.renderRemixAlternatives();
  }

  renderRemixAlternatives() {
    const altGrid = document.getElementById("remix-alternatives-grid");
    const heading = document.getElementById("remix-alt-heading");
    const subtitle = document.getElementById("remix-alt-subtitle");
    const countBadge = document.getElementById("remix-alt-count");

    if (!altGrid) return;
    altGrid.innerHTML = "";

    const slot = this.activeRemixSlot;
    heading.textContent = `Choose Alternative for ${slot}`;
    subtitle.textContent = `Remixing ${slot} slot`;

    const remixes = MatchingEngine.remixSlot(
      this.activeRemixOutfit,
      slot,
      this.clothingItems,
      this.activeRemixOutfit.occasion,
      this.activeRemixOutfit.weather,
      this.preferences
    );

    countBadge.textContent = `${remixes.length} compatible pieces found`;

    if (remixes.length === 0) {
      altGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 2rem 0; color: var(--text-muted); text-align: center;">
          No other items found in your closet for ${slot}. Add more to expand remix options!
        </div>
      `;
      return;
    }

    remixes.forEach(({ replacementItem, newOutfit }) => {
      const card = document.createElement("div");
      card.className = "alternative-item-card";
      card.innerHTML = `
        <img src="${replacementItem.imageUrl}" alt="${replacementItem.name}" class="alternative-item-img">
        <div class="alternative-item-info">
          <div style="font-weight: 700; font-size: 0.9rem; line-height: 1.25;">${replacementItem.name}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem;">${replacementItem.color} • ${replacementItem.style}</div>
          <span class="alternative-score-chip">⚡ Recalculated: ${newOutfit.matchScore}% Match</span>
        </div>
      `;

      card.addEventListener("click", () => {
        this.activeRemixOutfit = newOutfit;
        this.renderRemixView();
        this.showToast(`Swapped in "${replacementItem.name}"! Match score: ${newOutfit.matchScore}%`, "lime");
      });

      altGrid.appendChild(card);
    });
  }

  // ==========================================
  // VIEW 5: FORGOTTEN ITEMS (WEAR MORE)
  // ==========================================
  getForgottenItems() {
    const twentyFiveDaysAgo = new Date();
    twentyFiveDaysAgo.setDate(twentyFiveDaysAgo.getDate() - 25);

    return this.clothingItems.filter(item => {
      if (!item.lastWorn) return true; // Never worn
      return new Date(item.lastWorn) <= twentyFiveDaysAgo || (item.wearCount || 0) <= 2;
    }).sort((a, b) => {
      const dateA = a.lastWorn ? new Date(a.lastWorn).getTime() : 0;
      const dateB = b.lastWorn ? new Date(b.lastWorn).getTime() : 0;
      return dateA - dateB;
    });
  }

  getDaysSince(dateString) {
    if (!dateString) return null;
    const diff = Date.now() - new Date(dateString).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  renderForgottenView() {
    const grid = document.getElementById("forgotten-cards-grid");
    if (!grid) return;

    const forgotten = this.getForgottenItems();
    grid.innerHTML = "";

    if (forgotten.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>Outstanding Wardrobe Rotation! ✨</h3>
          <p style="margin-top: 0.5rem;">None of your clothes are currently forgotten. Every piece has been worn recently!</p>
        </div>
      `;
      return;
    }

    forgotten.forEach(item => {
      const days = this.getDaysSince(item.lastWorn);
      const potential = MatchingEngine.calculateOutfitPotential(item, this.clothingItems);

      const card = document.createElement("div");
      card.className = "forgotten-full-card";
      card.innerHTML = `
        <div class="forgotten-img-wrap">
          <img src="${item.imageUrl}" alt="${item.name}" class="forgotten-full-img">
          <span class="forgotten-days-pill">${days !== null ? `${days} Days Dormant` : 'Never Worn'}</span>
        </div>
        <div class="forgotten-full-content">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h4 style="font-size: 1.15rem; font-weight: 700;">${item.name}</h4>
            <span class="tag-chip">${item.category}</span>
          </div>
          
          <div class="forgotten-stats-list">
            <div>• Worn only <strong>${item.wearCount || 0} times</strong> in total</div>
            <div>• Style: <strong>${item.style}</strong> | Color: <strong>${item.color}</strong></div>
            <div>• Untapped: Can form <strong>${potential.potentialCombos}+ looks</strong> with your closet</div>
          </div>

          <button class="btn btn-lime" data-action="resurrect" data-id="${item.id}" style="margin-top: auto;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            <span>TRY THIS ITEM</span>
          </button>
        </div>
      `;

      card.querySelector(`[data-action="resurrect"]`).addEventListener("click", () => {
        this.seedItemId = item.id;
        this.regenerateCandidates();
        this.showView("discover");
        this.showToast(`Locked discovery to revive "${item.name}"!`, "lime");
      });

      grid.appendChild(card);
    });
  }

  // ==========================================
  // VIEW 6: WEAR TRACKING & HISTORY
  // ==========================================
  renderHistoryView() {
    const timeline = document.getElementById("wear-logs-timeline");
    if (!timeline) return;

    timeline.innerHTML = "";

    if (this.wearLogs.length === 0) {
      timeline.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <h3>No wear history yet</h3>
          <p style="margin-top: 0.5rem;">Click "I WORE THIS" on any outfit discovery to build your wear history.</p>
        </div>
      `;
      return;
    }

    this.wearLogs.forEach(log => {
      const date = new Date(log.wornAt);
      const day = date.getDate();
      const month = date.toLocaleString("en-US", { month: "short" });

      const card = document.createElement("div");
      card.className = "wear-log-card";
      card.innerHTML = `
        <div class="wear-log-left">
          <div class="wear-date-badge">
            <span class="wear-day">${day}</span>
            <span class="wear-month">${month}</span>
          </div>
          <div>
            <h4 style="font-size: 1.15rem; font-weight: 700;">${log.outfitName}</h4>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Occasion: <strong>${log.occasion}</strong> ${log.notes ? `• "${log.notes}"` : ""}
            </div>
          </div>
        </div>
        <div>
          <span class="tag-chip lime">Verified Wear</span>
        </div>
      `;
      timeline.appendChild(card);
    });
  }

  // ==========================================
  // VIEW 7: CLOSET ANALYTICS
  // ==========================================
  renderAnalyticsView() {
    // 1. Most Worn
    const sortedByWear = [...this.clothingItems].sort((a, b) => (b.wearCount || 0) - (a.wearCount || 0));
    const mostWorn = sortedByWear[0];
    const leastWorn = sortedByWear[sortedByWear.length - 1];

    if (mostWorn) {
      document.getElementById("analytics-most-worn-img").src = mostWorn.imageUrl;
      document.getElementById("analytics-most-worn-name").textContent = mostWorn.name;
      document.getElementById("analytics-most-worn-count").textContent = mostWorn.wearCount || 0;
      document.getElementById("analytics-most-worn-tag").textContent = `${mostWorn.category} • ${mostWorn.style}`;
    }

    if (leastWorn) {
      document.getElementById("analytics-least-worn-img").src = leastWorn.imageUrl;
      document.getElementById("analytics-least-worn-name").textContent = leastWorn.name;
      document.getElementById("analytics-least-worn-count").textContent = leastWorn.wearCount || 0;
      const days = this.getDaysSince(leastWorn.lastWorn);
      document.getElementById("analytics-least-worn-days").textContent = days ? `${days} days dormant` : "Never worn";

      const btnRevive = document.getElementById("analytics-revive-btn");
      btnRevive.onclick = () => {
        this.seedItemId = leastWorn.id;
        this.regenerateCandidates();
        this.showView("discover");
        this.showToast(`Starting discovery with ${leastWorn.name}`, "lime");
      };
    }

    // 2. Wardrobe Utilization Gauge
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeItems = this.clothingItems.filter(item => {
      if (!item.lastWorn) return false;
      return new Date(item.lastWorn) >= thirtyDaysAgo;
    });
    const utilization = this.clothingItems.length > 0
      ? Math.round((activeItems.length / this.clothingItems.length) * 100)
      : 0;

    document.getElementById("analytics-utilization-pct").textContent = `${utilization}%`;
    const ring = document.getElementById("utilization-svg-ring");
    if (ring) {
      const circumference = 264;
      const offset = circumference - (circumference * utilization) / 100;
      ring.style.strokeDashoffset = offset;
    }

    // 3. Category Breakdown Bars
    const catBars = document.getElementById("analytics-category-bars");
    if (catBars) {
      catBars.innerHTML = "";
      const categories = ["Top", "Bottom", "Outerwear", "Shoes", "Accessory"];
      const maxCatCount = Math.max(...categories.map(c => this.clothingItems.filter(i => i.category === c).length), 1);

      categories.forEach(cat => {
        const count = this.clothingItems.filter(i => i.category === cat).length;
        const pct = Math.round((count / this.clothingItems.length) * 100);
        const barWidth = Math.round((count / maxCatCount) * 100);

        const row = document.createElement("div");
        row.className = "distribution-bar-row";
        row.innerHTML = `
          <div class="distribution-meta">
            <span>${cat}</span>
            <span><strong>${count}</strong> items (${pct}%)</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill bar-cat" style="width: ${barWidth}%;"></div>
          </div>
        `;
        catBars.appendChild(row);
      });
    }

    // 4. Color Spectrum Palette
    const colorPalette = document.getElementById("analytics-color-dots");
    if (colorPalette) {
      colorPalette.innerHTML = "";
      const colorCounts = {};
      this.clothingItems.forEach(i => {
        colorCounts[i.color] = (colorCounts[i.color] || 0) + 1;
      });

      const swatchColors = {
        Black: "#111111",
        White: "#f5f5f5",
        Blue: "#2563eb",
        Beige: "#d4b996",
        Olive: "#6b7d42",
        Gray: "#6b7280",
        Brown: "#78350f",
        Green: "#15803d"
      };

      Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).forEach(([color, count]) => {
        const item = document.createElement("div");
        item.className = "color-dot-item";
        item.innerHTML = `
          <span class="color-swatch-circle" style="background-color: ${swatchColors[color] || '#888'};"></span>
          <span>${color}: <strong>${count}</strong></span>
        `;
        colorPalette.appendChild(item);
      });
    }

    // 5. Style Distribution
    const styleBars = document.getElementById("analytics-style-bars");
    if (styleBars) {
      styleBars.innerHTML = "";
      const styleCounts = {};
      this.clothingItems.forEach(i => {
        styleCounts[i.style] = (styleCounts[i.style] || 0) + 1;
      });

      const maxStyle = Math.max(...Object.values(styleCounts), 1);
      Object.entries(styleCounts).sort((a, b) => b[1] - a[1]).forEach(([style, count]) => {
        const barWidth = Math.round((count / maxStyle) * 100);
        const row = document.createElement("div");
        row.className = "distribution-bar-row";
        row.innerHTML = `
          <div class="distribution-meta">
            <span>${style}</span>
            <span><strong>${count}</strong> items</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill bar-style" style="width: ${barWidth}%;"></div>
          </div>
        `;
        styleBars.appendChild(row);
      });
    }

    // Export report handler
    const btnExport = document.getElementById("btn-export-analytics");
    if (btnExport) {
      btnExport.onclick = () => {
        const report = {
          generatedAt: new Date().toISOString(),
          userName: this.user.name,
          totalItems: this.clothingItems.length,
          totalOutfits: this.outfits.length,
          wardrobeUtilization: `${utilization}%`,
          mostWornPiece: mostWorn ? { name: mostWorn.name, wearCount: mostWorn.wearCount } : null,
          leastWornPiece: leastWorn ? { name: leastWorn.name, wearCount: leastWorn.wearCount } : null,
          items: this.clothingItems
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Style4P_Wardrobe_Report_${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast("Wardrobe Analytics Report exported!", "lime");
      };
    }
  }

  // ==========================================
  // MODALS & ACTIONS
  // ==========================================
  initModals() {
    // Add Item Modal
    const modalAdd = document.getElementById("modal-add-item");
    const btnQuickAdd = document.getElementById("btn-quick-add-clothing");
    const btnClosetAdd = document.getElementById("btn-closet-add-item");
    const btnCloseModalItem = document.getElementById("btn-close-modal-item");
    const btnCancelModalItem = document.getElementById("btn-cancel-modal-item");
    const formItem = document.getElementById("form-clothing-item");

    const openAddModal = () => {
      formItem.reset();
      document.getElementById("item-form-id").value = "";
      document.getElementById("modal-item-title").textContent = "Add Clothing Item";
      modalAdd.classList.add("open");
    };

    const closeAddModal = () => {
      modalAdd.classList.remove("open");
    };

    if (btnQuickAdd) btnQuickAdd.addEventListener("click", openAddModal);
    if (btnClosetAdd) btnClosetAdd.addEventListener("click", openAddModal);
    if (btnCloseModalItem) btnCloseModalItem.addEventListener("click", closeAddModal);
    if (btnCancelModalItem) btnCancelModalItem.addEventListener("click", closeAddModal);

    // Preset pills for 1-click test item fill
    const presetPills = document.querySelectorAll(".preset-pill");
    presetPills.forEach(pill => {
      pill.addEventListener("click", () => {
        const type = pill.getAttribute("data-preset");
        if (type === "hoodie") {
          document.getElementById("item-form-name").value = "Acid Washed Charcoal Zip Hoodie";
          document.getElementById("item-form-cat").value = "Top";
          document.getElementById("item-form-color").value = "Gray";
          document.getElementById("item-form-style").value = "Streetwear";
          document.getElementById("item-form-season").value = "Winter";
          document.getElementById("item-form-img").value = "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80";
        } else if (type === "cargo") {
          document.getElementById("item-form-name").value = "Utility Tactical Cargo Pants";
          document.getElementById("item-form-cat").value = "Bottom";
          document.getElementById("item-form-color").value = "Black";
          document.getElementById("item-form-style").value = "Streetwear";
          document.getElementById("item-form-season").value = "All Season";
          document.getElementById("item-form-img").value = "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80";
        } else if (type === "leather") {
          document.getElementById("item-form-name").value = "Handmade Polished Penny Loafers";
          document.getElementById("item-form-cat").value = "Shoes";
          document.getElementById("item-form-color").value = "Black";
          document.getElementById("item-form-style").value = "Minimal";
          document.getElementById("item-form-season").value = "All Season";
          document.getElementById("item-form-img").value = "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80";
        } else if (type === "trench") {
          document.getElementById("item-form-name").value = "Sand Double-Breasted Trench Coat";
          document.getElementById("item-form-cat").value = "Outerwear";
          document.getElementById("item-form-color").value = "Beige";
          document.getElementById("item-form-style").value = "Minimal";
          document.getElementById("item-form-season").value = "Spring/Fall";
          document.getElementById("item-form-img").value = "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80";
        }
      });
    });

    // Form submit
    if (formItem) {
      formItem.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("item-form-id").value;
        const name = document.getElementById("item-form-name").value;
        const category = document.getElementById("item-form-cat").value;
        const color = document.getElementById("item-form-color").value;
        const style = document.getElementById("item-form-style").value;
        const season = document.getElementById("item-form-season").value;
        const imageUrl = document.getElementById("item-form-img").value;

        if (id) {
          // Edit
          const idx = this.clothingItems.findIndex(i => i.id === id);
          if (idx !== -1) {
            this.clothingItems[idx] = {
              ...this.clothingItems[idx],
              name, category, color, style, season, imageUrl
            };
          }
        } else {
          // Add new item
          const newItem = {
            id: "item_" + Date.now(),
            userId: this.user.id,
            name,
            category,
            color,
            style,
            season,
            imageUrl,
            wearCount: 0,
            lastWorn: null,
            favorite: false,
            createdAt: new Date().toISOString()
          };
          this.clothingItems.unshift(newItem);

          // ซิงค์เสื้อผ้าใหม่ขึ้น Firestore ถ้าผู้ใช้ล็อกอิน
          if (this.user && this.user.isFirebase) {
            addClothingItem({ ...newItem }).then(() => {
              this.showToast(`"${name}" synced to Cloud!`, "lime");
            }).catch(err => {
              console.warn("Firestore sync error:", err);
            });
          }
        }

        this.saveData(STORAGE_KEYS.CLOTHING, this.clothingItems);
        this.updateBadges();
        this.renderClosetView();
        closeAddModal();
        this.showToast(`Saved "${name}" to your closet!`, "lime");
      });
    }

    // User Profile Modal
    const modalUser = document.getElementById("modal-user-profile");
    const btnOpenUser = document.getElementById("btn-user-profile");
    const btnCloseUser = document.getElementById("btn-close-modal-user");
    const btnResetData = document.getElementById("btn-reset-seed-data");

    if (btnOpenUser) {
      btnOpenUser.addEventListener("click", () => {
        document.getElementById("modal-user-avatar").src = this.user.avatarUrl;
        document.getElementById("modal-user-name").textContent = this.user.name;
        document.getElementById("modal-user-email").textContent = this.user.email;
        modalUser.classList.add("open");
      });
    }

    if (btnCloseUser) {
      btnCloseUser.addEventListener("click", () => {
        modalUser.classList.remove("open");
      });
    }

    if (btnResetData) {
      btnResetData.addEventListener("click", () => {
        if (confirm("Reset digital closet back to initial curated demo seed data?")) {
          localStorage.clear();
          this.user = JSON.parse(JSON.stringify(SEED_USER));
          this.clothingItems = JSON.parse(JSON.stringify(SEED_CLOTHING_ITEMS));
          this.outfits = JSON.parse(JSON.stringify(SEED_OUTFITS));
          this.wearLogs = JSON.parse(JSON.stringify(SEED_WEAR_LOGS));
          this.feedback = JSON.parse(JSON.stringify(SEED_FEEDBACK));
          this.preferences = { Streetwear: 3, Minimal: 2 };
          modalUser.classList.remove("open");
          this.init();
          this.showToast("Reset to curated seed data successfully!", "lime");
        }
      });
    }
  }

  showModalAddItem() {
    const modalAdd = document.getElementById("modal-add-item");
    if (modalAdd) {
      document.getElementById("form-clothing-item").reset();
      modalAdd.classList.add("open");
    }
  }

  // Toast Notification
  showToast(message, type = "primary") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg style="width: 18px; height: 18px; flex-shrink: 0;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(20px)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // ==========================================
  // FIREBASE AUTHENTICATION & CLOUD SYNC
  // ==========================================
  initFirebaseAuth() {
    const btnGoogleLogin = document.getElementById("btn-firebase-google-login");
    const btnLogout = document.getElementById("btn-firebase-logout");
    const syncStatus = document.getElementById("firebase-sync-status");
    const modalUser = document.getElementById("modal-user-profile");

    // ฟังการเปลี่ยนแปลงสถานะ Login
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        this.user = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "Google User",
          email: firebaseUser.email,
          avatarUrl: firebaseUser.photoURL || SEED_USER.avatarUrl,
          isFirebase: true
        };

        // อัปเดต UI ให้แสดงข้อมูลผู้ใช้จริง
        this.initUserHeader();
        const modalAvatar = document.getElementById("modal-user-avatar");
        const modalName = document.getElementById("modal-user-name");
        const modalEmail = document.getElementById("modal-user-email");
        if (modalAvatar) modalAvatar.src = this.user.avatarUrl;
        if (modalName) modalName.textContent = this.user.name;
        if (modalEmail) modalEmail.textContent = this.user.email;

        if (btnGoogleLogin) btnGoogleLogin.style.display = "none";
        if (btnLogout) btnLogout.style.display = "flex";
        if (syncStatus) syncStatus.textContent = `⚡ Cloud Synced: ${firebaseUser.email}`;

        // ดึงข้อมูลเสื้อผ้าจาก Firestore ของผู้ใช้คนนี้
        try {
          const cloudItems = await fetchClothingItems(firebaseUser.uid);
          if (cloudItems && cloudItems.length > 0) {
            this.clothingItems = cloudItems;
            this.updateBadges();
            this.renderClosetView();
            this.regenerateCandidates();
            this.showToast(`Synced ${cloudItems.length} items from Firestore!`, "lime");
          }
        } catch (err) {
          console.warn("Error fetching cloud items:", err);
        }
      } else {
        // เมื่อไม่ได้ล็อกอิน
        if (btnGoogleLogin) btnGoogleLogin.style.display = "flex";
        if (btnLogout) btnLogout.style.display = "none";
        if (syncStatus) syncStatus.textContent = "⚡ Firebase Cloud: Ready";
      }
    });

    // ปุ่มกด Login ด้วย Google
    if (btnGoogleLogin) {
      btnGoogleLogin.addEventListener("click", async () => {
        try {
          btnGoogleLogin.disabled = true;
          const textSpan = document.getElementById("btn-google-login-text");
          if (textSpan) textSpan.textContent = "Signing in...";

          await loginWithGoogle();
          this.showToast("Signed in with Google successfully!", "lime");
        } catch (err) {
          console.error("Login failed:", err);
          this.showToast(`Sign in error: ${err.message || "Popup blocked"}`, "rose");
        } finally {
          btnGoogleLogin.disabled = false;
          const textSpan = document.getElementById("btn-google-login-text");
          if (textSpan) textSpan.textContent = "Sign in with Google";
        }
      });
    }

    // ปุ่มกดออกจากระบบ
    if (btnLogout) {
      btnLogout.addEventListener("click", async () => {
        try {
          await logout();
          this.user = JSON.parse(JSON.stringify(SEED_USER));
          this.clothingItems = this.loadData(STORAGE_KEYS.CLOTHING, SEED_CLOTHING_ITEMS);
          this.initUserHeader();
          this.updateBadges();
          this.renderClosetView();
          this.showToast("Signed out successfully", "secondary");
          if (modalUser) modalUser.classList.remove("open");
        } catch (err) {
          console.error("Sign out error:", err);
          this.showToast("Sign out error: " + err.message, "rose");
        }
      });
    }
  }
}

// เริ่มต้นแอปอย่างปลอดภัย
let app = null;
function initApp() {
  if (!app) {
    app = new Style4PApp();
    window.app = app;
  }
}

if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

