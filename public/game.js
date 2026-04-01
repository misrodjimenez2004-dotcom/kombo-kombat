const SUPABASE_URL = "https://ogkdhbenmzrlnrvphfbp.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9na2RoYmVubXpybG5ydnBoZmJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTA1MTksImV4cCI6MjA5MDUyNjUxOX0.FyXAe_TzJXch8u9jECdI6-Aj1rFx27yYHWWIt6dkUrs";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const RARITY_STATS = {
  common:    { hp: 100, light: 8,  easy: 14, medium: 16, hard: 18 },
  rare:      { hp: 110, light: 9,  easy: 16, medium: 18, hard: 20 },
  epic:      { hp: 120, light: 10, easy: 18, medium: 20, hard: 22 },
  legendary: { hp: 130, light: 11, easy: 20, medium: 22, hard: 24 },
  mythic:    { hp: 140, light: 12, easy: 22, medium: 24, hard: 26 }
};

const MOVE_COOLDOWNS = {
  light: 300,
  easy: 450,
  medium: 650,
  hard: 850
};

const MACHINE_COST = 100;
const WIN_REWARD = 15;
const LOSS_REWARD = 5;

const DUPLICATE_REWARDS = {
  common: 35,
  rare: 60,
  epic: 100,
  legendary: 150,
  mythic: 250
};

const koSound = new Audio("assets/sounds/ko.mp3");
koSound.preload = "auto";

const MACHINE_ODDS = [
  { rarity: "common", weight: 60 },
  { rarity: "rare", weight: 25 },
  { rarity: "epic", weight: 10},
  { rarity: "legendary", weight: 4},
  { rarity: "mythic", weight: 1}
];

const INPUT_BUFFER_TIMEOUT = 1000;
const MAPS = [
  "assets/maps/void.png",
  "assets/maps/neon.png",
  "assets/maps/lava.png",
  "assets/maps/forest.png"
];

const FIGHTERS = [
  {
    id: "slime_guy",
    name: "Slime Guy",
    rarity: "common",
    code: "SG",
    image: "assets/fighters/slime_guy.png",
    moves: [
      { name: "Slime Jab", input: ["attack"], damageType: "light" },
      { name: "Goop Kick", input: ["down", "attack"], damageType: "easy" },
      { name: "Blob Bounce", input: ["left", "attack"], damageType: "easy" },
      { name: "Sludge Slam", input: ["up", "down","up", "attack"], damageType: "medium" }
    ]
  },
  {
  id: "arachnid_2099",
  name: "Arachnid 2099",
  rarity: "legendary",
  code: "A2099",
  image: "assets/fighters/arachnid_2099.png",
  moves: [
    { name: "Web Jab", input: ["attack"], damageType: "light" },
    { name: "Venom Claw", input: ["right","right","left","left", "attack"], damageType: "hard" },
    { name: "Spider Blitz", input: ["left", "right","down","down", "attack"], damageType: "hard" },
    { name: "2099 Annihilation", input: ["up", "down", "left", "right", "attack"], damageType: "hard" }
  ]
},
{
  id: "thokk",
  name: "Thøkk",
  rarity: "mythic",
  code: "TH",
  image: "assets/fighters/thokk.png",
  moves: [
    { name: "Heavy Jab", input: ["attack"], damageType: "light" },
    { name: "Armor Break", input: ["right", "attack"], damageType: "easy" },
    { name: "Crushing Step", input: ["down", "attack"], damageType: "easy" },
    { name: "Doom Cleaver", input: ["up", "down", "left","up", "attack"], damageType: "hard" }
  ]
},
{
  id: "brawler_bob",
  name: "Brawler Bob",
  rarity: "common",
  code: "BB",
  image: "assets/fighters/brawler_bob.png",
  moves: [
    { name: "Quick Jab", input: ["attack"], damageType: "light" },
    { name: "Hook Punch", input: ["right", "attack"], damageType: "easy" },
    { name: "Body Blow", input: ["down", "attack"], damageType: "easy" },
    { name: "Street Slam", input: ["left", "right","down", "attack"], damageType: "medium" }
  ]
},
  {
    id: "rocko",
    name: "Rocko",
    rarity: "common",
    code: "RO",
    image: "assets/fighters/rocko.png",
    moves: [
      { name: "Pebble Punch", input: ["attack"], damageType: "light" },
      { name: "Stone Chop", input: ["left", "attack"], damageType: "easy" },
      { name: "Boulder Bash", input: ["down", "right","up", "attack"], damageType: "medium" },
      { name: "Quake Drop", input: ["up", "down","right", "attack"], damageType: "medium" }
    ]
  },
  {
  id: "training_dummy",
  name: "Training Dummy",
  rarity: "common",
  code: "TD",
  image: "assets/fighters/training_dummy.png",
  moves: [
    { name: "Dummy Jab", input: ["attack"], damageType: "light" },
    { name: "Wrap Kick", input: ["down", "attack"], damageType: "easy" },
    { name: "Stuffing Slam", input: ["left", "right","left", "attack"], damageType: "medium" },
    { name: "Crash Test", input: ["up", "down", "left","up", "attack"], damageType: "hard" }
  ]
},
{
  id: "lunar_night",
  name: "Lunar Night",
  rarity: "epic",
  code: "LN",
  image: "assets/fighters/lunar_night.png",
  moves: [
    { name: "Moon Jab", input: ["attack"], damageType: "light" },
    { name: "Crescent Strike", input: ["right", "left","up", "attack"], damageType: "medium" },
    { name: "Nightfall Rush", input: ["up", "right","right", "attack"], damageType: "medium" },
    { name: "Lunar Judgment", input: ["up", "down", "right","down ", "attack"], damageType: "hard" }
  ]
},
{
  id: "red_rush",
  name: "Red Rush",
  rarity: "rare",
  code: "RR",
  image: "assets/fighters/red_rush.png",
  moves: [
    { name: "Flash Jab", input: ["attack"], damageType: "light" },
    { name: "Speed Blitz", input: ["left", "attack"], damageType: "easy" },
    { name: "Rushdown Combo", input: ["left", "right","right", "attack"], damageType: "medium" },
    { name: "Velocity Barrage", input: ["up", "down","left", "attack"], damageType: "medium" }
  ]
},
  {
    id: "stingster",
    name: "Stingster",
    rarity: "common",
    code: "ST",
    image: "assets/fighters/stingster.png",
    moves: [
      { name: "Sting Tap", input: ["attack"], damageType: "light" },
      { name: "Wing Jab", input: ["right", "attack"], damageType: "easy" },
      { name: "Bug Blitz", input: ["down", "attack"], damageType: "easy" },
      { name: "Venom Dive", input: ["up", "left", "down","down", "attack"], damageType: "hard" }
    ]
  },
  {
  id: "ethan_snow",
  name: "Ethan Snow",
  rarity: "epic",
  code: "ES",
  image: "assets/fighters/ethan_snow.png",
  moves: [
    { name: "Snap Shot", input: ["attack"], damageType: "light" },
    { name: "Survival Rush", input: ["down", "attack"], damageType: "easy" },
    { name: "Counter Break", input: ["left", "right","left", "attack"], damageType: "medium" },
    { name: "Last Stand", input: ["up", "down", "left","down", "attack"], damageType: "hard" }
  ]
},
{
  id: "leo_f_kennedy",
  name: "Leo F. Kennedy",
  rarity: "legendary",
  code: "LFK",
  image: "assets/fighters/leo.png",
  moves: [
    { name: "Precision Shot", input: ["attack"], damageType: "light" },
    { name: "Tactical Strike", input: ["right", "attack"], damageType: "easy" },
    { name: "Agent Combo", input: ["left", "down", "right", "attack"], damageType: "medium" },
    { name: "Execution Protocol", input: ["up", "down", "left", "right", "attack"], damageType: "hard" }
  ]
},
  {
    id: "red_bruiser",
    name: "Red Bruiser",
    rarity: "rare",
    code: "RB",
    image: "assets/fighters/red_bruiser.png",
    moves: [
      { name: "Power Jab", input: ["attack"], damageType: "light" },
      { name: "Crush Elbow", input: ["down", "attack"], damageType: "easy" },
      { name: "Breaker Swing", input: ["left", "right","left", "attack"], damageType: "medium" },
      { name: "Iron Smash", input: ["up", "down", "left","right", "attack"], damageType: "hard" }
    ]
  },
  {
  id: "james_sutherland",
  name: "James Sutherland",
  rarity: "epic",
  code: "JS",
  image: "assets/fighters/james.png",
  moves: [
    { name: "Heavy Swing", input: ["attack"], damageType: "light" },
    { name: "Angled Strike", input: ["left", "attack"], damageType: "easy" },
    { name: "Crushing Blow", input: ["down", "right","left", "attack"], damageType: "medium" },
    { name: "Burden Break", input: ["up", "down", "left","right", "attack"], damageType: "hard" }
  ]
},
{
  id: "von",
  name: "Von",
  rarity: "mythic",
  code: "VN",
  image: "assets/fighters/von.png",
  moves: [
    { name: "Quick Tap", input: ["attack"], damageType: "light" },
    { name: "Oblock Pound", input: ["right", "attack"], damageType: "easy" },
    { name: "Street Pressure", input: ["left", "right","up", "attack"], damageType: "medium" },
    { name: "No Mercy Combo", input: ["up", "right", "down", "left", "attack"], damageType: "hard" }
  ]
},
  {
    id: "volt_striker",
    name: "Volt Striker",
    rarity: "rare",
    code: "VS",
    image: "assets/fighters/volt_striker.png",
    moves: [
      { name: "Spark Strike", input: ["attack"], damageType: "light" },
      { name: "Static Snap", input: ["left","up","down", "attack"], damageType: "medium" },
      { name: "Voltage Cut", input: ["down", "right","right","down", "attack"], damageType: "hard" },
      { name: "Thunder Break", input: ["up", "left", "right","up", "attack"], damageType: "hard" }
    ]
  }
];

