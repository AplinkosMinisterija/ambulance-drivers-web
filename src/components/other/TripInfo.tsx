import styled from 'styled-components';
import { formatTime } from '../../utils/functions';
import Icon from './Icons';

const TripInfo = ({ properties, stopsCount }: { properties: any; stopsCount?: number }) => {
  if (!properties) return <></>;
  const { startAddress, endAddress, startDate, endDate, accompanyPersonName, accompanyPersonSurName, accompanyPersonPhoneNumber } = properties;
  const formattedStartTime = formatTime(startDate);
  const formattedEndTime = formatTime(endDate);

  return (
    <>
      <Row>
        <IconContainer>
          <Circle />
          <DottedLine />
          <LocationIcon name="location" />
        </IconContainer>
        <Column>
          <InnerColumn>
            <Time>{formattedStartTime}</Time>
            <Location>{startAddress || 'Nėra nurodytas pradinis adresas'}</Location>
          </InnerColumn>
          {stopsCount ? (
            <AdditionalTrips>{`+ ${stopsCount} tarpiniai sustojimai`}</AdditionalTrips>
          ) : null}
          <InnerColumn>
            <Time>{formattedEndTime}</Time>
            <Location>{endAddress || 'Nėra nurodytas galutinis adresas'}</Location>
          </InnerColumn>
        </Column>
      </Row>

      {/* Accompanying Person Section */}
      <Title>Palydinčio asmens informacija</Title>
      <Row>
        <Column>
          <PersonInfo><strong>Vardas:</strong> {accompanyPersonName}</PersonInfo>
          <PersonInfo><strong>Pavardė:</strong> {accompanyPersonSurName}</PersonInfo>
          <PersonInfo><strong>Telefono numeris:</strong> {accompanyPersonPhoneNumber}</PersonInfo>
        </Column>
      </Row>
    </>
  );

};

export default TripInfo;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const Row = styled.div`
  display: flex;
  gap: 12px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;
`;

const InnerColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 2px;
`;

const Time = styled.div`
  font-size: 1.8rem;
  color: #1a202c;
  font-weight: bold;
  line-height: 10px;
`;

const Location = styled.div`
  font-weight: bold;
  font-size: 1.4rem;
  color: #595e66;
`;

const Circle = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 4px solid #0a196f;
  opacity: 1;
`;

const DottedLine = styled.div`
  height: calc(100% - 4em);

  border-left: 1px dashed #1a202c66;
`;

const LocationIcon = styled(Icon)`
  color: #7fb519;
  font-size: 2.3rem;
`;

const AdditionalTrips = styled.div`
  color: #0a196f;
  font-weight: 600;
  font-size: 1.4rem;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
  display: block;
`;
const PersonInfo = styled.div`
  color: #0d0d10ff;
  font-weight: 500;
  font-size: 1.4rem;
`;