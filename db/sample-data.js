module.exports = [
  {
    sourceServer: 'server1',
    targetServer: 'server2',
    sourceEntity: {
      bla: "blu"
    },
    targetEntity: {
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
    sourceChangeType: 'modify',
    targetChangeType: 'delete',
    description: 'some desc 1',
    hasResolved: false,
  },
  {
    sourceServer: 'server3',
    targetServer: 'server4',
    sourceEntity: {
      numnum: '123'
    },
    targetEntity: {
      numnum: '777'
    },
    sourceChangeType: 'delete',
    targetChangeType: 'none',
    description: 'some desc 2',
    hasResolved: true,
  },
  {
    sourceServer: 'server4',
    targetServer: 'server1',
    sourceEntity: {
      numnum: '444'
    },
    targetEntity: {
      numnum: '111'
    },
    sourceChangeType: 'create',
    targetChangeType: 'create',
    description: 'some desc 3',
    hasResolved: false,
  },
];