const SAVE_KEYS = {
  koins: "kombo_koins",
  owned: "kombo_owned_fighters"
};

let komboKoins = 500;
let ownedFighterIds = ["slime_guy", "rocko", "stingster"];
let currentMode = null;
let currentRoomCode = "";
let selectedFighter = null;
let matchOver = false;
let fightActive = false;
let playerWonLastMatch = false;
let roundResults = [];
let playerRoundsWon = 0;
let multiplayerMatchStarting = false;
let enemyRoundsWon = 0;
let currentRoundNumber = 1;
let currentMatchMap = null;
let sharedMatchStartTime = null;
let roomChannel = null;
let multiplayerSide = null; // "host" or "guest"
let remoteSelectedFighterId = null;
let localReady = false;
let remoteReady = false;
let remoteInputBuffer = [];

let playerBuffer = [];
let playerLastInputTime = 0;
let playerCooldownUntil = 0;

let aiBuffer = [];
let aiLastInputTime = 0;
let aiCooldownUntil = 0;
let aiLoopTimeout = null;

const player1 = {
  name: "Slime Guy",
  rarity: "common",
  image: "",
  currentHp: 100,
  maxHp: 100
};

const player2 = {
  name: "CPU Bruiser",
  rarity: "rare",
  image: "",
  currentHp: 110,
  maxHp: 110
};

const splashScreen = document.getElementById("splashScreen");
const menuScreen = document.getElementById("menuScreen");
const machineScreen = document.getElementById("machineScreen");
const playModeScreen = document.getElementById("playModeScreen");
const roomScreen = document.getElementById("roomScreen");
const fightersScreen = document.getElementById("fightersScreen");
const fighterSelectScreen = document.getElementById("fighterSelectScreen");
const countdownScreen = document.getElementById("countdownScreen");
const resultScreen = document.getElementById("resultScreen");
const gameScreen = document.getElementById("gameScreen");
const machineRevealOverlay = document.getElementById("machineRevealOverlay");
const machineFlash = document.getElementById("machineFlash");
const capsuleReveal = document.getElementById("capsuleReveal");
const revealCapsule = document.getElementById("revealCapsule");
const loginScreen = document.getElementById("loginScreen");
const passwordInput = document.getElementById("passwordInput");
const usernameInput = document.getElementById("usernameInput");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const authMessage = document.getElementById("authMessage");

const fighterRevealCard = document.getElementById("fighterRevealCard");
const fighterRevealThumb = document.getElementById("fighterRevealThumb");
const fighterRevealName = document.getElementById("fighterRevealName");
const fighterRevealRarity = document.getElementById("fighterRevealRarity");
const fighterRevealStatus = document.getElementById("fighterRevealStatus");
const closeRevealBtn = document.getElementById("closeRevealBtn");
const rarityKeyBtn = document.getElementById("rarityKeyBtn");
const rarityKeyModal = document.getElementById("rarityKeyModal");
const closeKeyBtn = document.getElementById("closeKeyBtn");

const allScreens = [
  splashScreen,
  loginScreen,
  menuScreen,
  machineScreen,
  playModeScreen,
  roomScreen,
  fightersScreen,
  fighterSelectScreen,
  countdownScreen,
  resultScreen,
  gameScreen
];

const playBtn = document.getElementById("playBtn");
const machineBtn = document.getElementById("machineBtn");
const fightersBtn = document.getElementById("fightersBtn");
const settingsBtn = document.getElementById("settingsBtn");
const vsAiBtn = document.getElementById("vsAiBtn");
const vsPlayerBtn = document.getElementById("vsPlayerBtn");

const createRoomBtn = document.getElementById("createRoomBtn");
const joinRoomBtn = document.getElementById("joinRoomBtn");
const hostContinueBtn = document.getElementById("hostContinueBtn");
const joinRoomContinueBtn = document.getElementById("joinRoomContinueBtn");

const roomChoiceWrap = document.getElementById("roomChoiceWrap");
const createRoomPanel = document.getElementById("createRoomPanel");
const joinRoomPanel = document.getElementById("joinRoomPanel");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const roomCodeInput = document.getElementById("roomCodeInput");

const fightersGrid = document.getElementById("fightersGrid");
const fighterSelectGrid = document.getElementById("fighterSelectGrid");
const readyUpBtn = document.getElementById("readyUpBtn");
const selectedFighterPreview = document.getElementById("selectedFighterPreview");
const selectedPreviewCard = document.getElementById("selectedPreviewCard");
const remoteFighterPreview = document.getElementById("remoteFighterPreview");
const remotePreviewCard = document.getElementById("remotePreviewCard");
const countdownText = document.getElementById("countdownText");

