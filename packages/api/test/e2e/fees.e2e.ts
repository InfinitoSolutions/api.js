// Copyright 2019 Centrality Investments Limited
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

// Will add to this file once we have fee part implemented at node side

// import {ApiRx, SubmittableResult} from '@cennznet/api';
// import {SimpleKeyring, Wallet} from '@cennznet/wallet';
// import testingPairs from '@polkadot/keyring/testingPairs';
// import {Vec} from '@polkadot/types';
// import {EventRecord} from '@polkadot/types/interfaces';
//
// import {Api} from '../../src/Api';
// import {cryptoWaitReady} from '@plugnet/util-crypto';
//
// const sender = {
//     address: '5DXUeE5N5LtkW97F2PzqYPyqNkxqSWESdGSPTX6AvkUAhwKP',
//     uri: '//cennznet-js-test',
// };
//
// describe('fees in cennznet', () => {
//     let api: Api;
//     let keyring;
//
//     beforeAll(async () => {
//         await cryptoWaitReady();
//         api = await Api.create({provider: 'ws://localhost:9944'});
//         const simpleKeyring: SimpleKeyring = new SimpleKeyring();
//         simpleKeyring.addFromUri(sender.uri);
//         const wallet = new Wallet();
//         await wallet.createNewVault('');
//         await wallet.addKeyring(simpleKeyring);
//         keyring = testingPairs({type: 'sr25519'});
//         api.setSigner(wallet);
//     });
//
//     describe('extrinsic.fee()', () => {
//         it('fee estimate', async done => {
//             const tx = api.tx.genericAsset.create({
//                 initialIssuance: 100,
//             });
//             const calculatedFee = await tx.fee(sender.address);
//             await tx.signAndSend(sender.address, async ({events, status}) => {
//               if (status.isFinalized && events !== undefined) {
//                 const blockHash = status.asFinalized;
//                 const events = ((await api.query.system.events.at(blockHash)) as unknown) as Vec<EventRecord>;
//                 const feeChargeEvent = events.find(event => event.event.data.method === 'Charged');
//                 const realFee = feeChargeEvent.event.data[1];
//                 expect(realFee.toString()).toEqual(calculatedFee.toString());
//                 done();
//               }
//             });
//         });
//
//         it('fee estimate Transfer', async done => {
//             const tx = api.tx.genericAsset.transfer(16000, sender.address, 1000000);
//             const calculatedFee = await tx.fee(sender.address);
//             await tx.signAndSend(sender.address, async ({events, status}) => {
//               if (status.isFinalized && events !== undefined) {
//                 const blockHash = status.asFinalized;
//                 const events = ((await api.query.system.events.at(blockHash)) as unknown) as Vec<EventRecord>;
//                 const feeChargeEvent = events.find(event => event.event.data.method === 'Charged');
//                 const realFee = feeChargeEvent.event.data[1];
//                 expect(realFee.toString()).toEqual(calculatedFee.toString());
//                 done();
//               }
//             });
//         });
//     });
// });

// describe('fees in cennznet (Rxjs)', () => {
//     let api: ApiRx;
//     let keyring;
//
//     beforeAll(async () => {
//         api = await ApiRx.create({provider: 'ws://localhost:9944'}).toPromise();
//         const simpleKeyring: SimpleKeyring = new SimpleKeyring();
//         simpleKeyring.addFromUri(sender.uri);
//         const wallet = new Wallet();
//         await wallet.createNewVault('');
//         await wallet.addKeyring(simpleKeyring);
//         keyring = testingPairs({type: 'sr25519'});
//         api.setSigner(wallet);
//     });
//
//     describe('extrinsic.fee()', () => {
//         it('fee estimate', async done => {
//             const tx = api.tx.genericAsset.create({
//                 initialIssuance: 100,
//             });
//             const calculatedFee = await tx.fee(sender.address).toPromise();
//             tx.signAndSend(sender.address).subscribe(async ({events, status}: SubmittableResult) => {
//               if (status.isFinalized && events !== undefined) {
//                 const blockHash = status.asFinalized;
//                 const events = ((await api.query.system.events.at(blockHash).toPromise()) as unknown) as Vec<
//                   EventRecord
//                   >;
//                 const feeChargeEvent = events.find(event => event.event.data.method === 'Charged');
//                 const realFee = feeChargeEvent.event.data[1];
//                 expect(realFee.toString()).toEqual(calculatedFee.toString());
//                 done();
//               }
//             });
//         });
//     });
// });
