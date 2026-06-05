
import { client } from '../client/client.gen';

client.setConfig({
  baseUrl: 'http://localhost:8000',
});

client.interceptors.request.use((request) => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.set('Authorization', `Token ${token}`);
  }
  return request;
});
