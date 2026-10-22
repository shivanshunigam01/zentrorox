/** ASD location master — State → District(s) → Location(s) from approved matrix. */
export type AsdState = "Bihar" | "Jharkhand";

export const STATES: AsdState[] = ["Bihar", "Jharkhand"];

export const STATE_CODES: Record<AsdState, string> = {
  Bihar: "BH",
  Jharkhand: "JH",
};

/** Approved ASD locations: district → towns/locations. */
export const ASD_LOCATION_MATRIX: Record<AsdState, Record<string, string[]>> = {
  Bihar: {
    Chapra: ["Dighwara", "Garkha", "Parsa", "Taraiya"],
    Darbhanga: ["Chhatwan", "Jale", "Kiratpur", "Manigachhi"],
    Siwan: ["Goriakothi", "Hasanpura", "Hussainganj", "Nautan", "Mairwa"],
    Katihar: ["Azamnagar", "Kajitola", "Manihari"],
    Gaya: ["Barachatti", "Gurua"],
    Motihari: ["Chiraiya", "Tetaria"],
    Samastipur: ["Musrigarari", "Sarairanjan"],
    Begusarai: ["Sahibpur Kamal"],
    Buxar: ["Sonbersa"],
    Madhepura: ["Singheswar"],
    Madhubani: ["Basopatti"],
    Nawada: ["Akbarpur"],
    Purnea: ["Jankinagar"],
  },
  Jharkhand: {
    Jamshedpur: ["Musabani", "Chowka", "Jadugoda", "Baraghora", "Patambda"],
    Bokaro: ["Katahara", "Manpur", "Tupkadih"],
    Daltangunj: ["Mahuadand", "Ramna", "Tarhasi"],
    Chatra: ["Katkamsandi", "Keredari"],
    Sahebganj: ["Bhagaiya", "Tinpahar"],
  },
};

export type ParsedLocationId = {
  state: AsdState;
  district: string;
  location: string;
};

export function getDistrictsForState(state: string): string[] {
  if (state !== "Bihar" && state !== "Jharkhand") return [];
  return Object.keys(ASD_LOCATION_MATRIX[state]).sort((a, b) => a.localeCompare(b));
}

export function getLocationsForDistrict(state: string, district: string): string[] {
  if (state !== "Bihar" && state !== "Jharkhand") return [];
  return [...(ASD_LOCATION_MATRIX[state][district] ?? [])].sort((a, b) => a.localeCompare(b));
}

export function makeLocationId(state: AsdState, district: string, location: string): string {
  return `${state}|${district}|${location}`;
}

export function parseLocationId(id: string): ParsedLocationId | undefined {
  const parts = id.split("|");
  if (parts.length !== 3) return undefined;
  const [state, district, location] = parts;
  if (state !== "Bihar" && state !== "Jharkhand") return undefined;
  if (!ASD_LOCATION_MATRIX[state][district]?.includes(location)) return undefined;
  return { state, district, location };
}

export function getLocationOptions(state: string, districts: string[]) {
  if (state !== "Bihar" && state !== "Jharkhand") return [];
  return districts.flatMap((district) =>
    getLocationsForDistrict(state, district).map((location) => ({
      id: makeLocationId(state, district, location),
      district,
      location,
      label: `${location} (${district})`,
    })),
  );
}

export function formatLocationSummary(state: string, districts: string[], locationIds: string[]): string {
  const byDistrict = new Map<string, string[]>();
  for (const id of locationIds) {
    const parsed = parseLocationId(id);
    if (!parsed) continue;
    const list = byDistrict.get(parsed.district) ?? [];
    list.push(parsed.location);
    byDistrict.set(parsed.district, list);
  }
  const code = state === "Bihar" || state === "Jharkhand" ? STATE_CODES[state] : state;
  const parts = districts
    .filter((d) => byDistrict.has(d))
    .map((d) => `${d}: ${(byDistrict.get(d) ?? []).join(", ")}`);
  return `[${code}] ${parts.join(" · ")}`;
}

