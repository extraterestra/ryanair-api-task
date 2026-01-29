module.exports = {
  error: {
    keys: ['message', 'errors'],
    detailKeys: ['message', 'location'],
    locationKeys: ['in', 'name', 'docPath', 'path']
  },
  booking: {
    keys: ['id', 'date', 'destination', 'origin', 'userId']
  },
  user: {
    keys: ['id', 'name', 'surname', 'email']
  }
};
