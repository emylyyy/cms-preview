export interface Connection {
  id: string;
  name: string;
  deliveryBaseUrl: string;
  deliveryBasePath: string;
  deliveryAuthType: 'none' | 'basic' | 'bearer' | 'apikey';
  deliveryUsername?: string;
  deliveryPassword?: string;
  deliveryToken?: string;
  deliveryApiKeyHeader?: string;
  deliveryApiKeyValue?: string;
  authoringBaseUrl: string;
  authoringAuthType: 'none' | 'basic' | 'bearer';
  authoringUsername?: string;
  authoringPassword?: string;
  authoringToken?: string;
  previewSecret: string;
  authoringByPathTemplate: string;
  authoringByIdTemplate: string;
  deliveryByPathTemplate: string;
  deliveryByIdTemplate: string;
  deliveryByQueryTemplate: string;
}

export type FetchMode = 'live' | 'preview';
export type LookupType = 'path' | 'id' | 'query';

export interface FetchRequest {
  connectionId: string;
  mode: FetchMode;
  lookupType: LookupType;
  value: string;
}

export interface FetchResponse {
  success: boolean;
  endpointUsed: string;
  durationMs: number;
  httpStatus: number;
  data: any;
  error?: string;
}