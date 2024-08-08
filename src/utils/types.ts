export type ChildrenType = string | JSX.Element | JSX.Element[] | any;

export interface TripV1Server {
  properties: {
    aspiTelNr?: string;
    pavezejimoId: string;
    atstumas: number;
    pradinisAdresas: string;
    pradinioAdresoId: string;
    galutinisAdresas: string;
    atnaujinta: string;
    registracijosId: string;
    pradinioAdresoSavivaldybe: string;
    pradinioAdresoKoordinates: string;
    galutinioAdresoKoordinates: string;
    busena: string;
    data: string;
    asmensId: string;
    atnaujino: string;
    asmensTelefonoNumeris: string;
    pavezejimoPradzia: Date;
    pavezejimoPabaiga: Date;
    trukme: number;
    pradinioAdresoKoordString: string;
    galutinioAdresoKoordString: string;
    papildomosPastabos: string;
    vizitoAspįIrFilialasJeiYra_: string;
    paėmimoAspįIrFilialasJeiYra_: string;
    kryptis: string;
  };
  rid: string;
}

export interface Trip {
  id: string;
  distance: number;
  direction: string;
  startAddress: string;
  endAddress: string;
  startCoordinates: any;
  endCoordinates: any;
  state: string;
  date: string;
  phone: string;
  hospitalPhone?: string;
  startDate: Date;
  endDate: Date;
  time: number;
  notes: string;
  visitAspi: string;
  takeAspi: string;
}

export interface PatientServer {
  pavezejimoElementoId: string;
  pavezejimoPabaiga: Date;
  pavezejimoPradzia: Date;
  telefonas: string;
  pavezejimoElementoNr: number;
  galutinioAdresoKoordinates: any;
  pradinioAdresoKoordinates: any;
  busena: string;
  vardas_pavarde: string;
  pavarde: string;
  galutinisAdresas: string;
  paemimoAdresas: string;
}

export interface Patient {
  id: string;
  startDate: Date;
  endDate: Date;
  endAddress: string;
  startAddress: string;
  phone: string;
  sort: number;
  startCoordinates: string;
  endCoordinates: string;
  state: string;
  fullName: string;
}

export interface UserResponse {
  id: string;
  attributes: {
    'multipass:email:primary': string;
    'multipass:given-name': string[];
    'multipass:family-name': string[];
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}
