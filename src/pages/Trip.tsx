import { useQuery } from '@tanstack/react-query';
import { isEmpty } from 'lodash';
import { useNavigate, useParams } from 'react-router';
import { slugs } from '../App';
import DefaultLayout from '../components/layouts/DefaultLayout';
import LoaderComponent from '../components/other/LoaderComponent';
import api from '../utils/api';
import { getPatients, mapTrip } from '../utils/functions';
import { useWakeLock } from '../utils/hooks';
import { Patient } from '../utils/types';
import MultiTrip from './MultiTrip';
import SingleTrip from './SingleTrip';

const Trip = () => {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { data: tripServer, isFetching } = useQuery(['trip', id], () => api.trip(id), {
    onError: () => {
      navigate(slugs.trips);
    },
  });

  const { data: tripPatients, isFetching: patientFetching } = useQuery(
    ['tripPatients', id],
    () => api.getTripPatients(id),
    {},
  );

  const patients = getPatients(tripPatients?.value) as Patient[];

  useWakeLock();

  if (isFetching || patientFetching || !tripServer) return <LoaderComponent />;

  const trip = mapTrip(tripServer);

  return (
    <DefaultLayout maxWidth="800px">
      {isEmpty(patients) ? (
        <SingleTrip trip={trip} />
      ) : (
        <MultiTrip trip={trip} tripPatientsData={patients} />
      )}
    </DefaultLayout>
  );
};

export default Trip;
