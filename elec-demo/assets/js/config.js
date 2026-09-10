/**
 * ============================================================================
 * SINGLE EDITABLE CONFIGURATION
 * ============================================================================
 * Edit your business information here in ONE place.
 * All phone links, WhatsApp buttons, email links, company titles, addresses,
 * and SEO schemas across the entire website will automatically update.
 * ============================================================================
 */

const CONFIG = {
  // Business Identity
  company: "YOUR BUSINESS NAME",
  tagline: "Electrical Engineering & Professional Contracting",
  engineerName: "YOUR NAME",
  engineerRole: "Electrical Engineer & Founder",

  // Contact Details
  phoneDisplay: "+91 XXXXX XXXXX",   // How your phone appears visually
  phoneHref: "+91XXXXXXXXXX",         // Used for tel: links (numbers with country code)
  whatsapp: "91XXXXXXXXXX",           // Used for https://wa.me/ links (without '+' sign)
  email: "hello@example.com",

  // Location & Service Area
  serviceArea: "YOUR CITY + nearby areas",
  address: "YOUR BUSINESS ADDRESS, CITY, STATE",
  businessHours: "Monday – Saturday: 8:00 AM – 8:00 PM | Emergency Services Available",

  // Online & Maps
  website: "https://example.com",
  googleMapsUrl: "", // Paste your Google Maps embed URL or leave empty for interactive placeholder

  // Social Media (Leave empty "" to hide icons from the footer)
  instagram: "",
  facebook: "",
  linkedin: "",
  youtube: ""
};

// Make accessible globally
if (typeof window !== "undefined") {
  window.CONFIG = CONFIG;
}
