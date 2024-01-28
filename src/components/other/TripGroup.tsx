import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { slugs } from '../../App';
import { device } from '../../styles';
import api, { getMapUrl } from '../../utils/api';
import { stateTypes } from '../../utils/constants';
import { formatTime, handleGetCurrentLocation, updateState } from '../../utils/functions';
import { multiTripPluralButtonLabels, multiTripSingularButtonLabels } from '../../utils/texts';
import { Patient } from '../../utils/types';
import Button from '../buttons/Button';
import Icon from './Icons';
import Modal from './Modal';
import PatientCard from './PatientCard';

const buttonTextPlural = {
  [stateTypes.approved]: multiTripPluralButtonLabels.start,
  [stateTypes.tripStart]: 'Atvykau i tikslą',
  [stateTypes.tripEnd]: multiTripPluralButtonLabels.tripEnd,
};

const buttonTextSingular = {
  [stateTypes.approved]: multiTripSingularButtonLabels.start,
  [stateTypes.tripStart]: 'Atvykau i tikslą',
  [stateTypes.tripEnd]: multiTripSingularButtonLabels.tripEnd,
};

const updateStates = {
  [stateTypes.approved]: stateTypes.start,
  [stateTypes.tripStart]: stateTypes.tripEnd,
  [stateTypes.tripEnd]: stateTypes.end,
};

const TripGroup = ({
  address,
  time,
  coordinates,
  disabled,
  isLast = false,
  group,
}: {
  address: string;
  disabled: boolean;
  group: Patient[];
  time: any;
  coordinates: any;
  isLast?: boolean;
}) => {
  const navigate = useNavigate();
  const [showNumbers, setShowNumbers] = useState(false);

  const formattedTime = formatTime(time);
  const { id } = useParams();
  const queryClient = useQueryClient();

  const isOnePatient = group?.length === 1;

  const updatePatientTrip = useMutation((values: any) => api.updatePatientTrip(values), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['tripPatients', id]);
    },
  });

  const onButtonClick = async (updateStateType: string) => {
    await Promise.all(
      group.map(async (item) => {
        await updateState(updatePatientTrip.mutateAsync, updateStateType, {
          pavezejimo_elementas: item.id,
        });
      }),
    );
  };

  const getTripUrl = async () => {
    if (disabled) return;

    const res = await handleGetCurrentLocation();
    if (!res) return;
    const { lat, lng } = res;

    const url = getMapUrl(`${lat},${lng}`, coordinates);
    //@ts-ignore
    window.location = url;
  };

  const showPatientList = () => {
    return group.some((item) => {
      return [stateTypes.start].includes(item.state);
    });
  };

  const getState = () => {
    if (group.every((item) => [stateTypes.approved].includes(item.state)))
      return stateTypes.approved;

    if (group.every((item) => [stateTypes.tripStart, stateTypes.decline].includes(item.state)))
      return stateTypes.tripStart;

    if (group.every((item) => [stateTypes.tripEnd, stateTypes.decline].includes(item.state)))
      return stateTypes.tripEnd;

    return '';
  };

  const state = getState();

  return (
    <>
      <Row disabled={disabled}>
        <InnerRow isLast={isLast}>
          <DirectionLine>{!isLast ? <Circle /> : <LocationIcon name="location" />}</DirectionLine>

          <Column2>
            <ColumnRow>
              <Column>
                <InnerColumn>
                  <Time>{formattedTime}</Time>
                  <Location>{address}</Location>
                </InnerColumn>
              </Column>
              <Column3>
                <IconContainer
                  onClick={() => {
                    setShowNumbers(true);
                  }}
                >
                  <StyledIcon name="phone" />
                </IconContainer>
                <IconContainer onClick={getTripUrl}>
                  <StyledIcon name="map" />
                </IconContainer>
              </Column3>
            </ColumnRow>
            {!disabled &&
              showPatientList() &&
              group?.map((item) => {
                return (
                  <PatientCard
                    state={item.state}
                    name={item?.fullName}
                    onClick={() => navigate(slugs.patient(item?.id))}
                  />
                );
              })}

            {!disabled && state && (
              <Button
                loading={updatePatientTrip.isLoading}
                disabled={updatePatientTrip.isLoading}
                onClick={() => onButtonClick(updateStates[state])}
              >
                {isOnePatient ? buttonTextSingular[state] : buttonTextPlural[state]}
              </Button>
            )}
          </Column2>
        </InnerRow>
      </Row>
      <Modal onClose={() => setShowNumbers(false)} visible={showNumbers}>
        <ModalContainer>
          <Title>Skambinti pacientui</Title>
          {group?.map((item) => {
            return (
              <PatientContainer>
                <PatientCard
                  state={''}
                  name={item?.fullName}
                  onClick={() => {
                    //@ts-ignore
                    window.location = `tel:+${item.phone}`;
                  }}
                />
              </PatientContainer>
            );
          })}
        </ModalContainer>
      </Modal>
    </>
  );
};

export default TripGroup;

const ModalContainer = styled.div`
  margin: 16px;
  background-color: white;
  box-shadow: 0px 18px 41px #121a5529;
  border-radius: 10px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
  align-items: center;
  position: relative;
  @media ${device.mobileL} {
    padding: 50px;
    max-width: 100%;
    width: 100%;
  }
`;

const Title = styled.div`
  text-align: center;
  margin-bottom: 16px;
  font-size: 3rem;
  font-weight: 600;
`;

const PatientContainer = styled.div`
  width: 100%;
`;

const DirectionLine = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
`;

const InnerRow = styled.div<{ isLast: boolean }>`
  display: flex;
  gap: 12px;
  position: relative;

  ${({ isLast }) =>
    !isLast &&
    `
      &::before {
    content: '';
    position: absolute;
    height: 100%;
    border-left: 1px dashed #1a202c66;
    z-index: 0;
    left: 6.7px;
  }

  `};
`;

const StyledIcon = styled(Icon)`
  font-size: 2.5rem;
  color: #0a196f;
`;

const IconContainer = styled.div`
  background-color: #f5f5f5;
  cursor: pointer;
  padding: 11px;
  border-radius: 8px;
  opacity: 1;
  margin-bottom: 11px;
`;

const Row = styled.div<{ disabled: boolean }>`
  opacity: ${({ disabled }) => (disabled ? 0.48 : 1)};
`;

const ColumnRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 26px;
`;

const Column2 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 45px;
`;

const Column3 = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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
  position: relative;
  background-color: white;
`;

const LocationIcon = styled(Icon)`
  margin-left: -4px;
  color: #7fb519;
  font-size: 2.3rem;
  z-index: 22;
`;
