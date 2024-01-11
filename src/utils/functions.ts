import { endOfDay, format, startOfDay } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import Cookies from 'universal-cookie';
import { validationTexts } from './texts';
import { Patient, PatientServer, Trip, TripV1Server } from './types';

const cookies = new Cookies();

const getErrorMessage = (error?: string) =>
  validationTexts[error as keyof typeof validationTexts] || validationTexts.error;

export const handleAlert = (message?: string) => {
  toast.error(message, {
    position: 'top-center',
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleAlertFromServer = (responseError?: string) => {
  toast.error(getErrorMessage(responseError), {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
  });
};

export const handleSetTokens = (data: any) => {
  const { access_token, refresh_token, expires_in } = data;
  cookies.set('token', access_token, {
    path: '/',
    expires: new Date(new Date().getTime() + expires_in * 1000),
  });

  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 10);

  cookies.set('refreshToken', refresh_token, {
    path: '/',
    expires: expirationDate,
  });
};

export const formatTime = (datetime?: Date | string) =>
  datetime ? format(new Date(datetime), 'HH:mm') : '';

export const formatDateTo = (date: string) => {
  return format(utcToZonedTime(endOfDay(new Date(date)), 'Europe/Vilnius'), 'yyyy-MM-dd');
};

export const formatDateFrom = (date: any) => {
  return format(utcToZonedTime(startOfDay(new Date(date)), 'Europe/Vilnius'), 'yyyy-MM-dd');
};

export const formatCoordinates = (coordinates: string) =>
  coordinates?.split(',')?.map((c) => Number(c));

const dec2hex = (dec: number) => {
  return ('0' + dec.toString(16)).substr(-2);
};

const sha256 = (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = (a: ArrayBuffer) => {
  let str = '';
  const bytes = new Uint8Array(a);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
};

export const generateCodeChallengeFromVerifier = async (v: string) => {
  const hashed = await sha256(v);
  const base64encoded = base64urlencode(hashed);
  return base64encoded;
};

export const getDistance = (distance?: number) => `${((distance || 0) / 1000).toFixed(2)} km`;

export const secondsToHHMMSS = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  let formatString = '';

  if (hours > 0) {
    formatString += ` ${hours}h.`;
  }

  if (minutes > 0) {
    formatString += ` ${minutes}min.`;
  }

  if (remainingSeconds > 0) {
    formatString += ` ${remainingSeconds}s.`;
  }

  return formatString.trim();
};

export const handleGetCurrentLocation = async () => {
  try {
    const coordinates: { lat: number; lng: number } = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        () => {
          reject();
        },
        { enableHighAccuracy: true },
      );
    });
    return coordinates;
  } catch (e: any) {
    handleAlert(validationTexts.userDeniedLocation);
  }
};

export const getUniqueByProp = (data: any, prop: string) =>
  data?.reduce((prev: any, item: any) => {
    if (prev[item?.[prop]]) {
      prev[item?.[prop]].push(item);
    } else {
      prev[item?.[prop]] = [item];
    }

    return prev;
  }, {});

export const getKeys = (items: any) =>
  Object.keys(items).map((key) => {
    return {
      key,
      minSortElement: Math.min(...items[key].map((item: any) => item.sort)),
    };
  });

export const sortKeys = (keys: any[]) =>
  keys.sort((a, b) => {
    return a.minSortElement - b.minSortElement;
  });

export const updateState = async (
  mutateAsync: any,
  state: string,
  id: { [key: string]: string },
) => {
  const res = await handleGetCurrentLocation();
  if (!res) return;

  const { lat, lng } = res;

  await mutateAsync({
    parameters: {
      ...id,
      busena: state,
      busenos_laikas: new Date(),
      lat,
      long: lng,
    },
  });
};

export const getPatient = (value?: string): Patient | undefined => {
  if (!value || isEmpty(value)) return;

  const parsedPatientJson: PatientServer = JSON.parse(value);

  return mapPatient(parsedPatientJson);
};

export const mapPatient = (patient: PatientServer): Patient => {
  return {
    fullName: patient?.vardas_pavarde || 'Nežinomas vardas',
    id: patient?.pavezejimoElementoId,
    startDate: patient?.pavezejimoPradzia,
    endDate: patient?.pavezejimoPabaiga,
    phone: patient?.telefonas,
    sort: patient?.pavezejimoElementoNr,
    startCoordinates: patient?.pradinioAdresoKoordinates,
    endCoordinates: patient?.galutinioAdresoKoordinates,
    endAddress: patient?.galutinisAdresas,
    startAddress: patient?.paemimoAdresas,
    state: patient?.busena,
  };
};
export const getPatients = (value?: string[]): (undefined | Patient)[] => {
  if (!value || !Array.isArray(value)) return [];

  return value.map((patient) => getPatient(patient));
};

export const mapTrip = (trip: TripV1Server): Trip => {
  return {
    id: trip?.properties?.pavezejimoId,
    distance: trip?.properties?.atstumas,
    startAddress: trip?.properties?.pradinisAdresas,
    endAddress: trip?.properties?.galutinisAdresas,
    startCoordinates: trip?.properties?.pradinioAdresoKoordString,
    endCoordinates: trip?.properties?.galutinioAdresoKoordString,
    state: trip?.properties?.busena,
    date: trip?.properties?.data,
    phone: trip?.properties?.asmensTelefonoNumeris,
    startDate: trip?.properties?.pavezejimoPradzia,
    endDate: trip?.properties?.pavezejimoPabaiga,
    time: trip?.properties?.trukme,
    direction: trip?.properties?.kryptis,
    hospitalPhone: trip?.properties?.aspiTelNr,
  };
};
