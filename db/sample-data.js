module.exports = [
  {
    requesting_server: 'server1',
    requested_server: 'server2',
    requesting_entity: '111',
    requested_entity: '222',
    description: 'some desc 1',
    has_resolved: false,
  },
  {
    requesting_server: 'server3',
    requested_server: 'server4',
    requesting_entity: '333',
    requested_entity: '444',
    description: 'some desc 2',
    has_resolved: true,
  },
  {
    requesting_server: 'server4',
    requested_server: 'server1',
    requesting_entity: '444',
    requested_entity: '111',
    description: 'some desc 3',
    has_resolved: false,
  },
];
