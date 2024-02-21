export default {
  // Endpoints
  loginEndpoint: 'http://127.0.0.1:8000/api/login',
  registerEndpoint: 'http://127.0.0.1:8000/api/register',
  refreshEndpoint: 'http://127.0.0.1:8000/api/jwt/refresh-token',
  logoutEndpoint: 'http://127.0.0.1:8000/api/logout',

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: 'Bearer',

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKeyName: 'accessToken',
  storageRefreshTokenKeyName: 'refreshToken',
}
