import { BookingRecord, SmsNotification } from "./types";
import { formatCurrency } from "./utils";

export function generateBookingSmsAlerts(booking: BookingRecord): SmsNotification[] {
  const timestamp = new Date().toISOString();

  const customerConfirmation: SmsNotification = {
    id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
    bookingId: booking.id,
    type: "CONFIRMATION",
    recipient: "CUSTOMER",
    phone: booking.customer.phone,
    messageText: `[NassauClean AI] Confirmed! Hi ${booking.customer.firstName}, your ${booking.pricing.cleaningType.toUpperCase()} cleaning is booked for ${booking.serviceDate} (${booking.timeSlot}) at ${booking.customer.streetAddress}, ${booking.customer.city}. Assigned: ${booking.assignedTeamName}. Deposit paid: ${formatCurrency(booking.payment.amountPaid)}. Balance on completion: ${formatCurrency(booking.payment.balanceDue)}. Need changes? Reply RESCHEDULE or call (516) 555-CLEAN.`,
    sentTimestamp: timestamp,
    deliveryStatus: "DELIVERED",
  };

  const teamDispatch: SmsNotification = {
    id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
    bookingId: booking.id,
    type: "TEAM_DISPATCH",
    recipient: "TEAM",
    phone: "(516) 555-0142",
    messageText: `[TEAM DISPATCH] New Job: ${booking.serviceDate} (${booking.timeSlot}). Customer: ${booking.customer.firstName} ${booking.customer.lastName} (${booking.customer.phone}). Location: ${booking.customer.streetAddress}, ${booking.customer.city}. Scope: ${booking.pricing.bedrooms}B/${booking.pricing.bathrooms}BA ${booking.pricing.cleaningType} (${booking.pricing.homeCondition} condition). Add-ons: ${booking.pricing.addOnsSelected.map(a => a.name).join(", ") || "None"}. Entry: ${booking.customer.accessInstructions || "Ring doorbell"}. Est time: ${booking.pricing.estimatedLaborHours} hrs.`,
    sentTimestamp: timestamp,
    deliveryStatus: "DELIVERED",
  };

  const reminder24h: SmsNotification = {
    id: `SMS-${Math.floor(10000 + Math.random() * 90000)}`,
    bookingId: booking.id,
    type: "REMINDER_24H",
    recipient: "CUSTOMER",
    phone: booking.customer.phone,
    messageText: `[NassauClean AI] Reminder: Your cleaning in ${booking.customer.city} is scheduled tomorrow at ${booking.timeSlot}. Please secure pets and ensure entry access. Reply 1 to Confirm or call us.`,
    sentTimestamp: timestamp,
    deliveryStatus: "QUEUED",
  };

  return [customerConfirmation, teamDispatch, reminder24h];
}
