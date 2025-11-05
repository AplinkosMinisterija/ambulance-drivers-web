import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { slugs } from '../App';
import Datepicker from '../components/fields/DatePicker';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Header from '../components/layouts/Header';
import DisableText from '../components/other/DisableText';
import Icon from '../components/other/Icons';
import LoaderComponent from '../components/other/LoaderComponent';
import TripCard from '../components/other/TripCard';
import { useAppSelector } from '../state/hooks';
import { device } from '../styles';
import api from '../utils/api';
import { formatDateFrom, formatDateTo, handleAlertFromServer, mapTrip } from '../utils/functions';
import { useIsOnline, useLogout, useOfflineTrips } from '../utils/hooks';
import { emptyStateDescriptions, emptyStateTitle } from '../utils/texts';
import { Trip } from '../utils/types';
const Trips = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dateValue = searchParams.get('date') as string;
  const user = useAppSelector((state) => state.user.userData);
  const [date, setDate] = useState<Date | string | undefined>(dateValue || new Date());
  const isOnline = useIsOnline();
  const [value] = useOfflineTrips();
  const currentTripId = useAppSelector((state) => state.currentTripId);

  const { handleLogout } = useLogout();

  useEffect(() => {
    if (!isOnline) {
      setDate(new Date());
    }
  }, [isOnline]);

  useEffect(() => {
    setSearchParams(`date=${formatDateFrom(date)}`);
  }, [date, setSearchParams]);

  const query = {
    query: {
      type: 'and',
      value: [
        {
          type: 'gte',
          field: 'properties.data',
          value: formatDateFrom(dateValue),
        },
        {
          type: 'lte',
          field: 'properties.data',
          value: formatDateTo(dateValue),
        },
        {
          type: 'eq',
          field: 'properties.vairuotojoId',
          value: user.id,
        },
      ],
    },
    orderBy: {
      fields: [
        {
          field: 'properties.pavezejimoPradzia',
          direction: 'asc',
        },
      ],
    },
  };

  const { data, isFetching } = useQuery(['trips', dateValue], () => api.trips(query), {
    onError: () => {
      handleAlertFromServer();
    },
    retry: false,
  });

  const renderContent = () => {
    if (isFetching) return <LoaderComponent />;

    if (isEmpty(data?.data)) {
      return (
        <NotFoundContainer>
          <DisableText text={emptyStateTitle.trip} description={emptyStateDescriptions.trip} />
        </NotFoundContainer>
      );
    }

    const mappedTrips = data?.data.map((item) => mapTrip(item)) || [];

    // Filter trips by time window
    const now = new Date().getTime();
    const filteredTrips = mappedTrips.filter((trip) => {
      const start = new Date(trip.startDate).getTime();
      const end = new Date(trip.endDate).getTime();

      const visibleFrom = start - 60 * 60 * 1000; // 1 hour before start
      const visibleUntil = end + 15 * 60 * 1000;  // 15 minutes after end

      return now >= visibleFrom && now <= visibleUntil;
    });

    const isDisabledTrip = (trip: Trip) => {
      if (!currentTripId) return;
      return trip.id !== currentTripId;
    };

    return (
      <>
        {filteredTrips
          .filter((item) => item.state !== 'Atšauktas')
          ?.map((trip) => {
            const offlineTrip = value?.[trip?.id] ? [...value[trip?.id]] : undefined;
            return (
              <TripCard
                disabled={isDisabledTrip(trip)}
                lastOfflineState={offlineTrip?.slice(-1)?.[0]?.state}
                trip={trip}
                onClick={(id: string) => navigate(slugs.trip(id))}
              />
            );
          })}
      </>
    );
  };

  return (
    <DefaultLayout maxWidth="800px">
      <Header>
        <HeaderRow>
          <NameRow>
            {`Sveiki, `} <BoldText> {` ${user.firstName}`}</BoldText>
          </NameRow>
          <IconContainer onClick={handleLogout}>
            <LogoutIcon name="logout" />
          </IconContainer>
        </HeaderRow>
      </Header>
      <Container>
        <StyledDatepicker
          disabled={!isOnline}
          value={date}
          onChange={(date) => {
            setDate(date);
          }}
        />
        {renderContent()}
      </Container>
    </DefaultLayout>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 32px;
  min-height: 60vh;
  overflow-y: auto;
  @media ${device.mobileL} {
    padding: 12px;
  }
`;

const NotFoundContainer = styled.div`
  height: 100%;
`;

const NameRow = styled.div`
  display: flex;
  font-size: 1.8rem;
  gap: 4px;
`;
const BoldText = styled.div`
  font-weight: 600;
`;
const StyledDatepicker = styled(Datepicker)`
  margin-bottom: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LogoutIcon = styled(Icon)`
  font-size: 3rem;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default Trips;