const fighterInspectModal = document.getElementById("fighterInspectModal");
const closeInspectBtn = document.getElementById("closeInspectBtn");
const inspectImage = document.getElementById("inspectImage");
const inspectName = document.getElementById("inspectName");
const inspectRarity = document.getElementById("inspectRarity");
const inspectHpBarFill = document.getElementById("inspectHpBarFill");
const inspectHpText = document.getElementById("inspectHpText");
const inspectMovesList = document.getElementById("inspectMovesList");

const backButtons = document.querySelectorAll(".backBtn");

const menuCurrency = document.getElementById("menuCurrency");
const machineCurrency = document.getElementById("machineCurrency");
const battleCurrency = document.getElementById("battleCurrency");
const pullMachineBtn = document.getElementById("pullMachineBtn");
const machineResultPanel = document.getElementById("machineResultPanel");
const machineResultCard = document.getElementById("machineResultCard");
const gameEl = document.getElementById("game");
const machineResultText = document.getElementById("machineResultText");

const mapLayer = document.getElementById("mapLayer");
const hitFlash = document.getElementById("hitFlash");
const damageLayer = document.getElementById("damageLayer");
const newMatchBtn = document.getElementById("newMatchBtn");
const backToMenuBtn = document.getElementById("backToMenuBtn");

const p1HealthBar = document.getElementById("p1HealthBar");
const p2HealthBar = document.getElementById("p2HealthBar");
const p1HpText = document.getElementById("p1HpText");
const p2HpText = document.getElementById("p2HpText");

const p1Name = document.getElementById("p1Name");
const p2Name = document.getElementById("p2Name");
const p1Rarity = document.getElementById("p1Rarity");
const p2Rarity = document.getElementById("p2Rarity");

const p1Sprite = document.getElementById("p1Sprite");
const p2Sprite = document.getElementById("p2Sprite");
const p1Label = document.getElementById("p1Label");
const p2Label = document.getElementById("p2Label");

const p1El = document.getElementById("p1");
const p2El = document.getElementById("p2");

const resultTitle = document.getElementById("resultTitle");
const resultReward = document.getElementById("resultReward");
const playAgainBtn = document.getElementById("playAgainBtn");
const roundTracker = document.getElementById("roundTracker");
const roundDot0 = document.getElementById("roundDot0");
const roundDot1 = document.getElementById("roundDot1");
const roundDot2 = document.getElementById("roundDot2");
const koOverlay = document.getElementById("koOverlay");
const continueBtn = document.getElementById("continueBtn");

const controlButtons = document.querySelectorAll(".controlBtn");

function loadSaveData() {
  const savedKoins = localStorage.getItem(SAVE_KEYS.koins);
  const savedOwned = localStorage.getItem(SAVE_KEYS.owned);

  if (savedKoins !== null) {
    const parsedKoins = parseInt(savedKoins, 10);
    if (!Number.isNaN(parsedKoins)) komboKoins = parsedKoins;
  }

  if (savedOwned) {
    try {
      const parsedOwned = JSON.parse(savedOwned);
      if (Array.isArray(parsedOwned) && parsedOwned.length) {
        ownedFighterIds = parsedOwned;
      }
    } catch {}
  }
}

async function saveData() {
  localStorage.setItem(SAVE_KEYS.koins, String(komboKoins));
  localStorage.setItem(SAVE_KEYS.owned, JSON.stringify(ownedFighterIds));

  const { data: authData } = await supabaseClient.auth.getUser();
  const user = authData?.user;

  if (!user) return;

  await supabaseClient
    .from("players")
    .update({
      kombo_koins: komboKoins,
      owned_fighters: ownedFighterIds
    })
    .eq("id", user.id);
}

function isOwned(fighterId) {
  return ownedFighterIds.includes(fighterId);
}

function getAllFightersWithOwnership() {
  return FIGHTERS.map(fighter => ({
    ...fighter,
    owned: isOwned(fighter.id)
  }));
}

function getOwnedFighters() {
  return getAllFightersWithOwnership().filter(fighter => fighter.owned);
}

function updateCurrencyUI() {
  const text = `Kombo Koins: ${komboKoins}`;
  menuCurrency.textContent = text;
  machineCurrency.textContent = text;
  battleCurrency.textContent = text;
}

function addKoins(amount) {
  komboKoins += amount;
  updateCurrencyUI();
  saveData();
}

function spendKoins(amount) {
  if (komboKoins < amount) return false;
  komboKoins -= amount;
  updateCurrencyUI();
  saveData();
  return true;
}

function showScreen(screenToShow) {
  allScreens.forEach((screen) => {
    screen.classList.add("hidden");
    screen.classList.remove("active");
  });

  screenToShow.classList.remove("hidden");
  screenToShow.classList.add("active");
}

function rarityBadgeClass(rarity) {
  return rarity.toLowerCase();
}

function buildFighterCardHTML(fighter, isSelected = false) {
  const owned = fighter.owned;
  return `
    <div class="fighterCardMini ${isSelected ? "selected" : ""}" data-fighter-id="${fighter.id}">
      <div class="fighterThumb ${owned ? `rarityGlow-${fighter.rarity}` : ""}">
        <img src="${fighter.image}" alt="${fighter.name}" class="fighterThumbImg ${owned ? "" : "lockedImg"}" />
      </div>
      <div class="fighterMiniName ${owned ? "" : "notFoundName"}">${fighter.name}</div>
      <div class="fighterMiniRarity ${rarityBadgeClass(fighter.rarity)}">${fighter.rarity}</div>
      <div class="fighterStatusText">${owned ? "Owned" : "Not Found"}</div>
    </div>
  `;
}

function renderFightersScreen() {
  const fighters = getAllFightersWithOwnership();

  fightersGrid.innerHTML = fighters
    .map((fighter) => buildFighterCardHTML(fighter))
    .join("");

  document.querySelectorAll("#fightersGrid .fighterCardMini").forEach((card) => {
    let lastTap = 0;

    const fighterId = card.dataset.fighterId;
    const fighter = fighters.find((f) => f.id === fighterId);

    // 📱 Mobile double tap
    card.addEventListener("touchend", (e) => {
      e.preventDefault();

      const now = Date.now();

      if (now - lastTap < 300) {
        openFighterInspect(fighter);
      }

      lastTap = now;
    }, { passive: false });

    // 💻 Desktop double click support
    card.addEventListener("click", () => {
      const now = Date.now();

      if (now - lastTap < 300) {
        openFighterInspect(fighter);
      }

      lastTap = now;
    });
  });
}

function renderFighterSelect() {
  const ownedFighters = getOwnedFighters();

  fighterSelectGrid.innerHTML = ownedFighters.map((fighter) => {
    return buildFighterCardHTML(fighter, selectedFighter?.id === fighter.id);
  }).join("");

  document.querySelectorAll("#fighterSelectGrid .fighterCardMini[data-fighter-id]").forEach((card) => {
    card.addEventListener("click", () => {
      const fighterId = card.dataset.fighterId;
      selectedFighter = getOwnedFighters().find((fighter) => fighter.id === fighterId);

      if (currentMode === "player" && roomChannel) {
  roomChannel.send({
    type: "broadcast",
    event: "fighter_select",
    payload: {
      fighterId: selectedFighter.id,
      side: multiplayerSide
    }
  });
}

      readyUpBtn.disabled = false;
      renderSelectedPreview();
      renderFighterSelect();
    });
  });
}

