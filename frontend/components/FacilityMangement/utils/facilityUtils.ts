import { Facility } from "../types/facility";

export const filterFacilities = (facilities: Facility[], searchQuery: string): Facility[] => {
  if (!searchQuery.trim()) return facilities;
  
  return facilities.filter((facility) =>
    facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
};