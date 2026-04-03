import { 
  GiMeat, GiChickenLeg, GiChickenOven, GiSausage, GiSteak, 
  GiCow, GiSheep, GiPig, GiHamburger,
  GiBarbecue, GiCampfire, GiCleaver, GiFoodChain,
  GiFireBowl, GiKnifeFork, GiSaltShaker, GiDeerHead,
  GiPiggyBank, GiHotDog, GiSquid, GiCirclingFish,
  GiShrimp, GiCrab, GiBuffaloHead, GiGoat, GiCowboyBoot, GiCutDiamond
} from "react-icons/gi";

import { 
  TbMeat, TbSausage, TbBone, TbFish, TbGrill, TbFlame, 
  TbStarFilled
} from "react-icons/tb";

import { 
  LuBeef, LuDrumstick, LuFish, LuFlame, LuStar, LuGift, 
  LuTag, LuShoppingBag, LuHeart, LuLeaf, LuUtensils, LuAward, 
  LuTruck, LuShoppingCart, LuPackage, LuStore, LuTrendingUp, 
  LuShieldCheck, LuSparkles, LuClock, LuSandwich, LuPizza, LuCroissant
} from "react-icons/lu";

import { IconType } from "react-icons";

export const ICON_MAP: Record<string, IconType> = {
  // Game Icons (Great for specific Meats)
  GiMeat,
  GiSteak,
  GiChickenLeg,
  GiChickenOven,
  GiSausage,
  GiHotDog,
  GiHamburger,
  GiCow,
  GiSheep,
  GiPig,
  GiGoat,
  GiBuffaloHead,
  GiDeerHead,
  GiBarbecue,
  GiCampfire,
  GiFireBowl,
  GiCleaver,
  GiKnifeFork,
  GiSaltShaker,
  GiShrimp,
  GiCrab,
  GiSquid,
  GiCirclingFish,
  GiCutDiamond, // Wagyu/Premium
  GiFoodChain,
  
  // Tabler (Clean & Modern Meats)
  TbMeat,
  TbSausage,
  TbBone,
  TbFish,
  TbGrill,
  TbFlame,
  TbStarFilled, // Wagyu

  // Lucide (General & UI)
  LuBeef,
  LuDrumstick,
  LuFish,
  LuFlame,
  LuStar,
  LuAward,
  LuGift,
  LuTag,
  LuShoppingBag,
  LuShoppingCart,
  LuHeart,
  LuLeaf, // Organic/Halal
  LuUtensils,
  LuTruck,
  LuPackage,
  LuStore,
  LuTrendingUp,
  LuShieldCheck,
  LuSparkles,
  LuClock,
  LuSandwich,
  LuPizza,
  LuCroissant
};

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);
