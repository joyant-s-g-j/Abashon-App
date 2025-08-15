import { Text, View } from "react-native";
import { Facility } from "../types/facility";
import FacilityCard from "./FacilityCard";
import { EmptyState, LoadingBox, SectionTitle } from "@/components/ReusableComponent";

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
  return (
  <> 
    <LoadingBox isLoading={isLoading} message="Loading facilities" />

    <EmptyState
      isEmpty={facilities.length === 0}
      emoji="🏊"
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