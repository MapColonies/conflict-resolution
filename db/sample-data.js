module.exports = [
  {
    source_server: 'server1',
    target_server: 'server2',
    source_entity: {
      glossary: {
        title: 'example glossary',
        GlossDiv: {
          title: 'S',
          GlossList: {
            GlossEntry: {
              ID: 'SGML',
              SortAs: 'SGML',
              GlossTerm: 'Standard Generalized Markup Language',
              Acronym: 'SGML',
              Abbrev: 'ISO 8879:1986',
              GlossDef: {
                para:
                  'A meta-markup language, used to create markup languages such as DocBook.',
                GlossSeeAlso: ['GML', 'XML'],
              },
              GlossSee: 'markup',
            },
          },
        },
      },
    },
    target_entity: {
      "version": "0.6",
      "generator": "CGImap 0.8.1 (6263 thorn-01.openstreetmap.org)",
      "copyright": "OpenStreetMap and contributors",
      "attribution": "http://www.openstreetmap.org/copyright",
      "license": "http://opendatacommons.org/licenses/odbl/1-0/",
      "elements": [
        {
          "type": "node",
          "id": 35352001,
          "lat": 50.2106234,
          "lon": 8.5856189,
          "timestamp": "2012-12-08T23:04:02Z",
          "version": 6,
          "changeset": 14206963,
          "user": "HoloDuke",
          "uid": 75317
        },
        {
          "type": "node",
          "id": 35352063,
          "lat": 50.2121617,
          "lon": 8.5867523,
          "timestamp": "2018-11-21T20:52:44Z",
          "version": 4,
          "changeset": 64755187,
          "user": "Jonaes",
          "uid": 4433367
        },
        {
          "type": "node",
          "id": 6772305769,
          "lat": 50.2106895,
          "lon": 8.5857061,
          "timestamp": "2019-09-04T15:05:00Z",
          "version": 1,
          "changeset": 74092935,
          "user": "Jonaes",
          "uid": 4433367,
          "tags": {
            "bicycle": "yes",
            "information": "guidepost",
            "ref": "OU.425.1",
            "tourism": "information"
          }
        },
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
        },
        {
          "type": "relation",
          "id": 10000000,
          "timestamp": "2019-09-18T18:21:44Z",
          "version": 2,
          "changeset": 74641141,
          "user": "HoloDuke",
          "uid": 75317,
          "members": [
            {
              "type": "node",
              "ref": 6772305769,
              "role": "sign"
            },
            {
              "type": "node",
              "ref": 35352001,
              "role": "intersection"
            },
            {
              "type": "way",
              "ref": 5123563,
              "role": "to"
            }
          ],
          "tags": {
            "bicycle": "yes",
            "colour:arrow": "green",
            "colour:back": "white",
            "colour:text": "green",
            "destination": "Friedrichsdorf;Bad Homburg",
            "destination:symbol": ";train_station",
            "distance": "8.0;4.6",
            "type": "destination_sign"
          }
        }
      ]
    },
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
    description: 'some desc 3',
    has_resolved: false,
  },
];
