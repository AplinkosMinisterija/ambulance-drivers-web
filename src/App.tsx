import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isEmpty, isEqual } from 'lodash';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, Route, Routes, useSearchParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'universal-cookie';
import LoaderComponent from './components/other/LoaderComponent';
import Login from './pages/Login';
import Patient from './pages/Patient';
import Trip from './pages/Trip';
import Trips from './pages/Trips';
import { useAppSelector } from './state/hooks';
import { actions } from './state/user/reducer';
import api from './utils/api';
import { ServerErrorCodes } from './utils/constants';
import {
  generateCodeChallengeFromVerifier,
  generateCodeVerifier,
  handleAlert,
  handleAlertFromServer,
  handleSetTokens,
} from './utils/functions';
import { useIsOnline, useLogout, useOfflineTrips, useUpdateTrip } from './utils/hooks';
import { InstallPWA } from './utils/install.ts/InstallPwa';
import { loadingTitle } from './utils/texts';
import { UserResponse } from './utils/types';
const cookies = new Cookies();

export const slugs = {
  login: '/prisijungimas/',
  trips: '/pavezejimai',
  trip: (id: string) => `/pavezejimai/${id}`,
  patient: (id: string) => `/asmuo/${id}`,
};

export const routes = [
  {
    component: <Trips />,
    slug: slugs.trips,
  },
  {
    component: <Trip />,
    slug: slugs.trip(':id'),
  },
  {
    component: <Patient />,
    slug: slugs.patient(':id'),
  },
];

function App() {
  const [searchParams] = useSearchParams();
  const { code, date } = Object.fromEntries([...Array.from(searchParams)]);
  const loggedIn = useAppSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();
  const codeVerified = cookies.get('code_verifier');
  const token = cookies.get('token');
  const refreshToken = cookies.get('refreshToken');
  const queryClient = useQueryClient();
  const isOnline = useIsOnline(false);
  const [value, setValue] = useOfflineTrips();
  const wakeLockRef = useRef<any>(null);
  const [err, setErr] = useState('');
  const [su, setSu] = useState('');

  useEffect(() => {
    const startWakeLock = async () => {
      try {
        //  await new Promise((resolve) => setTimeout(resolve, 1000));

        // @ts-ignore
        if ('wakeLock' in navigator && navigator?.wakeLock?.request) {
          // @ts-ignore
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setSu('success');
        }
      } catch (err: any) {
        handleAlert();
        setErr(JSON.stringify(err));
      }
    };
    startWakeLock();

    return () => {
      if (wakeLockRef?.current) {
        wakeLockRef.current.release();
      }
    };
    // @ts-ignore
  }, [navigator?.wakeLock?.request]);

  const { isFetching: refreshTokenLoading } = useQuery(
    [token, refreshToken],
    () => api.refreshToken(),
    {
      onError: ({ response }: any) => {
        if (isEqual(response.status, ServerErrorCodes.NO_PERMISSION)) {
          return handleLogout();
        }

        handleAlertFromServer();
      },
      onSuccess: (data) => handleSetTokens(data),
      retry: false,
      enabled: !token && !!refreshToken,
    },
  );

  const { mutateAsync: tripMutateAsync, isLoading: tripLoading } = useUpdateTrip(async () => {});

  const { handleLogout } = useLogout();

  const { isFetching: meLoading } = useQuery([token], () => api.userInfo(), {
    onError: ({ response }: any) => {
      if (isEqual(response.status, ServerErrorCodes.NO_PERMISSION)) {
        return handleLogout();
      }

      handleAlertFromServer();
    },
    onSuccess: (data: UserResponse) => {
      const attributes = data.attributes;
      const userData = {
        firstName: attributes?.['multipass:given-name']?.[0],
        lastName: attributes?.['multipass:family-name']?.[0],
        email: attributes?.['multipass:email:primary']?.[0],
        id: data.id,
      };

      dispatch(actions.setUser({ loggedIn: true, userData: userData }));
    },
    retry: false,
    enabled: !!token,
  });

  const loginMutation = useMutation((code: string) => api.palantirLogin({ code }), {
    onError: () => {
      handleAlertFromServer();
    },
    onSuccess: (data) => handleSetTokens(data),
    retry: false,
  });

  const eLoginMutationMutateAsync = loginMutation.mutateAsync;
  useEffect(() => {
    (async () => {
      if (!code) return;
      await eLoginMutationMutateAsync(code);
    })();
  }, [eLoginMutationMutateAsync, code]);
  useEffect(() => {
    (async () => {
      if (!isOnline || isEmpty(value)) return;

      const offlineTrips = Object.keys(value);

      for (let i = 0; i < offlineTrips.length; i++) {
        const key = offlineTrips[i];
        const trip = value?.[key];

        for (let j = 0; j < trip.length; j++) {
          const { state, lat, lng } = trip[j];
          await tripMutateAsync({
            parameters: {
              pavezejimas: key,
              busena: state,
              lat,
              long: lng,
            },
          });
          await queryClient.invalidateQueries(['trip', key]);
        }
      }
      await queryClient.invalidateQueries(['trips', date]);
      setValue({});
    })();
  }, [isOnline, tripMutateAsync, setValue, value, date, queryClient]);

  useEffect(() => {
    (async () => {
      if (codeVerified) return;

      const code_verifier = generateCodeVerifier();
      cookies.set('code_verifier', code_verifier, { path: '/' });

      const code_challenge = await generateCodeChallengeFromVerifier(code_verifier);
      cookies.set('code_challenge', code_challenge, { path: '/' });
    })();
  }, [codeVerified]);

  const isLoading = [loginMutation.isLoading, refreshTokenLoading, meLoading].some(
    (loading) => loading,
  );

  if (tripLoading) return <LoaderComponent text={loadingTitle.trip} />;

  if (isLoading) return <LoaderComponent />;

  return (
    <>
      {err && <div>err:{err}</div>}
      {su && <div>{su}</div>}
      <InstallPWA />
      <Routes>
        <Route element={<PublicRoute loggedIn={loggedIn} />}>
          <Route path={slugs.login} element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute loggedIn={loggedIn} />}>
          {(routes || []).map((route, index) => (
            <Route key={`route-${index}`} path={route.slug} element={route.component} />
          ))}
        </Route>
        <Route path="*" element={<Navigate to={loggedIn ? slugs.trips : slugs.login} />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

const PublicRoute = ({ loggedIn }: { loggedIn: boolean }) => {
  if (loggedIn) {
    return <Navigate to={slugs.trips} replace />;
  }

  return <Outlet />;
};

const ProtectedRoute = ({ loggedIn }: { loggedIn: boolean }) => {
  if (!loggedIn) {
    return <Navigate to={slugs.login} replace />;
  }

  return <Outlet />;
};

export default App;
