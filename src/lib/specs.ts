export type SpecField = {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "boolean";
  options?: string[];
  unit?: string;
};

export const EXCAVATOR_FIELDS: SpecField[] = [
  { key: "operatingHours", label: "Operating hours", type: "number", unit: "h" },
  { key: "operatingWeight", label: "Operating weight", type: "text", unit: "kg" },
  { key: "engineManufacturer", label: "Engine manufacturer", type: "text" },
  { key: "engineModel", label: "Engine model", type: "text" },
  { key: "enginePower", label: "Engine power", type: "text", unit: "kW / hp" },
  { key: "fuelType", label: "Fuel type", type: "select", options: ["Diesel", "HVO", "Electric", "Hybrid"] },
  { key: "emissionClass", label: "Emission class", type: "select", options: ["Stage IIIA", "Stage IIIB", "Stage IV", "Stage V", "Euro 5", "Euro 6"] },
  { key: "bucketCapacity", label: "Bucket capacity", type: "text", unit: "m³" },
  { key: "maxDiggingDepth", label: "Maximum digging depth", type: "text", unit: "m" },
  { key: "maxReach", label: "Maximum reach", type: "text", unit: "m" },
  { key: "maxDiggingHeight", label: "Maximum digging height", type: "text", unit: "m" },
  { key: "hydraulicSystem", label: "Hydraulic system", type: "text" },
  { key: "hydraulicFlow", label: "Hydraulic flow", type: "text", unit: "l/min" },
  { key: "hydraulicPressure", label: "Hydraulic pressure", type: "text", unit: "bar" },
  { key: "trackWidth", label: "Track width", type: "text", unit: "mm" },
  { key: "trackCondition", label: "Track condition", type: "select", options: ["Excellent", "Good", "Fair", "Needs replacement"] },
  { key: "undercarriageCondition", label: "Undercarriage condition", type: "select", options: ["Excellent", "Good", "Fair", "Needs work"] },
  { key: "numberOfBuckets", label: "Number of buckets", type: "number" },
  { key: "quickCoupler", label: "Quick coupler", type: "select", options: ["Yes", "No", "Hydraulic", "Mechanical"] },
  { key: "attachments", label: "Attachments", type: "textarea" },
  { key: "airConditioning", label: "Air conditioning", type: "select", options: ["Yes", "No"] },
  { key: "cabin", label: "Cabin", type: "text" },
  { key: "radio", label: "Radio", type: "select", options: ["Yes", "No"] },
  { key: "additionalEquipment", label: "Additional equipment", type: "textarea" },
  { key: "serviceHistory", label: "Service history", type: "textarea" },
  { key: "lastService", label: "Last service", type: "text" },
  { key: "inspection", label: "Inspection information", type: "textarea" },
];

export const TRUCK_FIELDS: SpecField[] = [
  { key: "kilometresDriven", label: "Kilometres driven", type: "number", unit: "km" },
  { key: "firstRegistration", label: "First registration", type: "text" },
  { key: "engine", label: "Engine", type: "text" },
  { key: "enginePower", label: "Engine power", type: "text", unit: "kW / hp" },
  { key: "engineDisplacement", label: "Engine displacement", type: "text", unit: "cm³" },
  { key: "fuelType", label: "Fuel type", type: "select", options: ["Diesel", "HVO", "LNG", "CNG", "Electric"] },
  { key: "emissionClass", label: "Emission class", type: "select", options: ["Euro 3", "Euro 4", "Euro 5", "Euro 6", "Euro 6d"] },
  { key: "transmission", label: "Transmission", type: "select", options: ["Manual", "Automatic", "I-Shift", "Opticruise", "TipMatic"] },
  { key: "numberOfGears", label: "Number of gears", type: "text" },
  { key: "axles", label: "Axles", type: "text" },
  { key: "wheelConfiguration", label: "Wheel configuration", type: "select", options: ["4x2", "6x2", "6x4", "8x2", "8x4"] },
  { key: "grossVehicleWeight", label: "Gross vehicle weight", type: "text", unit: "t" },
  { key: "payload", label: "Payload", type: "text", unit: "t" },
  { key: "trailerCoupling", label: "Trailer coupling", type: "text" },
  { key: "suspension", label: "Suspension", type: "select", options: ["Air", "Leaf", "Mixed"] },
  { key: "cabinType", label: "Cabin type", type: "text" },
  { key: "sleepingCabin", label: "Sleeping cabin", type: "select", options: ["Yes", "No"] },
  { key: "airConditioning", label: "Air conditioning", type: "select", options: ["Yes", "No"] },
  { key: "pto", label: "PTO", type: "select", options: ["Yes", "No"] },
  { key: "hydraulicSystem", label: "Hydraulic system", type: "text" },
  { key: "tankCapacity", label: "Tank capacity", type: "text", unit: "l" },
  { key: "tyres", label: "Tyres", type: "text" },
  { key: "tyreCondition", label: "Tyre condition", type: "select", options: ["Excellent", "Good", "Fair", "Needs replacement"] },
  { key: "serviceHistory", label: "Service history", type: "textarea" },
  { key: "inspection", label: "Inspection information", type: "textarea" },
  { key: "previousOwners", label: "Previous owners", type: "text" },
  { key: "additionalEquipment", label: "Additional equipment", type: "textarea" },
];

export const OTHER_FIELDS: SpecField[] = [
  { key: "machineType", label: "Machine type", type: "text" },
  { key: "operatingHours", label: "Operating hours", type: "number", unit: "h" },
  { key: "operatingWeight", label: "Operating weight", type: "text" },
  { key: "engine", label: "Engine", type: "text" },
  { key: "enginePower", label: "Engine power", type: "text" },
  { key: "fuelType", label: "Fuel type", type: "select", options: ["Diesel", "Electric", "Hybrid", "Other"] },
  { key: "dimensions", label: "Dimensions", type: "text" },
  { key: "additionalEquipment", label: "Additional equipment", type: "textarea" },
  { key: "serviceHistory", label: "Service history", type: "textarea" },
  { key: "inspection", label: "Inspection information", type: "textarea" },
];

export function fieldsForCategory(category: string): SpecField[] {
  if (category === "excavator") return EXCAVATOR_FIELDS;
  if (category === "truck") return TRUCK_FIELDS;
  return OTHER_FIELDS;
}

export function specsRecord(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (v == null || v === "") continue;
    out[k] = String(v);
  }
  return out;
}
