import {
  CleaningFrequency,
  CleaningType,
  HomeCondition,
  PricingBreakdown,
  PricingRulesConfig
} from "./types";
import { AVAILABLE_ADDONS, DEFAULT_PRICING_RULES } from "./constants";

export interface CalculateParams {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  cleaningType: CleaningType;
  homeCondition: HomeCondition;
  addOnIds: string[];
  frequency: CleaningFrequency;
}

export function calculateCleaningPrice(
  params: CalculateParams,
  customRules?: PricingRulesConfig
): PricingBreakdown {
  const rules = customRules || DEFAULT_PRICING_RULES;

  const basePrice = rules.baseRate;
  const bedroomPrice = params.bedrooms * rules.perBedroom;
  const bathroomPrice = params.bathrooms * rules.perBathroom;

  // SqFt tier calculation
  let sqftPrice = 0;
  for (const tier of rules.sqftTiers) {
    if (params.squareFeet <= tier.maxSqft) {
      sqftPrice = tier.surcharge;
      break;
    }
  }

  // Base rooms & sqft subtotal
  const structuralBase = basePrice + bedroomPrice + bathroomPrice + sqftPrice;

  // Multipliers
  const typeMultiplier = rules.typeMultipliers[params.cleaningType] || 1.0;
  const conditionMultiplier = rules.conditionMultipliers[params.homeCondition] || 1.0;
  const conditionExtraHours = rules.conditionExtraHours[params.homeCondition] || 0;

  // Subtotal after type & condition multiplier
  const laborBaseAdjusted = structuralBase * typeMultiplier * conditionMultiplier;

  // Add-ons
  const addOnsSelected: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[] = [];
  let addOnsTotal = 0;
  let addOnMinutesTotal = 0;

  for (const addOnId of params.addOnIds) {
    const found = AVAILABLE_ADDONS.find((a) => a.id === addOnId);
    if (found) {
      addOnsSelected.push({
        id: found.id,
        name: found.name,
        price: found.price,
        durationMinutes: found.durationMinutes,
      });
      addOnsTotal += found.price;
      addOnMinutesTotal += found.durationMinutes;
    }
  }

  const rawTotalBeforeDiscount = laborBaseAdjusted + addOnsTotal;

  // Frequency Discount
  const discountRate = rules.frequencyDiscounts[params.frequency] || 0.0;
  const frequencyDiscountPercent = Math.round(discountRate * 100);
  const discountAmount = rawTotalBeforeDiscount * discountRate;
  const finalTotal = Math.round((rawTotalBeforeDiscount - discountAmount) * 100) / 100;

  // Deposit & Balance
  const depositRate = rules.depositPercentage || 0.25;
  const depositRequired = Math.round(finalTotal * depositRate * 100) / 100;
  const balanceDueOnCompletion = Math.round((finalTotal - depositRequired) * 100) / 100;

  // Labor hours estimate
  // 1.5h base + 0.4h/bed + 0.5h/bath + sqft/1000*0.5 + type extras + condition extras + addon minutes
  let laborHours = 1.5 + (params.bedrooms * 0.4) + (params.bathrooms * 0.5) + ((params.squareFeet / 1000) * 0.5);
  if (params.cleaningType === "deep") laborHours *= 1.35;
  if (params.cleaningType === "move_in_out") laborHours *= 1.5;
  if (params.cleaningType === "post_construction") laborHours *= 1.75;
  laborHours += conditionExtraHours;
  laborHours += addOnMinutesTotal / 60;
  const estimatedLaborHours = Math.round(laborHours * 10) / 10;

  // Explainability Basis String
  const basis = `(Base $${basePrice} + ${params.bedrooms} Bed${params.bedrooms > 1 ? "s" : ""} $${bedroomPrice} + ${params.bathrooms} Bath${params.bathrooms > 1 ? "s" : ""} $${bathroomPrice} + SqFt $${sqftPrice}) x ${params.cleaningType.toUpperCase()} (${typeMultiplier}x) x ${params.homeCondition.toUpperCase()} (${conditionMultiplier}x)${addOnsTotal > 0 ? ` + Add-ons $${addOnsTotal}` : ""}${discountAmount > 0 ? ` - ${params.frequency.toUpperCase()} (${frequencyDiscountPercent}%)` : ""}`;

  return {
    basePrice,
    bedrooms: params.bedrooms,
    bedroomPrice,
    bathrooms: params.bathrooms,
    bathroomPrice,
    squareFeet: params.squareFeet,
    sqftPrice,
    cleaningType: params.cleaningType,
    typeMultiplier,
    homeCondition: params.homeCondition,
    conditionMultiplier,
    conditionExtraHours,
    addOnsTotal,
    addOnsSelected,
    rawTotalBeforeDiscount: Math.round(rawTotalBeforeDiscount * 100) / 100,
    frequency: params.frequency,
    frequencyDiscountPercent,
    discountAmount: Math.round(discountAmount * 100) / 100,
    finalTotal,
    depositRequired,
    balanceDueOnCompletion,
    estimatedLaborHours,
    calculationBasis: basis,
  };
}