function renderSelectedPreview() {
  if (!selectedFighter) {
    selectedFighterPreview.classList.add("hidden");
    selectedPreviewCard.innerHTML = "";
    return;
  }

  selectedFighterPreview.classList.remove("hidden");
  selectedPreviewCard.innerHTML = `
    <div class="previewThumb rarityGlow-${selectedFighter.rarity}">
      <img src="${selectedFighter.image}" alt="${selectedFighter.name}" class="previewThumbImg" />
    </div>
    <div>
      <div class="previewInfoName">${selectedFighter.name}</div>
      <div class="previewInfoMeta">${selectedFighter.rarity.toUpperCase()} fighter</div>
    </div>
  `;
}

function renderRemoteSelectedPreview() {
  if (!remoteSelectedFighterId) {
    remoteFighterPreview.classList.add("hidden");
    remotePreviewCard.innerHTML = "";
    return;
  }

  const fighter = getFighterById(remoteSelectedFighterId);
  if (!fighter) return;

  remoteFighterPreview.classList.remove("hidden");
  remotePreviewCard.innerHTML = `
    <div class="previewThumb rarityGlow-${fighter.rarity}">
      <img src="${fighter.image}" alt="${fighter.name}" class="previewThumbImg" />
    </div>
    <div>
      <div class="previewInfoName">${fighter.name}</div>
      <div class="previewInfoMeta">${fighter.rarity.toUpperCase()} fighter</div>
    </div>
  `;
}

function resetRoomPanels() {
  roomChoiceWrap.classList.remove("hidden");
  createRoomPanel.classList.add("hidden");
  joinRoomPanel.classList.add("hidden");
  roomCodeInput.value = "";
}

function resetMachinePanel() {
  machineResultPanel.classList.add("hidden");
  machineResultCard.innerHTML = "";
  machineResultText.textContent = "";
}

function stopCombatLoops() {
  if (aiLoopTimeout) {
    clearTimeout(aiLoopTimeout);
    aiLoopTimeout = null;
  }
}

function resetCombatState() {
  matchOver = false;
  fightActive = false;
  playerWonLastMatch = false;

  playerBuffer = [];
  playerLastInputTime = 0;
  playerCooldownUntil = 0;

  aiBuffer = [];
  aiLastInputTime = 0;
  aiCooldownUntil = 0;

  stopCombatLoops();
  newMatchBtn.style.display = "none";
}

function goToMenu() {
  stopCombatLoops();
  currentMode = null;
  currentRoomCode = "";
  selectedFighter = null;
  readyUpBtn.disabled = true;
  renderSelectedPreview();
  resetRoomPanels();
  resetMachinePanel();
  updateCurrencyUI();
  showScreen(menuScreen);
}

function goToMachine() {
  resetMachinePanel();
  hideMachineReveal();
  updateCurrencyUI();
  showScreen(machineScreen);
}

function goToPlayMode() {
  resetRoomPanels();
  showScreen(playModeScreen);
}

function goToRoomFlow() {
  resetRoomPanels();
  showScreen(roomScreen);
}

function goToFighters() {
  renderFightersScreen();
  showScreen(fightersScreen);
}

