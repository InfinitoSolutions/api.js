// Copyright 2020-2021 Centrality Investments Limited
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Keyring } from '@polkadot/keyring';
import { blake2AsHex, cryptoWaitReady } from '@polkadot/util-crypto';
import { stringToU8a } from '@polkadot/util'

import initApiPromise from '../../../../jest/initApiPromise';

let api;
const keyring = new Keyring({ type: 'sr25519' });
let alice;
let collectionOwner, tokenOwner;

beforeAll(async done => {
  await cryptoWaitReady();
  api = await initApiPromise();
  // alice is sudo
  alice = keyring.addFromUri('//Alice');

  collectionOwner = keyring.addFromUri('//Test//CollectionOwner');
  tokenOwner = keyring.addFromUri('//Test//TokenOwner');
  // Fund accounts
  const spendingId = await api.query.genericAsset.spendingAssetId();
  const initialEndowment = 100_000_000;

  await api.tx.utility.batch([
      api.tx.genericAsset
    .mint(spendingId, collectionOwner.address, initialEndowment),
      api.tx.genericAsset
    .mint(spendingId, tokenOwner.address, initialEndowment),
  ]).signAndSend(alice, ({ status }) => status.isInBlock ? done() : null);
});

afterAll(async () => {
  await api.disconnect();
});

describe('NFTs', () => {
  let collectionId;
  let schema;

  beforeAll(() => {
    // setup test collection
    collectionId = 'example-collection';
    schema = [
      ['name', 'text'],
      ['fingerprint', 'hash'],
      ['created', 'timestamp']
    ];
  });

  it('create collection', async done => {
    await api.tx.nft.createCollection(collectionId, schema, null).signAndSend(collectionOwner, async ({ status, events }) => {
      if (status.isInBlock) {
        events.forEach(({phase, event: {data, method, section}}) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
        expect((await api.query.nft.collectionOwner(collectionId)).toString()).toBe(collectionOwner.address);
        done();
      }
    });
  });

  it('create token', async done => {
    const attributes = [
      {'Text': 'hello world'},
      {'Hash': blake2AsHex(stringToU8a('hello world'))},
      {'Timestamp': 12345}
    ];

    await api.tx.nft.createToken(collectionId, tokenOwner.address, attributes, null).signAndSend(collectionOwner, async ({ status, events }) => {
      if (status.isInBlock) {
        events.forEach(({phase, event: {data, method, section}}) => {
          console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
        });
        // first token has id 0
        let token = (await api.query.nft.tokens(collectionId, 0));
        expect(token.toJSON()).toEqual(attributes);
        expect((await api.query.nft.tokenOwner(collectionId, 0)).toString()).toBe(tokenOwner.address);
        done();
      }
    });
  });

  it('finds collected tokens', async () => {
    expect(await api.rpc.nft.collectedTokens(collectionId, tokenOwner.address)).toBe([0]);
  });

});