export function validateLocationSelection(
  state: string,
  districts: string[],
  locationIds: string[],
): { ok: true } | { ok: false; message: string } {
  if (!state || (state !== "Bihar" && state !== "Jharkhand")) {
    return { ok: false, message: "Please select a state." };
  }
  if (!districts.length) {
    return { ok: false, message: "Select at least one district." };
  }
  const allowedDistricts = new Set(getDistrictsForState(state));
  for (const district of districts) {
    if (!allowedDistricts.has(district)) {
      return { ok: false, message: `District "${district}" is not available for ${state}.` };
    }
  }
  if (!locationIds.length) {
    return { ok: false, message: "Select at least one location." };
  }
  const districtSet = new Set(districts);
  for (const id of locationIds) {
    const parsed = parseLocationId(id);
    if (!parsed || parsed.state !== state || !districtSet.has(parsed.district)) {
      return { ok: false, message: "One or more selected locations are invalid." };
    }
  }
  return { ok: true };
}

export function resolveLocationFromQuery(raw: string | null): { state: AsdState; districts: string[]; locations: string[] } | undefined {
  if (!raw?.trim()) return undefined;
  const q = raw.trim().toLowerCase();

  for (const state of STATES) {
    for (const [district, locations] of Object.entries(ASD_LOCATION_MATRIX[state])) {
      for (const location of locations) {
        const id = makeLocationId(state, district, location);
        if (
          id.toLowerCase() === q ||
          location.toLowerCase() === q ||
          district.toLowerCase() === q ||
          `${district} ${location}`.toLowerCase() === q
        ) {
          return { state, districts: [district], locations: [id] };
        }
      }
    }
  }
  return undefined;
}

export const BUSINESS_TYPES = [
  "Two-Wheeler Dealer",
  "Auto Parts / Spares",
  "Tyre Dealer",
  "Battery Dealer",
  "Tractor / Agri Equipment",
  "EV / E-Rickshaw",
  "Petrol Pump",
  "Automobile Workshop",
  "Finance / Insurance",
  "Electronics / Retail",
  "Other Existing Business",
  "New Entrepreneur",
] as const;

export const AUTOMOTIVE_BUSINESS_TYPES = new Set<string>([
  "Two-Wheeler Dealer",
  "Auto Parts / Spares",
  "Tyre Dealer",
  "Battery Dealer",
  "Tractor / Agri Equipment",
  "EV / E-Rickshaw",
  "Automobile Workshop",
]);

export const YEARS_IN_BUSINESS = [
  "Less than 1 year",
  "1–3 years",
  "3–5 years",
  "5–10 years",
  "More than 10 years",
] as const;

export const INVESTMENT_CAPACITY = [
  "Below ₹5 Lakh",
  "₹5–10 Lakh",
  "₹10–15 Lakh",
  "₹15–25 Lakh",
  "Above ₹25 Lakh",
] as const;

export const SPACE_STATUS = [
  "Own space available",
  "Rented space available",
  "Can arrange suitable space",
  "Currently not available",
] as const;

export const SHOWROOM_SPACE = [
  "1000 sq.ft.",
  "Below 1000 sq.ft.",
  "Above 1000 sq.ft.",
  "Not sure",
] as const;

export const WORKSHOP_SPACE = [
  "1000 sq.ft.",
  "Below 1000 sq.ft.",
  "Above 1000 sq.ft.",
  "Not sure",
] as const;

export const ASD_SPACE_DEFAULTS = {
  frontage: "25 ft",
  showroomSpace: "1000 sq.ft.",
  workshopSpace: "1000 sq.ft.",
} as const;

export const FRONTAGE = [
  "25 ft",
  "20–25 ft",
  "15–20 ft",
  "10–15 ft",
  "Below 10 ft",
  "Above 25 ft",
  "Not sure",
] as const;

export const START_TIMELINE = [
  "Immediately",
  "Within 1 Month",
  "1–3 Months",
  "3–6 Months",
  "More than 6 Months",
] as const;

export const CONSENT_POLICY_VERSION = "bajaj-asd-v2";
