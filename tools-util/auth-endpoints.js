const endpoints = {
  login: appKey => ({
    path: '/candyAdmin/v1/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Accept: 'application/json',
      'Accept-Charset': 'utf-8',
      Authorization: `Bearer ${appKey}`
    },
    body: 'grant_type=client_credentials'
  }),
  logout: accessToken => ({
    path: '/candyAdmin/v1/logout',
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: '{}'
  }),
  refresh: accessToken => ({
    path: '/candyAdmin/v1/refresh',
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: '{}'
  })
};

module.exports = {
  ...endpoints
};
