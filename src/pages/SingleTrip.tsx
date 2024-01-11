import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import styled from 'styled-components';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import Header from '../components/layouts/Header';
import ActionCard from '../components/other/ActionCard';
import DeleteCard from '../components/other/DeleteCard';
import DisableText from '../components/other/DisableText';
import Icon from '../components/other/Icons';
import InfoItem from '../components/other/InfoItem';
import LoaderComponent from '../components/other/LoaderComponent';
import Tag from '../components/other/Tag';
import TripInfo from '../components/other/TripInfo';
import { actions } from '../state/currentTrip/reducer';
import { device } from '../styles';
import api, { getMapUrl } from '../utils/api';
import { stateTypes } from '../utils/constants';
import { getDistance, handleGetCurrentLocation, secondsToHHMMSS } from '../utils/functions';
import { useCurrentLocation, useIsOnline, useOfflineTrips, useUpdateTrip } from '../utils/hooks';
import {
  buttonsTitles,
  deleteStateDescriptions,
  deleteStateTitle,
  formLabels,
  stateLabels,
  title,
} from '../utils/texts';
import { Trip } from '../utils/types';

const SingleTrip = ({ trip }: { trip: Trip }) => {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  const isOnline = useIsOnline();

  const [value, setValue] = useOfflineTrips();
  let currentTrip = value?.[id] ? [...value[id]] : undefined;
  const currentTripState = currentTrip?.slice(-1)?.[0]?.state;

  const { mutateAsync: tripMutateAsync, isLoading: tripLoading } = useUpdateTrip(
    async () => await queryClient.invalidateQueries(['trip', id]),
  );

  const declineTripMutation = useMutation((values) => api.updateTrip(values), {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['trip', id]);
    },
  });
  const handleUpdateState = async (mutateAsync: any, state: string) => {
    const res = await handleGetCurrentLocation();
    if (!res) return;

    const { lat, lng } = res;

    if (isOnline) {
      await mutateAsync({
        parameters: {
          pavezejimas: id,
          busena: state,
          busenos_laikas: new Date(),
          lat,
          long: lng,
        },
      });
    } else {
      if (currentTrip) {
        currentTrip.push({ state, lat, lng, date: new Date() });
      } else {
        currentTrip = [{ state, lat, lng, date: new Date() }];
      }
      setValue({ ...value, [id]: currentTrip });
    }
  };

  const renderButton = {
    [stateTypes.start]: (
      <Button
        loading={tripLoading}
        disabled={tripLoading}
        onClick={() => {
          handleUpdateState(tripMutateAsync, stateTypes.tripStart);
        }}
      >
        {stateLabels.tripStart}
      </Button>
    ),
    [stateTypes.tripStart]: (
      <Button
        loading={tripLoading}
        disabled={tripLoading}
        onClick={() => {
          handleUpdateState(tripMutateAsync, stateTypes.tripEnd);
        }}
      >
        {stateLabels.tripEnd}
      </Button>
    ),
    [stateTypes.tripEnd]: (
      <Button
        loading={tripLoading}
        disabled={tripLoading}
        onClick={() => {
          dispatch(actions.setCurrentTrip(''));
          handleUpdateState(tripMutateAsync, stateTypes.end);
        }}
      >
        {stateLabels.end}
      </Button>
    ),
    [stateTypes.decline]: <DisableText text={formLabels.tripDeclined} />,
    [stateTypes.end]: <DisableText text={formLabels.tripEnded} />,
  };

  const renderContent = () => {
    const button = isOnline
      ? renderButton[trip?.state]
      : renderButton[currentTripState] || renderButton[trip?.state];

    if (button) {
      return button;
    }

    return (
      <Button
        loading={tripLoading}
        disabled={tripLoading}
        onClick={() => {
          dispatch(actions.setCurrentTrip(id));
          handleUpdateState(tripMutateAsync, stateTypes.start);
        }}
      >
        {stateLabels.start}
      </Button>
    );
  };
  const location = useCurrentLocation();

  const mapUrl = getMapUrl(
    `${location?.lat},${location?.lng}`,
    trip?.endCoordinates,
    trip?.startCoordinates,
  );

  const phone = trip?.phone;
  const state = trip?.state;
  const distance = trip?.distance;
  const time = trip?.time;

  const formattedDistance = getDistance(distance);
  const duration = secondsToHHMMSS(time);
  const showDeleteButton = [stateTypes.tripStart, stateTypes.start].some((item) =>
    [state, currentTripState].includes(item),
  );

  if (declineTripMutation.isLoading) return <LoaderComponent />;

  return (
    <>
      <Header>
        <HeaderRow>
          <InnerHeaderRow>
            <BackButton />
            <Title>{title.tripInfo}</Title>
          </InnerHeaderRow>

          {showDeleteButton && (
            <Tag
              onClick={() => setVisible(true)}
              icon={<StyledIcon name="close" />}
              color="#FE5B78"
              text={stateLabels.decline}
            />
          )}
        </HeaderRow>
      </Header>
      <Content>
        <ContentContainer>
          <Row>
            <Tag text={currentTripState || state} />
            <IconRow>
              <InfoItem icon="distance" value={formattedDistance} />
              <Line />
              <InfoItem icon="time" value={duration} />
            </IconRow>
          </Row>

          <TripInfo properties={trip} />

          <ActionContainer>
            <ActionCard
              icon={'phone'}
              text={buttonsTitles.callPatient}
              onClick={() => {
                //@ts-ignore
                window.location = `tel:+${phone}`;
              }}
            />

            {trip?.hospitalPhone && (
              <ActionCard
                icon={'phone'}
                text={buttonsTitles.callHospital}
                onClick={() => {
                  //@ts-ignore
                  window.location = `tel:+${trip?.hospitalPhone}`;
                }}
              />
            )}

            {!trip?.hospitalPhone && (
              <ActionCard
                icon={'map'}
                text={buttonsTitles.tripMap}
                onClick={() => {
                  //@ts-ignore
                  window.location = mapUrl;
                }}
              />
            )}
          </ActionContainer>
          {trip?.hospitalPhone && (
            <ActionContainer2>
              <ActionCard
                icon={'map'}
                text={buttonsTitles.tripMap}
                onClick={() => {
                  //@ts-ignore
                  window.location = mapUrl;
                }}
              />
            </ActionContainer2>
          )}
        </ContentContainer>
        <ButtonContainer>{renderContent()}</ButtonContainer>
        <DeleteCard
          visible={visible}
          title={deleteStateTitle.trip}
          description={deleteStateDescriptions.trip}
          onSetClose={() => {
            setVisible(false);
          }}
          handleDelete={async () => {
            await handleUpdateState(declineTripMutation.mutateAsync, stateTypes.decline);
            dispatch(actions.setCurrentTrip(''));

            setVisible(false);
          }}
          deleteInProgress={declineTripMutation.isLoading}
        />
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

const InnerHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ContentContainer = styled.div`
  display: flex;
  overflow-y: auto;
  flex-direction: column;
  gap: 12px;
`;

const ActionContainer = styled.div`
  margin: 24px 0 32px 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: center;
  color: #84899f;
`;

const ActionContainer2 = styled.div`
  margin: -24px 0 32px 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: center;
  color: #84899f;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 12px;
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

const StyledIcon = styled(Icon)`
  font-size: 1.8rem;
  color: #0f1a00;
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
  gap: 8px;
`;

const Line = styled.div`
  width: 1px;
  height: 10px;
  background-color: #84899f;
`;

export default SingleTrip;
