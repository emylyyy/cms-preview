import { Connection, FetchMode, LookupType } from './types';

export async function executeCmsRequest(connection: Connection, mode: FetchMode, lookupType: LookupType, value: string) {
  const start = Date.now();
  let endpoint = '';
  let headers: HeadersInit = { 'Content-Type': 'application/json' };
  let method = 'GET';

  if (mode === 'preview') {
    endpoint = connection.authoringBaseUrl.replace(/\/$/, '');
    if (connection.authoringAuthType === 'basic') {
      const creds = btoa(`${connection.authoringUsername}:${connection.authoringPassword}`);
      headers['Authorization'] = `Basic ${creds}`;
    } else if (connection.authoringAuthType === 'bearer') {
      headers['Authorization'] = `Bearer ${connection.authoringToken}`;
    }

    let template = '';
    if (lookupType === 'path') template = connection.authoringByPathTemplate;
    if (lookupType === 'id') template = connection.authoringByIdTemplate;
    
    if (!template) throw new Error(`No authoring template found for lookup type: ${lookupType}`);
    endpoint += template.replace('{{path}}', value).replace('{{id}}', value);
  } else {
    endpoint = connection.deliveryBaseUrl.replace(/\/$/, '') + (connection.deliveryBasePath.startsWith('/') ? '' : '/') + connection.deliveryBasePath;
    if (connection.deliveryAuthType === 'basic') {
      const creds = btoa(`${connection.deliveryUsername}:${connection.deliveryPassword}`);
      headers['Authorization'] = `Basic ${creds}`;
    } else if (connection.deliveryAuthType === 'bearer') {
      headers['Authorization'] = `Bearer ${connection.deliveryToken}`;
    } else if (connection.deliveryAuthType === 'apikey') {
      if (connection.deliveryApiKeyHeader) headers[connection.deliveryApiKeyHeader] = connection.deliveryApiKeyValue || '';
    }

    let template = '';
    if (lookupType === 'path') template = connection.deliveryByPathTemplate;
    if (lookupType === 'id') template = connection.deliveryByIdTemplate;
    if (lookupType === 'query') template = connection.deliveryByQueryTemplate;
    if (!template) throw new Error(`No delivery template found for lookup type: ${lookupType}`);

    const fullPath = template.replace('{{path}}', value).replace('{{id}}', value).replace('{{query}}', value);
    if(fullPath.startsWith('http')) endpoint = fullPath;
    else endpoint = `${endpoint}/${fullPath}`.replace(/([^:]\/)\/+/g, "$1");
  }

  try {
    const res = await fetch(endpoint, { method, headers, cache: 'no-store' });
    const durationMs = Date.now() - start;
    let data;
    const text = await res.text();
    try { data = JSON.parse(text); } catch(e) { data = { raw: text, note: "Response was not valid JSON" }; }
    return { success: res.ok, httpStatus: res.status, endpointUsed: endpoint, durationMs, data };
  } catch (error: any) {
    return { success: false, httpStatus: 0, endpointUsed: endpoint, durationMs: Date.now() - start, data: { error: error.message } };
  }
}