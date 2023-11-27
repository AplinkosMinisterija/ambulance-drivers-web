import Axios, { AxiosInstance, AxiosResponse } from 'axios';
import { TripV1Server } from './types';

import Cookies from 'universal-cookie';
import { Resources } from './constants';
const cookies = new Cookies();

interface GetAll {
  resource: string;
  page?: number;
  populate?: string[];
  municipalityId?: string;
  filter?: string | any;
  query?: string;
  pageSize?: string;
  search?: string;
  searchFields?: string[];
  sort?: string[];
  scope?: string;
  fields?: string[];
  id?: string;
  geom?: any;
  responseType?: any;
}

export interface GetAllResponse<T> {
  rows: T[];
  totalPages: number;
  page: number;
  pageSize: number;
  error?: any;
}

interface GetOne {
  resource: string;
  id?: string | any;
  populate?: string[];
  scope?: string;
}
interface UpdateOne {
  resource?: string;
  id?: string;
  params?: any;
}

interface Create {
  resource: string;
  params?: any;
  config?: any;
  id?: string;
}

const clientID = import.meta.env.VITE_CLIENT_ID;

const palantirProxy = '/api';

export const getMapUrl = (start: string, destination: string, stop?: string) => {
  const baseURL = 'https://www.google.com/maps/dir/';
  const url = new URL(baseURL);
  const params = new URLSearchParams(url.search);
  params.append('api', '1');
  params.append('origin', start);
  params.append('destination', destination);
  if (stop) {
    params.append('waypoints', stop);
  }
  url.search = params.toString();

  return url.href;
};

const redirectUri = `${window.location.origin}`;
const postScope = 'api:write-data';
const getScope = 'api:read-data';
const offlineScope = 'offline_access';
const scope = `${getScope} ${postScope} ${offlineScope}`;

export const geLoginUrl = () => {
  if (!clientID) return '';

  const baseURL = Resources.PALANTIR_SIGN;
  const url = new URL(baseURL);
  const params = new URLSearchParams(url.search);
  params.append('client_id', clientID);
  params.append('scope', scope);
  params.append('response_type', 'code');
  params.append('code_challenge', cookies.get('code_challenge'));
  params.append('code_verifier', cookies.get('code_verifier'));
  params.append('code_challenge_method', 'S256');
  params.append('redirect_uri', redirectUri);
  url.search = params.toString();
  return url.href;
};

class Api {
  private AuthApiAxios: AxiosInstance;

  constructor() {
    this.AuthApiAxios = Axios.create();

    this.AuthApiAxios.interceptors.request.use(
      (config) => {
        config.headers.Authorization = 'Bearer ' + cookies.get('token');

        return config;
      },
      (error) => {
        Promise.reject(error);
      },
    );
  }

  errorWrapper = async (endpoint: () => Promise<AxiosResponse<any, any>>) => {
    const res = await endpoint();
    return res.data;
  };

  get = async ({ resource, id, scope }: GetAll) => {
    const config = {
      params: {
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  getOne = async ({ resource, id, scope }: GetOne) => {
    const config = {
      params: {
        ...(!!scope && { scope }),
      },
    };

    return this.errorWrapper(() =>
      this.AuthApiAxios.get(`${resource}${id ? `/${id}` : ''}`, config),
    );
  };

  patch = async ({ resource, id, params }: UpdateOne) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.patch(`${resource}/${id ? `/${id}` : ''}`, params),
    );
  };

  post = async ({ resource, id, params, config = {} }: Create) => {
    return this.errorWrapper(() =>
      this.AuthApiAxios.post(`${resource}${id ? `/${id}` : ''}`, params, config),
    );
  };

  trips = async (params: any): Promise<{ data: TripV1Server[] }> => {
    return this.post({
      resource: palantirProxy + Resources.TRIPS,
      params,
    });
  };

  trip = async (id: string): Promise<TripV1Server> => {
    return this.getOne({
      resource: palantirProxy + Resources.TRIP,
      id,
    });
  };

  updateTrip = async (params: any): Promise<TripV1Server> => {
    return this.post({
      resource: palantirProxy + Resources.UPDATE_TRIP,
      params,
    });
  };

  updatePatientTrip = async (params: any): Promise<TripV1Server> => {
    return this.post({
      resource: palantirProxy + Resources.UPDATE_PATIENT_TRIP,
      params,
    });
  };

  getTripPatients = async (id: string): Promise<{ value: string[] }> => {
    return this.post({
      resource: palantirProxy + Resources.TRIP_PATIENTS,
      params: {
        parameters: { pavezejimo_id: id },
      },
    });
  };
  getTripPatient = async (id: string): Promise<{ value: string }> => {
    return this.post({
      resource: palantirProxy + Resources.TRIP_PATIENT,
      params: {
        parameters: { elemento_id: id },
      },
    });
  };

  userInfo = async () => {
    return this.get({
      resource: palantirProxy + Resources.ME,
    });
  };

  palantirLogin = async ({ code }: { code: string }) => {
    if (!code) return '.';

    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    return this.post({
      resource: palantirProxy + Resources.PALANTIR_LOGIN,
      params: {
        grant_type: 'authorization_code',
        code,
        client_id: clientID,
        redirect_uri: redirectUri,
        code_verifier: cookies.get('code_verifier'),
      },
      config,
    });
  };

  refreshToken = async () => {
    const config = {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    };

    return this.post({
      resource: palantirProxy + Resources.PALANTIR_LOGIN,
      params: {
        grant_type: 'refresh_token',
        client_id: clientID,
        redirect_uri: redirectUri,
        refresh_token: cookies.get('refreshToken'),
      },
      config,
    });
  };
}

const api = new Api();

export default api;
