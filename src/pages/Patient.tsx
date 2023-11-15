import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import BackButton from '../components/buttons/BackButton';
import Button from '../components/buttons/Button';
import DefaultLayout from '../components/layouts/DefaultLayout';
import Header from '../components/layouts/Header';
import ActionCard from '../components/other/ActionCard';
import DeleteCard from '../components/other/DeleteCard';
import Icon from '../components/other/Icons';
import LoaderComponent from '../components/other/LoaderComponent';
import Tag from '../components/other/Tag';
import TripInfo from '../components/other/TripInfo';
import api from '../utils/api';
import { stateTypes } from '../utils/constants';
import { getPatient, handleAlert, updateState } from '../utils/functions';
import { useIsOnline } from '../utils/hooks';
import {
  buttonsTitles,
  deleteStateDescriptions,
  deleteStateTitle,
  multiTripSingularButtonLabels,
  stateLabels,
  title,
} from '../utils/texts';
import { Patient } from '../utils/types';

const PatientPage = () => {
  const { id = '' } = useParams();
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const isOnline = useIsOnline();

  const { data: patientServer, isFetching } = useQuery(
    ['tripPatient', id],
    () => api.getTripPatient(id),
    {},
  );

  const patient = getPatient(patientServer?.value) as Patient;
  const currentState = patient?.state;

  const declinePatientMutation = useMutation((values: any) => api.updatePatientTrip(values), {
    onError: () => {
      handleAlert();
    },
    onSuccess: async () => {
      navigate(-1);
    },
  });

  const { isLoading: patientUpdateLoading, mutateAsync: updatePatientMutateAsync } = useMutation(
    (values: any) => api.updatePatientTrip(values),
    {
      onError: () => {
        handleAlert();
      },
      onSuccess: async () => {
        navigate(-1);
      },
    },
  );

  const handleUpdateState = async (mutateAsync: any, state: string) => {
    updateState(mutateAsync, state, {
      pavezejimo_elementas: id,
    });
  };

  const renderButton = {
    [stateTypes.start]: (
      <Button
        loading={patientUpdateLoading}
        disabled={patientUpdateLoading || !isOnline}
        onClick={() => {
          handleUpdateState(updatePatientMutateAsync, stateTypes.tripStart);
        }}
      >
        {multiTripSingularButtonLabels.tripStart}
      </Button>
    ),
    [stateTypes.tripEnd]: (
      <Button
        loading={patientUpdateLoading}
        disabled={patientUpdateLoading || !isOnline}
        onClick={() => {
          handleUpdateState(updatePatientMutateAsync, stateTypes.end);
        }}
      >
        {multiTripSingularButtonLabels.end}
      </Button>
    ),
  };

  const showDeleteButton =
    [stateTypes.start].some((item) => [currentState].includes(item)) && isOnline;

  if (isFetching || declinePatientMutation.isLoading) return <LoaderComponent />;

  return (
    <DefaultLayout maxWidth="800px">
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
        <PatientName>{patient?.fullName}</PatientName>
        <TripInfo properties={patient} />
        <ActionContainer>
          <ActionCard
            icon={'phone'}
            text={buttonsTitles.callPatient}
            onClick={() => {
              //@ts-ignore
              window.location = `tel:${patient.phone}`;
            }}
          />
        </ActionContainer>
        <ButtonContainer>{renderButton[currentState]}</ButtonContainer>
        <DeleteCard
          visible={visible}
          title={deleteStateTitle.trip}
          description={deleteStateDescriptions.trip}
          onSetClose={() => {
            setVisible(false);
          }}
          handleDelete={async () => {
            await handleUpdateState(declinePatientMutation.mutateAsync, stateTypes.decline);

            setVisible(false);
          }}
          deleteInProgress={declinePatientMutation.isLoading}
        />
      </Content>
    </DefaultLayout>
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

const ActionContainer = styled.div`
  margin: 24px 0 32px 0;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  color: #84899f;
  width: 100%;
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
  padding: 16px;
`;

const PatientName = styled.div`
  margin: 12px 0 19px 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: #0a196f;
  text-align: left;
`;

const StyledIcon = styled(Icon)`
  font-size: 1.8rem;
  color: #0f1a00;
`;

export default PatientPage;
