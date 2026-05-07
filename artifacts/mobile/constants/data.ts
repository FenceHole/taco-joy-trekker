export type MenuItem = {
  id: string;
  name: string;
  baseProtein: number;
  baseFiber: number;
  icon: string;
  category: string;
};

export type Modifier = {
  id: string;
  name: string;
  bonusJoy: number;
  tag: string;
  tagColor: string;
};

export type Hack = {
  title: string;
  desc: string;
  iconName: string;
  iconFamily: string;
  iconColor: string;
  bgColor: string;
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "crunchwrap",
    name: "Crunchwrap Supreme",
    baseProtein: 16,
    baseFiber: 6,
    icon: "local-dining",
    category: "Wraps",
  },
  {
    id: "bean_burrito",
    name: "Bean Burrito",
    baseProtein: 13,
    baseFiber: 11,
    icon: "lunch-dining",
    category: "Burritos",
  },
  {
    id: "cantina_bowl",
    name: "Cantina Chicken Bowl",
    baseProtein: 25,
    baseFiber: 11,
    icon: "rice-bowl",
    category: "Bowls",
  },
  {
    id: "doritos_taco",
    name: "Doritos Locos Taco",
    baseProtein: 8,
    baseFiber: 3,
    icon: "set-meal",
    category: "Tacos",
  },
  {
    id: "cheese_quesadilla",
    name: "Cheese Quesadilla",
    baseProtein: 26,
    baseFiber: 4,
    icon: "breakfast-dining",
    category: "Quesadillas",
  },
];

export const MENU_ICONS: Record<string, string> = {
  crunchwrap: "🌯",
  bean_burrito: "🌯",
  cantina_bowl: "🥗",
  doritos_taco: "🌮",
  cheese_quesadilla: "🧀",
};

export const MODIFIERS: Modifier[] = [
  {
    id: "fresco",
    name: "Fresco Style",
    bonusJoy: 15,
    tag: "Fresh!",
    tagColor: "#3B82F6",
  },
  {
    id: "sub_beans",
    name: "Sub Meat for Black Beans",
    bonusJoy: 20,
    tag: "Fiber Boost!",
    tagColor: "#10B981",
  },
  {
    id: "add_chicken",
    name: "Added Cantina Chicken",
    bonusJoy: 15,
    tag: "Protein+",
    tagColor: "#F97316",
  },
  {
    id: "treat_yoself",
    name: "Got exactly what I craved",
    bonusJoy: 25,
    tag: "Mental Health Win!",
    tagColor: "#EC4899",
  },
];

export const TACO_BELL_HACKS: Hack[] = [
  {
    title: "Fresco Style",
    desc: "Swap mayo-based sauces and cheese for fresh diced tomatoes. Cuts heavy fats and adds freshness to any item!",
    iconName: "water-drop",
    iconFamily: "MaterialIcons",
    iconColor: "#3B82F6",
    bgColor: "rgba(59,130,246,0.12)",
  },
  {
    title: "Power Up with Beans",
    desc: "Taco Bell's refried and black beans are incredible sources of fiber, which keeps you full and supports happy digestion.",
    iconName: "eco",
    iconFamily: "MaterialIcons",
    iconColor: "#10B981",
    bgColor: "rgba(16,185,129,0.12)",
  },
  {
    title: "Cantina Chicken",
    desc: "The Cantina chicken is slow-roasted and packed with lean protein. Great for muscle recovery and steady energy!",
    iconName: "bolt",
    iconFamily: "MaterialIcons",
    iconColor: "#FBBF24",
    bgColor: "rgba(251,191,36,0.12)",
  },
  {
    title: "Sauce is Life",
    desc: "Hot sauces (Mild to Diablo) have essentially zero calories. Flavor up without the guilt — stack them on everything!",
    iconName: "local-fire-department",
    iconFamily: "MaterialIcons",
    iconColor: "#F97316",
    bgColor: "rgba(249,115,22,0.12)",
  },
];
