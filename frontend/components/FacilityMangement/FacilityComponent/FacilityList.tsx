import { EmptyState, LoadingBox, SectionTitle } from "@/components/ReusableComponent";
import { View } from "react-native";
import { Facility } from "../types/facility";
import FacilityCard from "./FacilityCard";

interface FacilityListProps {
  facilities: Facility[];
  searchQuery: string;
  isLoading: boolean;
  onEditFacility: (facility: Facility) => void;
  onDeleteFacility: (facility: Facility) => void;
}

const FacilityList: React.FC<FacilityListProps> = ({
  facilities,
  searchQuery,
  isLoading,
  onEditFacility,
  onDeleteFacility
}) => {
  if (isLoading) {
    return <LoadingBox text="Loading facilities" />;
  }

  return (
  <> 
    <EmptyState
      isEmpty={facilities.length === 0}
      icon="water-outline"
      title="No Facilities found"
      message={
        searchQuery
          ? "Try adjusting your search"
          : "Add your first facility to get started"
      }
    />

    <View>
      <SectionTitle title="All Facilities" count={facilities.length} />
      {facilities.map((facility, index) => (
        <FacilityCard
          key={facility._id || index}
          facility={facility}
          onEdit={() => onEditFacility(facility)}
          onDelete={() => onDeleteFacility(facility)}
          isLoading={isLoading}
        />
      ))}
    </View>
     </>
  );
};

export default FacilityList;