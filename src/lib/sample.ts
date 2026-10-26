import { blankFacts } from "@/lib/report";
import type { Facts } from "@/lib/types";

export const SAMPLE_ENTRY =
  "https://www.zillow.com/homedetails/Sample-Rambler-SW-Tumwater-WA-98512/00000000_zpid/";

export const SAMPLE_LISTING = `Address: Sample Rambler SW, Tumwater WA
List Price: $495,000
Bedrooms: 3
Bathrooms: 2
Garage Spaces: 2
Sq Ft: 1680
Sewer: Public Sewer
Remarks: Worked example, not a live listing. Level rambler with an attached 2-car garage on public sewer in Tumwater.`;

export function sampleFacts(): Facts {
  return {
    ...blankFacts(),
    address: "Sample Rambler SW, Tumwater WA",
    listPrice: 495_000,
    beds: 3,
    baths: 2,
    garageSpaces: 2,
    garageSqft: 440,
    sewer: "public",
    sqft: 1680,
    hoaAnnual: 0,
    county: "thurston",
    within30Miles: "yes",
    levelEntry: "yes",
    ceilingClear: "yes",
    remarks: "Worked example, not a live listing.",
    sourceType: "zillow",
    sourceRef: SAMPLE_ENTRY,
    mlsNumber: "",
  };
}
