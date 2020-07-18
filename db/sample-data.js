module.exports = [
  {
    source_server: 'server1',
    target_server: 'server2',
    source_entity: {
      bla: "blu"
    },
    target_entity: {
      "elements": [
        {
          "type": "way",
          "id": 5123563,
          "timestamp": "2019-09-04T15:05:00Z",
          "version": 7,
          "changeset": 74092935,
          "user": "Jonaes",
          "uid": 4433367,
          "nodes": [
            35352060,
            35352061,
            35352062,
            35352063,
            2056819178,
            35352001
          ],
          "tags": {
            "bicycle": "yes",
            "foot": "yes",
            "highway": "track",
            "horse": "yes",
            "lcn": "yes",
            "motor_vehicle": "agricultural;forestry",
            "surface": "asphalt",
            "tracktype": "grade1",
            "traffic_sign": "DE:260,DE:1026-36"
          }
        }
      ]
    },
    source_change_type: 'modify',
    target_change_type: 'delete',
    description: 'some desc 1',
    has_resolved: false,
  },
  {
    source_server: 'server3',
    target_server: 'server4',
    source_entity: {
      numnum: '123'
    },
    target_entity: {
      numnum: '777'
    },
    source_change_type: 'delete',
    target_change_type: 'none',
    description: 'some desc 2',
    has_resolved: true,
  },
  {
    source_server: 'server4',
    target_server: 'server1',
    source_entity: {
      numnum: '444'
    },
    target_entity: {
      numnum: '111'
    },
    source_change_type: 'create',
    target_change_type: 'create',
    description: 'some desc 3',
    has_resolved: false,
  },
];
