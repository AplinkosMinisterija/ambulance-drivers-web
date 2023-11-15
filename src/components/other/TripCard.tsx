import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { device } from "../../styles";
import api from "../../utils/api";
import { getDistance, getPatients } from "../../utils/functions";
import { Patient, Trip } from "../../utils/types";
import InfoItem from "./InfoItem";
import Tag from "./Tag";
import TripInfo from "./TripInfo";

export interface FishStockingItemProps {
  trip: Trip;
  lastOfflineState?: string;
  onClick: (id: string) => void;
  disabled?: boolean;
}

const TripCard = ({
  trip,
  onClick,
  lastOfflineState,
  disabled = false
}: FishStockingItemProps) => {
  const { id, state, distance, startAddress, endAddress, direction } = trip;
  const formattedDistance = getDistance(distance);
  const currentState = lastOfflineState || state;

  const { data: tripPatients } = useQuery(
    ["tripPatients", id],
    () => api.getTripPatients(id!),
    {}
  );

  const patients = getPatients(tripPatients?.value) as Patient[];

  const getUniqueStops = () => {
    const uniqueStopsCount: any = {};

    uniqueStopsCount[startAddress!] = startAddress;
    uniqueStopsCount[endAddress] = endAddress;

    patients!?.forEach((item) => {
      uniqueStopsCount[item?.startAddress] = item.startAddress;
      uniqueStopsCount[item?.endAddress!] = item.endAddress;
    });

    return Object.keys(uniqueStopsCount).length - 2;
  };

  return (
    <Container $disabled={disabled} onClick={() => !disabled && onClick(id)}>
      <TagContainer>
        <Tag text={currentState} />
      </TagContainer>
      <IconContainer>
        <IconRow>
          <StyledText>{direction}</StyledText>
          <InfoItem icon="user" value={patients?.length! || 1} />
          <InfoItem icon="distance" value={formattedDistance} />
        </IconRow>
      </IconContainer>
      <TripInfo stopsCount={getUniqueStops()} properties={trip} />
    </Container>
  );
};

const StyledText = styled.span`
  font-size: 1.2rem;
  color: #84899f;
`;

const IconRow = styled.div`
  display: flex;
  gap: 16px;
`;

const Container = styled.a<{ $disabled: boolean }>`
  opacity: ${({ $disabled }) => ($disabled ? 0.48 : 1)};
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  background-color: #ffffff;
  border: 1px solid #0a196f29;
  border-radius: 4px;
  padding: 31px 12px 12px 12px;
  position: relative;
  @media ${device.mobileL} {
    padding-top: 40px;
  }
`;

const TagContainer = styled.div`
  position: absolute;
  top: -10px;
`;

const IconContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  @media ${device.mobileL} {
    padding-top: 10px;
  }
`;

export default TripCard;
