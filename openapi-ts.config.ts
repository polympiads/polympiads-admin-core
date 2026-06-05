// openapi-ts.config.ts
export default {
  input: ['./openapi/drf.json', './openapi/auth.json'],
  output: 'src/client',
  plugins: ['@hey-api/client-fetch'],
};