/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';
/* eslint-env mocha */
const assert = require('assert');
const {
  generateTraceEvents,
  createTraceString,
} = require('../../lib/timing-trace-saver');


const mockEntries = [{
  startTime: 650,
  name: 'lh:init:config',
  duration: 210,
  entryType: 'measure',
},
{
  startTime: 870,
  name: 'lh:runner:run',
  duration: 120,
  entryType: 'measure',
},
{
  startTime: 990,
  name: 'lh:runner:auditing',
  duration: 750,
  entryType: 'measure',
},
{
  startTime: 1010,
  name: 'lh:audit:is-on-https',
  duration: 10,
  entryType: 'measure',
},
];
const expectedTrace = {
  traceEvents: [{
    name: 'lh:init:config',
    cat: 'measure',
    ts: 650000,
    dur: 210000,
    args: {},
    pid: 'Lighthouse',
    tid: 'measures',
    ph: 'X',
    id: '0x0',
  },
  {
    name: 'lh:runner:run',
    cat: 'measure',
    ts: 870000,
    dur: 120000,
    args: {},
    pid: 'Lighthouse',
    tid: 'measures',
    ph: 'X',
    id: '0x1',
  },
  {
    name: 'lh:runner:auditing',
    cat: 'measure',
    ts: 990000,
    dur: 750000,
    args: {},
    pid: 'Lighthouse',
    tid: 'measures',
    ph: 'X',
    id: '0x2',
  },
  {
    name: 'lh:audit:is-on-https',
    cat: 'measure',
    ts: 1010000,
    dur: 10000,
    args: {},
    pid: 'Lighthouse',
    tid: 'measures',
    ph: 'X',
    id: '0x3',
  },
  ],
};


describe('generateTraceEvents', () => {
  it('generates a single trace event', () => {
    const event = generateTraceEvents(mockEntries.slice(0, 1));
    assert.deepStrictEqual(event, expectedTrace.traceEvents.slice(0, 1));
  });

  it('doesn\'t allow overlapping events', () => {
    const overlappingEntries = [{
      startTime: 10,
      name: 'overlap1',
      duration: 100,
      entryType: 'measure',
    },
    {
      startTime: 30,
      name: 'overlap2',
      duration: 100,
      entryType: 'measure',
    },
    ];
    assert.throws(_ => generateTraceEvents(overlappingEntries), /measures overlap/);
  });
});

describe('createTraceString', () => {
  it('creates a real trace', () => {
    const jsonStr = createTraceString({
      timing: {
        entries: mockEntries,
      },
    });
    const traceJson = JSON.parse(jsonStr);
    assert.deepStrictEqual(traceJson, expectedTrace);
  });
});
