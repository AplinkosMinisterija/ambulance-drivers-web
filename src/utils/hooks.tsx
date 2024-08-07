import { useMutation } from '@tanstack/react-query';
import { intervalToDuration } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { useAppSelector } from '../state/hooks';
import { actions } from '../state/offline/reducer';

import { actions as userActions } from '../state/user/reducer';
import api from './api';
import { handleAlert, handleGetCurrentLocation, handleSuccess } from './functions';
import { validationTexts } from './texts';
import { TripV1Server } from './types';

const cookies = new Cookies();

export const useCurrentLocation = () => {
  const [location, setLocation] = useState<{ lat?: number; lng?: number }>();

  useEffect(() => {
    (async () => {
      if (!navigator?.geolocation) return;

      const res = await handleGetCurrentLocation();
      if (!res) return;

      setLocation(res);
    })();
  }, []);
  return location;
};

export const useDistanceAndDuration = (properties: TripV1Server['properties']) => {
  const duration = intervalToDuration({
    start: properties?.pavezejimoPradzia,
    end: properties?.pavezejimoPabaiga,
  });

  const distance = `${((properties.atstumas || 0) / 1000).toFixed(2)} km`;

  return { distance, duration };
};

export const useIsOnline = (showToast = true) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleOnline = useCallback(() => {
    setIsOnline(true);
    if (showToast) {
      handleSuccess(validationTexts.online);
    }
  }, [showToast]);

  const handleOffline = useCallback(() => {
    setIsOnline(false);
    if (showToast) {
      handleAlert(validationTexts.offline);
    }
  }, [showToast]);

  useEffect(() => {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [handleOffline, handleOnline]);

  return isOnline;
};

export const useOfflineTrips = () => {
  const value = useAppSelector((state) => state.offline.trips);
  const dispatch = useDispatch();

  const setValue = useCallback(
    (value: any) => {
      dispatch(actions.setOfflineTrips(value));
    },
    [dispatch],
  );

  return [value, setValue];
};

export const useUpdateTrip = (onSuccess: () => Promise<void>) => {
  const { mutateAsync, isLoading } = useMutation((values: any) => api.updateTrip(values), {
    onSuccess,
  });

  return { mutateAsync, isLoading };
};

export const useLogout = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    cookies.remove('code_verifier', { path: '/' });
    cookies.remove('code_challenge', { path: '/' });
    cookies.remove('token', { path: '/' });
    cookies.remove('refreshToken', { path: '/' });
    dispatch(userActions.setUser({ loggedIn: false, userData: {} }));
    api.logout();
  };

  return {
    handleLogout,
  };
};

export const useWakeLock = () => {
  const wakeLockRef = useRef<any>(null);

  const lockScreen = async () => {
    //@ts-ignore
    if ((wakeLockRef.current && !wakeLockRef.current.released) || !navigator?.wakeLock?.request)
      return;

    try {
      //@ts-ignore
      wakeLockRef.current = await navigator.wakeLock.request();
    } catch (err: any) {
      console.log(err);
    }
  };

  return { lockScreen };
};