function goToFighterSelect() {
  readyUpBtn.disabled = true;
  readyUpBtn.textContent = "Ready Up";
  selectedFighter = null;
  remoteSelectedFighterId = null;
  localReady = false;
  remoteReady = false;
  multiplayerMatchStarting = false;

  renderSelectedPreview();
  renderRemoteSelectedPreview();
  renderFighterSelect();
  showScreen(fighterSelectScreen);
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function chooseRandomMap() {
  chooseMatchMap();
}

function getFighterById(fighterId) {
  return FIGHTERS.find(fighter => fighter.id === fighterId);
}

function getRandomAIEnemy(excludeId) {
  const options = getOwnedFighters().filter(f => f.id !== excludeId);
  if (!options.length) return getFighterById("red_bruiser") || getOwnedFighters()[0];
  return options[Math.floor(Math.random() * options.length)];
}

function setupPlayersFromSelection() {
  const fallback = getOwnedFighters()[0];
  const chosen = selectedFighter || fallback;

  player1.name = chosen.name;
  player1.rarity = chosen.rarity;
  player1.image = chosen.image;

  let enemyFighter;

  if (currentMode === "player" && selectedFighter && remoteSelectedFighterId) {
  const enemyFighter = getFighterById(remoteSelectedFighterId);

  player1.name = selectedFighter.name;
  player1.rarity = selectedFighter.rarity;
  player1.image = selectedFighter.image;

  player2.name = enemyFighter.name;
  player2.rarity = enemyFighter.rarity;
  player2.image = enemyFighter.image;

  const p1Stats = RARITY_STATS[player1.rarity];
  const p2Stats = RARITY_STATS[player2.rarity];

  player1.maxHp = p1Stats.hp;
  player1.currentHp = p1Stats.hp;
  player2.maxHp = p2Stats.hp;
  player2.currentHp = p2Stats.hp;

  p1Name.textContent = player1.name;
  p2Name.textContent = player2.name;
  p1Label.textContent = player1.name;
  p2Label.textContent = player2.name;

  p1Rarity.textContent = player1.rarity;
  p2Rarity.textContent = player2.rarity;
  p1Rarity.className = `rarity ${player1.rarity}`;
  p2Rarity.className = `rarity ${player2.rarity}`;

  p1Sprite.className = `sprite rarityGlow-${player1.rarity}`;
  p2Sprite.className = `sprite rarityGlow-${player2.rarity}`;

  p1Sprite.innerHTML = `<img src="${player1.image}" alt="${player1.name}" class="battleSpriteImg" />`;
  p2Sprite.innerHTML = `<img src="${player2.image}" alt="${player2.name}" class="battleSpriteImg enemyFlip" />`;

  updateHealthUI();
  return;
}

  if (currentMode === "ai") {
    enemyFighter = getRandomAIEnemy(chosen.id);
  } else {
    enemyFighter = getFighterById("red_bruiser") || getOwnedFighters()[0];
  }

  player2.name = enemyFighter.name;
  player2.rarity = enemyFighter.rarity;
  player2.image = enemyFighter.image;

  const p1Stats = RARITY_STATS[player1.rarity];
  const p2Stats = RARITY_STATS[player2.rarity];

  player1.maxHp = p1Stats.hp;
  player1.currentHp = p1Stats.hp;
  player2.maxHp = p2Stats.hp;
  player2.currentHp = p2Stats.hp;

  p1Name.textContent = player1.name;
  p2Name.textContent = player2.name;
  p1Label.textContent = player1.name;
  p2Label.textContent = player2.name;

  p1Rarity.textContent = player1.rarity;
  p2Rarity.textContent = player2.rarity;
  p1Rarity.className = `rarity ${player1.rarity}`;
  p2Rarity.className = `rarity ${player2.rarity}`;

  p1Sprite.className = `sprite rarityGlow-${player1.rarity}`;
  p2Sprite.className = `sprite rarityGlow-${player2.rarity}`;

  p1Sprite.innerHTML = `<img src="${player1.image}" alt="${player1.name}" class="battleSpriteImg" />`;
  p2Sprite.innerHTML = `<img src="${player2.image}" alt="${player2.name}" class="battleSpriteImg enemyFlip" />`;

  updateHealthUI();
}

function updateHealthUI() {
  const p1Percent = (player1.currentHp / player1.maxHp) * 100;
  const p2Percent = (player2.currentHp / player2.maxHp) * 100;

  p1HealthBar.style.width = `${Math.max(0, p1Percent)}%`;
  p2HealthBar.style.width = `${Math.max(0, p2Percent)}%`;

  p1HpText.textContent = `${Math.max(0, player1.currentHp)} / ${player1.maxHp}`;
  p2HpText.textContent = `${Math.max(0, player2.currentHp)} / ${player2.maxHp}`;
}

function flashRed() {
  hitFlash.style.background = "rgba(255, 0, 0, 0.22)";
  setTimeout(() => {
    hitFlash.style.background = "rgba(255, 0, 0, 0)";
  }, 110);
}

function getRandomMap() {
  return MAPS[Math.floor(Math.random() * MAPS.length)];
}

function shakeTarget(targetEl) {
  targetEl.classList.remove("hitShake");
  void targetEl.offsetWidth;
  targetEl.classList.add("hitShake");
}

function showDamage(moveName, amount, targetSide) {
  const dmg = document.createElement("div");
  dmg.className = "damageText";
  dmg.textContent = `${moveName} (${amount})`;

  if (targetSide === "right") {
    dmg.style.right = "50px";
    dmg.style.bottom = "170px";
  } else {
    dmg.style.left = "50px";
    dmg.style.bottom = "170px";
  }

  damageLayer.appendChild(dmg);

  setTimeout(() => {
    dmg.remove();
  }, 600);
}

function getMoveFromBuffer(fighter, buffer) {
  const stats = RARITY_STATS[fighter.rarity];
  const joined = buffer.join("-");

  const sortedMoves = [...fighter.moves].sort((a, b) => b.input.length - a.input.length);

  for (let move of sortedMoves) {
    const pattern = move.input.join("-");
    if (joined.endsWith(pattern)) {
      return {
        name: move.name,
        damage: stats[move.damageType],
        type: move.damageType
      };
    }
  }

  return null;
}

function clearPlayerBuffer() {
  playerBuffer = [];
  playerLastInputTime = 0;
}

function clearAiBuffer() {
  aiBuffer = [];
  aiLastInputTime = 0;
}

function applyDamage(target, amount, moveName, targetElement, side) {
  target.currentHp -= amount;
  if (target.currentHp < 0) target.currentHp = 0;

  flashRed();
  shakeTarget(targetElement);
  showDamage(moveName, amount, side);
  updateHealthUI();

  if (target.currentHp <= 0) {
    endMatch(target === player2);
  }
}

function triggerPlayerMove(move) {
  playerCooldownUntil = Date.now() + MOVE_COOLDOWNS[move.type];
  applyDamage(player2, move.damage, move.name, p2El, "right");
  clearPlayerBuffer();
}

function triggerAiMove(move) {
  aiCooldownUntil = Date.now() + MOVE_COOLDOWNS[move.type];
  applyDamage(player1, move.damage, move.name, p1El, "left");
  clearAiBuffer();
}

function handlePlayerInput(input) {
  if (!fightActive || matchOver) return;

  const now = Date.now();

  if (now - playerLastInputTime > INPUT_BUFFER_TIMEOUT) {
    playerBuffer = [];
  }

  if (now < playerCooldownUntil) {
    return;
  }

  playerLastInputTime = now;
  playerBuffer.push(input);

  if (playerBuffer.length > 5) {
    playerBuffer.shift();
  }

  const fighterData = getOwnedFighters().find(f => f.name === player1.name);
  const move = getMoveFromBuffer(fighterData, playerBuffer);

  if (move) {
    triggerPlayerMove(move);
  }
}

function pickAiPlannedSequence(enemyData) {
  const moves = [...enemyData.moves];
  const weighted = [];

  moves.forEach(move => {
    if (move.damageType === "light") weighted.push(move, move, move);
    if (move.damageType === "easy") weighted.push(move, move);
    if (move.damageType === "medium") weighted.push(move);
    if (move.damageType === "hard") weighted.push(move);
  });

  const selected = weighted[Math.floor(Math.random() * weighted.length)];
  return selected.input;
}

function runAiCombatLoop() {
  if (!fightActive || matchOver) return;

  const enemyData = getAllFightersWithOwnership().find(f => f.name === player2.name) || getFighterById("red_bruiser");
  const now = Date.now();

  if (now - aiLastInputTime > INPUT_BUFFER_TIMEOUT) {
    aiBuffer = [];
  }

  if (now < aiCooldownUntil) {
    scheduleNextAiStep(120);
    return;
  }

  const sequence = pickAiPlannedSequence(enemyData);
  const delayBetweenInputs = 90 + Math.floor(Math.random() * 120);
  let index = 0;

  function doStep() {
    if (!fightActive || matchOver) return;

    const stepNow = Date.now();

    if (stepNow < aiCooldownUntil) {
      scheduleNextAiStep(140);
      return;
    }

    aiLastInputTime = stepNow;
    aiBuffer.push(sequence[index]);

    if (aiBuffer.length > 5) {
      aiBuffer.shift();
    }

    const move = getMoveFromBuffer(enemyData, aiBuffer);
    index += 1;

    if (move) {
      triggerAiMove(move);
      scheduleNextAiStep(280 + Math.floor(Math.random() * 550));
      return;
    }

    if (index < sequence.length) {
      aiLoopTimeout = setTimeout(doStep, delayBetweenInputs);
    } else {
      clearAiBuffer();
      scheduleNextAiStep(250 + Math.floor(Math.random() * 450));
    }
  }

  aiLoopTimeout = setTimeout(doStep, 180 + Math.floor(Math.random() * 300));
}

function scheduleNextAiStep(delay) {
  stopCombatLoops();
  aiLoopTimeout = setTimeout(runAiCombatLoop, delay);
}

function showMatchReward(won) {
  resultTitle.textContent = won ? "You Won" : "You Lost";
  resultReward.textContent = won ? `+${WIN_REWARD} Kombo Koins` : `+${LOSS_REWARD} Kombo Koins`;
}

async function endMatch(playerWonRound) {
  matchOver = true;
  fightActive = false;
  stopCombatLoops();

  await showKO();

  if (playerWonRound) {
    playerRoundsWon += 1;
    roundResults.push("player");
  } else {
    enemyRoundsWon += 1;
    roundResults.push("enemy");
  }

  updateRoundTrackerUI();

  const playerWonMatch = playerRoundsWon >= 2;
  const enemyWonMatch = enemyRoundsWon >= 2;

  if (playerWonMatch || enemyWonMatch) {
    const reward = playerWonMatch ? WIN_REWARD : LOSS_REWARD;
    addKoins(reward);
    showMatchReward(playerWonMatch);

    setTimeout(() => {
      showScreen(resultScreen);
    }, 400);

    return;
  }

  currentRoundNumber += 1;
  await runCountdownAndStart(false);
}

function resetRoundTrackerUI() {
  [roundDot0, roundDot1, roundDot2].forEach((dot) => {
    dot.classList.remove("playerWin", "enemyWin");
  });
}

function updateRoundTrackerUI() {
  const dots = [roundDot0, roundDot1, roundDot2];

  dots.forEach((dot, index) => {
    dot.classList.remove("playerWin", "enemyWin");

    if (roundResults[index] === "player") {
      dot.classList.add("playerWin");
    } else if (roundResults[index] === "enemy") {
      dot.classList.add("enemyWin");
    }
  });
}

function resetMatchRounds() {
  roundResults = [];
  playerRoundsWon = 0;
  enemyRoundsWon = 0;
  currentRoundNumber = 1;
  resetRoundTrackerUI();
}

function playKoSound() {
  if (!koSound) return;

  try {
    koSound.pause();
    koSound.currentTime = 0;

    const playPromise = koSound.play();

    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.log("KO sound failed:", err);
      });
    }
  } catch (err) {
    console.log("KO sound error:", err);
  }
}

