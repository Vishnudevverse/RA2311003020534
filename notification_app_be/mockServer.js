const endpoints = [
  {
    method: 'GET',
    path: '/notifications',
    description: 'Return notification list',
  },
  {
    method: 'PATCH',
    path: '/notifications/:id',
    description: 'Update notification read state',
  },
]

const auth = {
  type: 'Bearer',
  token: 'campus-static-token',
}

export { endpoints, auth }
