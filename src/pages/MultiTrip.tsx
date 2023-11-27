import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import BackButton from '../components/buttons/BackButton';
import Header from '../components/layouts/Header';
import DisableText from '../components/other/DisableText';
import InfoItem from '../components/other/InfoItem';
import LoaderComponent from '../components/other/LoaderComponent';
import Tag from '../components/other/Tag';
import TripGroup from '../components/other/TripGroup';
import { actions } from '../state/currentTrip/reducer';
import { device } from '../styles';
import api from '../utils/api';
import { stateTypes } from '../utils/constants';
import {
  getDistance,
  getKeys,
  getUniqueByProp,
  secondsToHHMMSS,
  sortKeys,
  updateState,
} from '../utils/functions';
import { useIsOnline } from '../utils/hooks';
import { formLabels, title } from '../utils/texts';
import { Patient, Trip } from '../utils/types';
const allPatientsTakenTypes = [stateTypes.tripStart, stateTypes.decline];
const anyPatientsTakenTypes = [stateTypes.start, stateTypes.decline];
const allPatientsAtHomeTypes = [stateTypes.end, stateTypes.decline];

const MultiTrip = ({ trip, tripPatientsData }: { trip: Trip; tripPatientsData?: Patient[] }) => {
  const { id = '' } = useParams();
  const dispatch = useDispatch();
  const [currentGroupAddress, setCurrentGroupAddress] = useState('');

  const queryClient = useQueryClient();
  const isOnline = useIsOnline();

  const updateTripMutation = useMutation((values) => api.updateTrip(values), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['trip', id]);
      await queryClient.invalidateQueries(['tripPatients', id]);
    },
  });

  const uniqueStops: { [key: string]: Patient[] } = getUniqueByProp(
    tripPatientsData,
    'startAddress',
  );
  const uniqueDestinations: { [key: string]: Patient[] } = getUniqueByProp(
    tripPatientsData,
    'endAddress',
  );
  const stopKeys = getKeys(uniqueStops);
  const destinationKeys = getKeys(uniqueDestinations);
  const sortedStopKeys: string[] = sortKeys(stopKeys).map((item) => item.key);
  const sortedDestinationKeys: string[] = sortKeys(destinationKeys).map((item) => item.key);

  const filteredSortedStopKeys: string[] = sortedStopKeys?.filter(
    (item) => !isEmpty(uniqueStops?.[item]?.filter((item) => item?.state !== stateTypes.decline)),
  );

  const filteredSortedDestinationKeys: string[] = sortedDestinationKeys?.filter(
    (item) =>
      !isEmpty(uniqueDestinations?.[item]?.filter((item) => item?.state !== stateTypes.decline)),
  );

  const handleUpdateTrip = async (state: string) => {
    await updateState(updateTripMutation.mutateAsync, state, {
      pavezejimas: id,
    });
  };

  const state = trip?.state;
  const distance = getDistance(trip?.distance);
  const duration = secondsToHHMMSS(trip?.time);
  const isDeclined = state === stateTypes.decline;

  useEffect(() => {
    (async () => {
      if (updateTripMutation.isLoading) return;

      if (
        !isDeclined &&
        isEmpty(tripPatientsData?.filter((item) => item.state !== stateTypes.decline))
      ) {
        await handleUpdateTrip(stateTypes.decline);
        dispatch(actions.setCurrentTrip(''));
      } else if (state === stateTypes.approved) {
        const anyPatientsTaken = uniqueStops[sortedStopKeys[0]].some((item) =>
          anyPatientsTakenTypes.includes(item.state),
        );

        if (anyPatientsTaken) {
          dispatch(actions.setCurrentTrip(id));
          await handleUpdateTrip(stateTypes.start);
        }
      } else if (state === stateTypes.start) {
        const allPatientsTaken = uniqueStops[sortedStopKeys[0]].every((item) =>
          allPatientsTakenTypes.includes(item.state),
        );

        if (allPatientsTaken) {
          await handleUpdateTrip(stateTypes.tripStart);
        }
      } else if (state === stateTypes.tripStart) {
        const allPatientsAtHome = uniqueDestinations[
          filteredSortedDestinationKeys.slice(-1)[0]
        ].every((item) => {
          return allPatientsAtHomeTypes.includes(item.state);
        });

        if (allPatientsAtHome) {
          await handleUpdateTrip(stateTypes.tripEnd).then(async () => {
            await handleUpdateTrip(stateTypes.end);
            dispatch(actions.setCurrentTrip(''));
          });
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, sortedStopKeys, uniqueStops]);

  useEffect(() => {
    sortedStopKeys.forEach((key) => {
      if (uniqueStops[key].every((item) => allPatientsTakenTypes.includes(item.state))) {
        setCurrentGroupAddress(key);
      }
    });
    filteredSortedDestinationKeys.forEach((key) => {
      if (uniqueDestinations[key].every((item) => allPatientsAtHomeTypes.includes(item.state))) {
        setCurrentGroupAddress(key);
      }
    });
  }, [sortedStopKeys, uniqueStops]);

  if (updateTripMutation.isLoading) return <LoaderComponent />;

  return (
    <>
      <Header>
        <HeaderRow>
          <InnerHeaderRow>
            <BackButton />
            <Title>{title.tripInfo}</Title>
          </InnerHeaderRow>
        </HeaderRow>
      </Header>
      <Content>
        <ContentContainer>
          <Row>
            <Tag text={state} />
            <IconRow>
              <StyledText>{trip?.direction}</StyledText>
              <InfoItem icon="user" value={tripPatientsData?.length} />
              <IcoInnerRow>
                <InfoItem icon="distance" value={distance} />
                <Line />
                <InfoItem icon="time" value={duration} />
              </IcoInnerRow>
            </IconRow>
          </Row>

          {isDeclined ? (
            <DisableText text={formLabels.tripDeclined} />
          ) : (
            <>
              {sortedStopKeys.map((key) => {
                const group = uniqueStops[key];
                const firstGroupElement = group[0];
                const coordinates = firstGroupElement.startCoordinates;
                const disabled = !isOnline || key == currentGroupAddress;

                return (
                  <TripGroup
                    group={group}
                    disabled={disabled}
                    address={firstGroupElement.startAddress}
                    time={firstGroupElement.startDate}
                    coordinates={coordinates}
                  />
                );
              })}

              {filteredSortedDestinationKeys.map((key, index) => {
                const group = uniqueDestinations[key];
                const firstGroupElement = group[0];
                const coordinates = firstGroupElement.endCoordinates;
                const disabled = !isOnline || key == currentGroupAddress;

                return (
                  <TripGroup
                    group={group.filter((item) => item.state !== stateTypes.decline)}
                    disabled={disabled}
                    isLast={filteredSortedDestinationKeys.length - 1 === index}
                    address={firstGroupElement.endAddress}
                    time={firstGroupElement.endDate}
                    coordinates={coordinates}
                  />
                );
              })}
            </>
          )}
        </ContentContainer>
      </Content>
    </>
  );
};

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
`;

const StyledText = styled.span`
  font-size: 1.2rem;
  color: #84899f;
`;

const InnerHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px;

  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin: 32px 0;
`;

const IconRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const IcoInnerRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Line = styled.div`
  width: 1px;
  height: 10px;
  background-color: #84899f;
`;

export default MultiTrip;