async function showKO() {
  koOverlay.classList.remove("hidden");

  if (gameEl) {
    gameEl.classList.remove("koShake");
    void gameEl.offsetWidth;
    gameEl.classList.add("koShake");
  }

  try {
    koSound.pause();
    koSound.currentTime = 0;

    await koSound.play();

    await new Promise((resolve) => {
      koSound.onended = resolve;
    });
  } catch (err) {
    console.log("KO sound error:", err);
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }

  if (gameEl) {
    gameEl.classList.remove("koShake");
  }

  koOverlay.classList.add("hidden");
}

function resetRoundHpOnly() {
  const p1Stats = RARITY_STATS[player1.rarity];
  const p2Stats = RARITY_STATS[player2.rarity];

  player1.maxHp = p1Stats.hp;
  player1.currentHp = p1Stats.hp;
  player2.maxHp = p2Stats.hp;
  player2.currentHp = p2Stats.hp;

  playerBuffer = [];
  playerLastInputTime = 0;
  playerCooldownUntil = 0;

  aiBuffer = [];
  aiLastInputTime = 0;
  aiCooldownUntil = 0;

  updateHealthUI();
}

function chooseMatchMap() {
  currentMatchMap = getRandomMap();
  mapLayer.style.backgroundImage = `url("${currentMatchMap}")`;
}

function applyCurrentMatchMap() {
  if (currentMatchMap) {
    mapLayer.style.backgroundImage = `url("${currentMatchMap}")`;
  }
}

function prepareMatch(isNewMatch = true) {
  resetCombatState();

  if (isNewMatch) {
  resetMatchRounds();

  if (currentMode === "player") {
    applyCurrentMatchMap();
  } else {
    chooseMatchMap();
  }

  setupPlayersFromSelection();
} else {
  resetRoundHpOnly();
  applyCurrentMatchMap();
}
}

async function runCountdownAndStart(isNewMatch = true, forcedStartTime = null) {
  prepareMatch(isNewMatch);

  if (currentMatchMap) {
    mapLayer.style.backgroundImage = `url("${currentMatchMap}")`;
  }

  showScreen(countdownScreen);

  if (forcedStartTime) {
    while (Date.now() < forcedStartTime - 3000) {
      countdownText.textContent = "";
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    countdownText.textContent = "3";
    while (Date.now() < forcedStartTime - 2000) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    countdownText.textContent = "2";
    while (Date.now() < forcedStartTime - 1000) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    countdownText.textContent = "1";
    while (Date.now() < forcedStartTime) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    countdownText.textContent = "FIGHT";
    await new Promise((resolve) => setTimeout(resolve, 500));
  } else {
    const sequence = ["3", "2", "1", "FIGHT"];
    for (const item of sequence) {
      countdownText.textContent = item;
      await new Promise((resolve) => setTimeout(resolve, item === "FIGHT" ? 700 : 600));
    }
  }

  showScreen(gameScreen);
  updateCurrencyUI();
  fightActive = true;

  if (currentMode === "ai") {
    scheduleNextAiStep(650);
  }
}

function pullMachineRarity() {
  const totalWeight = MACHINE_ODDS.reduce((sum, item) => sum + item.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const item of MACHINE_ODDS) {
    if (roll < item.weight) return item.rarity;
    roll -= item.weight;
  }

  return "common";
}

function getRandomFighterFromRarity(rarity) {
  const pool = FIGHTERS.filter(fighter => fighter.rarity === rarity);
  return pool[Math.floor(Math.random() * pool.length)];
}

function renderMachineResult(fighter, wasDuplicate, payout = 0) {
  machineResultPanel.classList.remove("hidden");
  machineResultCard.innerHTML = `
    <div class="machineResultThumb rarityGlow-${fighter.rarity}">
      <img src="${fighter.image}" alt="${fighter.name}" class="previewThumbImg" />
    </div>
    <div>
      <div class="machineResultInfoName">${fighter.name}</div>
      <div class="machineResultInfoMeta">${fighter.rarity.toUpperCase()} fighter</div>
    </div>
  `;

  machineResultText.textContent = wasDuplicate
    ? `Duplicate found. +${payout} Kombo Koins`
    : `New fighter unlocked!`;
}

function hideMachineReveal() {
  machineRevealOverlay.classList.add("hidden");
  capsuleReveal.classList.add("hidden");
  fighterRevealCard.classList.add("hidden");
  machineFlash.classList.remove("active");
}

function showCapsuleReveal() {
  machineRevealOverlay.classList.remove("hidden");
  capsuleReveal.classList.remove("hidden");
  fighterRevealCard.classList.add("hidden");
}

function showFighterReveal(fighter, wasDuplicate, payout = 0) {
  fighterRevealThumb.innerHTML = `
    <img src="${fighter.image}" alt="${fighter.name}" />
  `;
  fighterRevealName.textContent = fighter.name;
  fighterRevealRarity.textContent = fighter.rarity;
  fighterRevealRarity.className = `fighterRevealRarity ${fighter.rarity}`;
  fighterRevealStatus.textContent = wasDuplicate
    ? `Duplicate Found! +${payout} Kombo Koins`
    : "New Fighter Unlocked!";

  capsuleReveal.classList.add("hidden");
  fighterRevealCard.classList.remove("hidden");
}

async function runMachinePull() {
  if (!spendKoins(MACHINE_COST)) {
    alert("Not enough Kombo Koins.");
    return;
  }

  showCapsuleReveal();

  const machineImg = document.querySelector(".machineImage");
  if (machineImg) {
    machineImg.classList.add("machineShake");
    setTimeout(() => {
      machineImg.classList.remove("machineShake");
    }, 400);
  }

  revealCapsule.classList.remove("shake");
  void revealCapsule.offsetWidth;
  revealCapsule.classList.add("shake");

  await new Promise(resolve => setTimeout(resolve, 700));

  machineFlash.classList.add("active");

  const rarity = pullMachineRarity();
  const fighter = getRandomFighterFromRarity(rarity);
  const alreadyOwned = isOwned(fighter.id);

  let payout = 0;

  if (alreadyOwned) {
    payout = DUPLICATE_REWARDS[fighter.rarity];
    addKoins(payout);
  } else {
    ownedFighterIds.push(fighter.id);
    saveData();
  }

  updateCurrencyUI();
  renderFightersScreen();
  renderFighterSelect();

  await new Promise(resolve => setTimeout(resolve, 250));

  showFighterReveal(fighter, alreadyOwned, payout);
}

function showPlaceholder(label) {
  alert(`${label} screen coming soon`);
}

function handleBackRoute(route) {
  if (route === "menu") {
    goToMenu();
  } else if (route === "playmode") {
    goToPlayMode();
  } else if (route === "modeflow") {
    if (currentMode === "ai") {
      goToPlayMode();
    } else {
      goToRoomFlow();
    }
  }
}

playBtn.addEventListener("click", goToPlayMode);
machineBtn.addEventListener("click", goToMachine);
fightersBtn.addEventListener("click", goToFighters);
settingsBtn.addEventListener("click", () => showPlaceholder("Settings"));

pullMachineBtn.addEventListener("click", runMachinePull);

vsAiBtn.addEventListener("click", () => {
  currentMode = "ai";
  goToFighterSelect();
});

playAgainBtn.addEventListener("click", async () => {
  await runCountdownAndStart(true);
});

newMatchBtn.addEventListener("click", async () => {
  await runCountdownAndStart(true);
});

rarityKeyBtn.addEventListener("click", () => {
  rarityKeyModal.classList.remove("hidden");
});

signupBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    authMessage.textContent = "Enter username and password.";
    return;
  }

  authMessage.textContent = "Creating account...";

  const email = usernameToEmail(username);

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if (error) {
    authMessage.textContent = error.message;
    return;
  }

  const user = data.user;
  if (!user) {
    authMessage.textContent = "Could not create account.";
    return;
  }

  const { error: insertError } = await supabaseClient
    .from("players")
    .insert({
      id: user.id,
      username: username,
      kombo_koins: 1000,
      owned_fighters: ["slime_guy", "rocko", "stingster"]
    });

  if (insertError) {
    authMessage.textContent = insertError.message;
    return;
  }

  komboKoins = 1000;
  ownedFighterIds = ["slime_guy", "rocko", "stingster"];
  updateCurrencyUI();
  renderFightersScreen();
  renderFighterSelect();

  authMessage.textContent = "";
  showScreen(menuScreen);
});

loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!username || !password) {
    authMessage.textContent = "Enter username and password.";
    return;
  }

  authMessage.textContent = "Logging in...";

  const email = usernameToEmail(username);

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMessage.textContent = error.message;
    return;
  }

  const user = data.user;
  if (!user) {
    authMessage.textContent = "Could not log in.";
    return;
  }

  const { data: profile, error: profileError } = await supabaseClient
    .from("players")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    authMessage.textContent = profileError.message;
    return;
  }

  komboKoins = profile.kombo_koins ?? 500;
  ownedFighterIds = Array.isArray(profile.owned_fighters)
    ? profile.owned_fighters
    : ["slime_guy", "rocko", "stingster"];

  updateCurrencyUI();
  renderFightersScreen();
  renderFighterSelect();

  authMessage.textContent = "";
  showScreen(menuScreen);
});

closeKeyBtn.addEventListener("click", () => {
  rarityKeyModal.classList.add("hidden");
});

continueBtn.addEventListener("click", () => {
  goToMenu();
});

closeRevealBtn.addEventListener("click", () => {
  hideMachineReveal();
});

closeInspectBtn.addEventListener("click", closeFighterInspect);

vsPlayerBtn.addEventListener("click", () => {
  currentMode = "player";
  goToRoomFlow();
});

createRoomBtn.addEventListener("click", async () => {
  const user = await requireLoggedInUser();
  if (!user) return;

  currentRoomCode = generateRoomCode();
  roomCodeDisplay.textContent = currentRoomCode;

  const ok = await connectToRoom(currentRoomCode, "host");
  if (!ok) return;

  roomChoiceWrap.classList.add("hidden");
  createRoomPanel.classList.remove("hidden");
  joinRoomPanel.classList.add("hidden");
});

joinRoomBtn.addEventListener("click", () => {
  roomChoiceWrap.classList.add("hidden");
  joinRoomPanel.classList.remove("hidden");
  createRoomPanel.classList.add("hidden");
  roomCodeInput.focus();
});

hostContinueBtn.addEventListener("click", () => {
  goToFighterSelect();
});

joinRoomContinueBtn.addEventListener("click", async () => {
  const user = await requireLoggedInUser();
  if (!user) return;

  const code = roomCodeInput.value.trim().toUpperCase();
  if (!code) {
    alert("Enter a room code first.");
    return;
  }

  const ok = await connectToRoom(code, "guest");
  if (!ok) return;

  currentRoomCode = code;
  goToFighterSelect();
});

readyUpBtn.addEventListener("click", async () => {
  if (!selectedFighter) return;

  if (currentMode === "player") {
    localReady = true;
    readyUpBtn.disabled = true;
    readyUpBtn.textContent = "Waiting for Opponent...";

    if (roomChannel) {
      await roomChannel.send({
        type: "broadcast",
        event: "player_ready",
        payload: {
          side: multiplayerSide,
          fighterId: selectedFighter.id
        }
      });
    }

    if (
      localReady &&
      remoteReady &&
      multiplayerSide === "host" &&
      roomChannel &&
      selectedFighter &&
      remoteSelectedFighterId
    ) {
      const startAt = Date.now() + 4000;
      const chosenMap = getRandomMap();

      await roomChannel.send({
       type: "broadcast",
       event: "start_match",
       payload: {
       hostFighterId: selectedFighter.id,
       guestFighterId: remoteSelectedFighterId,
       map: chosenMap,
       startAt
  }
});

     currentMatchMap = chosenMap;
     sharedMatchStartTime = startAt;

    await startMultiplayerMatch(remoteSelectedFighterId, startAt, chosenMap);
    }

    return;
  }

  await runCountdownAndStart(true);
});

backToMenuBtn.addEventListener("click", goToMenu);

backButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    handleBackRoute(btn.dataset.back);
  });
});

controlButtons.forEach((btn) => {
  const press = () => {
  btn.classList.add("pressed");
  const input = btn.dataset.input;
  handlePlayerInput(input);

  if (currentMode === "player") {
    sendMultiplayerInput(input);
  }
};

  const release = () => {
    btn.classList.remove("pressed");
  };

  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    press();
  }, { passive: false });

  btn.addEventListener("touchend", release);
  btn.addEventListener("touchcancel", release);

  btn.addEventListener("mousedown", press);
  btn.addEventListener("mouseup", release);
  btn.addEventListener("mouseleave", release);
});

