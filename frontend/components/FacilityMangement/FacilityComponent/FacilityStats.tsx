import { View } from "react-native";
import { Facility } from "../types/facility";
import StatCard from "@/components/StatCard";

interface FacilityStatsProps {
  facilities: Facility[];
}

const FacilityStats: React.FC<FacilityStatsProps> = ({ facilities }) => {
  const activeFacilities = facilities.filter(facility => facility.isActive).length;

  return (
    <View className="flex-row justify-between mb-6">
      <StatCard
        value={facilities.length}
        label="Total Facilities"
        style="flex-1 mr-2"
      />
      <StatCard
        value={activeFacilities}
        label="Active Facilities"
        valueColor="text-primary-300"
        style="flex-1 ml-2"
      />
    </View>
  );
};

export default FacilityStats;