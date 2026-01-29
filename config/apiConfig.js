module.exports = {
  api: {
    baseUrl: 'http://127.0.0.1:8900',
    endpoints: {
      booking: {
        base: '/booking',
        getById: (id) => `/booking/${id}`,
        create: '/booking',
        list: '/booking'
      },
      user: {
        base: '/user',
        getById: (id) => `/user/${id}`,
        create: '/user',
        list: '/user'
      }
    }
  }
};