async function goFromSplash() {
  try {
    const { data, error } = await supabaseClient.auth.getUser();

    if (error) {
      console.log("getUser error:", error);
      showScreen(loginScreen);
      return;
    }

    if (data?.user) {
      const { data: profile, error: profileError } = await supabaseClient
        .from("players")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (!profileError && profile) {
        komboKoins = profile.kombo_koins ?? 500;
        ownedFighterIds = Array.isArray(profile.owned_fighters)
          ? profile.owned_fighters
          : ["slime_guy", "rocko", "stingster"];

        updateCurrencyUI();
        renderFightersScreen();
        renderFighterSelect();
        showScreen(menuScreen);
        return;
      }
    }

    showScreen(loginScreen);
  } catch (err) {
    console.log("Splash error:", err);
    showScreen(loginScreen);
  }
}

splashScreen.addEventListener("click", goFromSplash);
splashScreen.addEventListener("touchstart", goFromSplash, { passive: true });

loadSaveData();
updateCurrencyUI();
renderFightersScreen();
renderFighterSelect();
showScreen(splashScreen);

function isStandaloneApp() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

if (isStandaloneApp()) {
  document.body.classList.add("standalone-app");
}

function openFighterInspect(fighter) {
  const stats = RARITY_STATS[fighter.rarity];

  inspectImage.src = fighter.image;
  inspectName.textContent = fighter.name;
  inspectRarity.textContent = fighter.rarity;

  inspectHpBarFill.style.width = "100%";
  inspectHpText.textContent = stats.hp + " HP";

  inspectMovesList.innerHTML = fighter.moves.map(move => {
    const label =
      move.damageType === "light" ? "L" :
      move.damageType === "easy" ? "E" :
      move.damageType === "medium" ? "M" : "H";

    const combo = move.input.map(i => {
      if (i === "up") return "↑";
      if (i === "down") return "↓";
      if (i === "left") return "←";
      if (i === "right") return "→";
      if (i === "attack") return "●";
    }).join(" ");

    return `<div>${move.name} (${label}) = ${combo}</div>`;
  }).join("");

  fighterInspectModal.classList.remove("hidden");
}

function closeFighterInspect() {
  fighterInspectModal.classList.add("hidden");
}

let lastTouchEnd = 0;

document.addEventListener("touchend", (e) => {
  const now = Date.now();

  if (now - lastTouchEnd <= 300) {
    e.preventDefault();
  }

  lastTouchEnd = now;
}, { passive: false });

function usernameToEmail(username) {
  const safe = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");
  return `${safe}@kombokombat.invalid`;
}

async function startMultiplayerMatch(enemyFighterId = null, startAt = null, map = null) {
  if (multiplayerMatchStarting) return;
  if (!selectedFighter) return;

  const finalEnemyId = enemyFighterId || remoteSelectedFighterId;
  if (!finalEnemyId) return;

  multiplayerMatchStarting = true;
  readyUpBtn.textContent = "Ready Up";

  const enemy = getFighterById(finalEnemyId);
  if (!enemy) {
    multiplayerMatchStarting = false;
    return;
  }

  player1.name = selectedFighter.name;
  player1.rarity = selectedFighter.rarity;
  player1.image = selectedFighter.image;

  player2.name = enemy.name;
  player2.rarity = enemy.rarity;
  player2.image = enemy.image;

  if (map) {
    currentMatchMap = map;
  }

  if (startAt) {
    sharedMatchStartTime = startAt;
  }

  await runCountdownAndStart(true, sharedMatchStartTime);
}

async function connectToRoom(roomCode, side) {
  multiplayerSide = side;

  if (roomChannel) {
    await supabaseClient.removeChannel(roomChannel);
    roomChannel = null;
  }

  roomChannel = supabaseClient.channel(`room:${roomCode}`, {
    config: {
      broadcast: { self: false },
      presence: { key: `${side}-${Math.random().toString(36).slice(2, 8)}` }
    }
  });

  roomChannel
    .on("broadcast", { event: "player_input" }, ({ payload }) => {
      if (!fightActive || matchOver) return;

      if (payload.side !== multiplayerSide) {
        handleRemotePlayerInput(payload.input);
      }
    })
    .on("broadcast", { event: "fighter_select" }, ({ payload }) => {
      if (payload.side !== multiplayerSide) {
        remoteSelectedFighterId = payload.fighterId;
        renderRemoteSelectedPreview();
      }
    })
    .on("broadcast", { event: "player_ready" }, async ({ payload }) => {
      if (payload.side !== multiplayerSide) {
        remoteReady = true;

        if (payload.fighterId) {
          remoteSelectedFighterId = payload.fighterId;
          renderRemoteSelectedPreview();
        }
      }

      if (
        multiplayerSide === "host" &&
        localReady &&
        remoteReady &&
        selectedFighter &&
        remoteSelectedFighterId &&
        roomChannel
      ) {
        await roomChannel.send({
          type: "broadcast",
          event: "start_match",
          payload: {
            hostFighterId: selectedFighter.id,
            guestFighterId: remoteSelectedFighterId
          }
        });

        await startMultiplayerMatch(remoteSelectedFighterId);
      }
    })
    .on("broadcast", { event: "start_match" }, async ({ payload }) => {
  if (multiplayerMatchStarting) return;
  if (!selectedFighter) return;

  if (multiplayerSide === "host") {
    remoteSelectedFighterId = payload.guestFighterId;
  } else {
    remoteSelectedFighterId = payload.hostFighterId;
  }

  currentMatchMap = payload.map;
  sharedMatchStartTime = payload.startAt;

  renderRemoteSelectedPreview();
  await startMultiplayerMatch(remoteSelectedFighterId, payload.startAt, payload.map);
})
    .on("presence", { event: "sync" }, () => {
      const state = roomChannel.presenceState();
      console.log("Presence sync:", state);
    });

  const subscribed = await new Promise((resolve) => {
    roomChannel.subscribe((status) => {
      console.log("Room subscribe status:", status);

      if (status === "SUBSCRIBED") {
        resolve(true);
      }

      if (
        status === "CHANNEL_ERROR" ||
        status === "TIMED_OUT" ||
        status === "CLOSED"
      ) {
        resolve(false);
      }
    });
  });

  if (!subscribed) {
    alert("Failed to join room.");
    return false;
  }

  await roomChannel.track({
    side,
    roomCode
  });

  return true;
}

async function sendMultiplayerInput(input) {
  if (!roomChannel || currentMode !== "player") return;

  await roomChannel.send({
    type: "broadcast",
    event: "player_input",
    payload: {
      input,
      side: multiplayerSide,
      time: Date.now()
    }
  });
}

function handleRemotePlayerInput(input) {
  if (!fightActive || matchOver) return;

  const now = Date.now();

  if (now - aiLastInputTime > INPUT_BUFFER_TIMEOUT) {
    aiBuffer = [];
  }

  if (now < aiCooldownUntil) {
    return;
  }

  aiLastInputTime = now;
  aiBuffer.push(input);

  if (aiBuffer.length > 5) {
    aiBuffer.shift();
  }

  const enemyData =
    getAllFightersWithOwnership().find(f => f.name === player2.name) ||
    getFighterById("red_bruiser");

  const move = getMoveFromBuffer(enemyData, aiBuffer);

  if (move) {
    triggerAiMove(move);
  }
}

async function requireLoggedInUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error || !data?.user) {
    alert("You need to log in before playing multiplayer.");
    showScreen(loginScreen);
    return null;
  }

  return data.user;
}