export type CleaningType = "standard" | "deep" | "move_in_out" | "post_construction";

export type HomeCondition = "normal" | "heavy" | "extreme";

export type CleaningFrequency = "one_time" | "weekly" | "biweekly" | "monthly";

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  durationMinutes: number;
  category: "kitchen" | "interior" | "specialty";
  description: string;
  iconName: string;
}

export interface PricingRulesConfig {
  baseRate: number;
  perBedroom: number;
  perBathroom: number;
  sqftTiers: {
    maxSqft: number;
    surcharge: number;
  }[];
  typeMultipliers: Record<CleaningType, number>;
  conditionMultipliers: Record<HomeCondition, number>;
  conditionExtraHours: Record<HomeCondition, number>;
  frequencyDiscounts: Record<CleaningFrequency, number>;
  depositPercentage: number;
  hourlyRateExtraTime: number;
}

export interface PricingBreakdown {
  basePrice: number;
  bedrooms: number;
  bedroomPrice: number;
  bathrooms: number;
  bathroomPrice: number;
  squareFeet: number;
  sqftPrice: number;
  cleaningType: CleaningType;
  typeMultiplier: number;
  homeCondition: HomeCondition;
  conditionMultiplier: number;
  conditionExtraHours: number;
  addOnsTotal: number;
  addOnsSelected: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  }[];
  rawTotalBeforeDiscount: number;
  frequency: CleaningFrequency;
  frequencyDiscountPercent: number;
  discountAmount: number;
  finalTotal: number;
  depositRequired: number;
  balanceDueOnCompletion: number;
  estimatedLaborHours: number;
  calculationBasis: string;
}

export interface CleaningTeam {
  id: string;
  name: string;
  leadName: string;
  phone: string;
  color: string;
  maxDailyJobs: number;
  active: boolean;
  serviceTerritory: string;
}

export interface TimeSlot {
  id: string;
  timeRange: string;
  startTime: string;
  teamId: string;
  teamName: string;
  isAvailable: boolean;
  bufferMinutes: number;
  reasonUnavailable?: string;
}

export interface CustomerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  accessInstructions?: string;
  specialNotes?: string;
}

export interface BookingRecord {
  id: string;
  bookingReference: string;
  customer: CustomerDetails;
  serviceDate: string;
  timeSlot: string;
  assignedTeamId: string;
  assignedTeamName: string;
  pricing: PricingBreakdown;
  payment: {
    type: "deposit" | "full";
    amountPaid: number;
    balanceDue: number;
    paymentMethod: "stripe_card" | "apple_pay" | "cash_on_completion";
    stripePaymentIntentId?: string;
    paidAt: string;
    receiptUrl?: string;
  };
  smsAlertsSent: SmsNotification[];
  status: "confirmed" | "in_progress" | "completed" | "cancelled" | "rescheduled";
  createdAt: string;
}

export interface SmsNotification {
  id: string;
  bookingId: string;
  type: "CONFIRMATION" | "REMINDER_24H" | "SAME_DAY_EN_ROUTE" | "TEAM_DISPATCH" | "POST_CLEAN_SURVEY";
  recipient: "CUSTOMER" | "TEAM";
  phone: string;
  messageText: string;
  sentTimestamp: string;
  deliveryStatus: "DELIVERED" | "SENT" | "QUEUED";
}

export interface GroundedChatMessage {
  id: string;
  sender: "user" | "assistant";
  timestamp: string;
  text: string;
  groundedSources?: string[];
  suggestedAction?: {
    type: "APPLY_CONFIG_TO_WIZARD";
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    cleaningType: CleaningType;
    condition: HomeCondition;
    addOns: string[];
    frequency: CleaningFrequency;
    calculatedPrice: number;
  };
}
