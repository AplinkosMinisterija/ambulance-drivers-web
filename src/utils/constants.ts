export enum Resources {
  PALANTIR_SIGN = 'https://vdv.stat.gov.lt/multipass/api/oauth2/authorize',
  ME = 'multipass/api/me',
  LOGOUT = 'multipass/api/logout',
  PALANTIR_LOGIN = 'multipass/api/oauth2/token',
  TRIPS = 'api/v1/ontologies/ri.ontology.main.ontology.3a30bbf0-f1a2-401c-bd13-787b48766b99/objects/PavezejaiPavezejimas/search',
  TRIP = 'api/v1/ontologies/ri.ontology.main.ontology.3a30bbf0-f1a2-401c-bd13-787b48766b99/objects/PavezejaiPavezejimas',
  TRIP_PATIENT = 'api/v2/ontologies/ontology-290262e8-c6a5-4d5c-9ed7-8dc71c53ae0c/queries/getVienasElementasDecryptVardasPavarde/execute?preview=true',
  TRIP_PATIENTS = 'api/v2/ontologies/ontology-290262e8-c6a5-4d5c-9ed7-8dc71c53ae0c/queries/getElementaiDecryptVardasPavarde/execute?preview=true',
  UPDATE_TRIP = 'api/v1/ontologies/ri.ontology.main.ontology.3a30bbf0-f1a2-401c-bd13-787b48766b99/actions/pavezejai-pakeisti-pavezejimo-busena-su-koordinatemis/apply',
  UPDATE_PATIENT_TRIP = 'api/v1/ontologies/ri.ontology.main.ontology.3a30bbf0-f1a2-401c-bd13-787b48766b99/actions/pavezejai-pakeisti-pavezejimo-elementu-busena-ir-koordinates/apply',
}

export enum TagColors {
  BLUE = 'blue',
  BROWN = 'brown',
  GREEN = 'green',
  PINK = 'pink',
  VIOLET = 'violet',
  ORANGE = 'orange',
  SKYBLUE = 'skyblue',
  GREY = 'grey',
}

export enum ServerErrorCodes {
  NOT_FOUND = 404,
  NO_PERMISSION = 401,
}

export enum Size {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export const stateTypes = {
  start: 'Pavėžėjimo pradžia',
  end: 'Pavėžėjimo pabaiga',
  tripStart: 'Kelionės pradžia',
  tripEnd: 'Kelionės pabaiga',
  decline: 'Asmuo neatvyko',
  new: 'Naujas',
  approved: 'Patvirtintas',
  assigned: 'Priskirtas vairuotojas',
};
