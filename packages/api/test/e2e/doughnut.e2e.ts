// Copyright 2020 Centrality Investments Limited
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

import {hexToU8a, assert} from '@polkadot/util';
import {CENNZnut as encodeCennznut} from '@cennznet/cennznut-wasm';
import {Doughnut as DoughnutMaker} from '@plugnet/doughnut-wasm';
import {Api} from '../../src/Api';
import {Keypair} from '@plugnet/util-crypto/types';
import {Keyring} from '@polkadot/api';
import {KeyringPair} from '@plugnet/keyring/types';
import initApiPromise from '../../../../jest/initApiPromise';
import {cryptoWaitReady} from '@plugnet/util-crypto';
import Doughnut from '@cennznet/types/Doughnut';

/// Helper for creating CENNZnuts which takes module/section name and method name to be same for doughnut permissioning
function makeCennznut(module: string, method: string): Uint8Array {
    const moduleVec = [
        [
            module, {
            'name': module,
            'methods': [
                [
                    method, {
                    'name': method,
                    'constraints': null,
                },
                ],
            ],
        },
        ],
    ];
    const contractVec = [];
    const cennznut = new encodeCennznut(moduleVec, contractVec);
    return cennznut.encode();
}

/// Helper for creating v0 Doughnuts where user can pass expiry time for doughnut to be valid and 'not before' which would mean doughnut is not applied before this block
function makeDoughnut(
    issuer: Keypair,
    holder: KeyringPair,
    permissions: Record<string, Uint8Array>,
) {
    const d = new DoughnutMaker(
        issuer.publicKey,
        holder.publicKey,
        (new Date().getTime()) * 10, // expiry set to tens time the current timestamp
        1, //notBefore
    );
    for (const key in permissions) {
        d.addDomain(key, permissions[key]);
    }
    d.signSr25519(new Uint8Array(issuer.secretKey));
    return d.encode();
}

describe('Doughnut for CennznetExtrinsic', () => {
    let aliceKeyPair = {
        secretKey: hexToU8a('0x98319d4ff8a9508c4bb0cf0b5a78d760a0b2082c02775e6e82370816fedfff48925a225d97aa00682d6a59b95b18780c10d7032336e88f3442b42361f4a66011'),
        publicKey: hexToU8a('0xd43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d'),
        address: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'
    };

    let api: Api;
    let bob, charlie, dave;

    beforeAll(async () => {
        api = await initApiPromise();
        await cryptoWaitReady();
        const keyring = new Keyring({type: 'sr25519'});
        bob = keyring.addFromUri('//Bob');
        charlie = keyring.addFromUri('//Charlie');
        dave = keyring.addFromUri('//Dave');
    });

    it('Delegates a GA transfer from alice to charlie when extrinsic is signed by bob', async done => {

        let doughnut = makeDoughnut(
            aliceKeyPair,
            bob,
            {'cennznet': makeCennznut('generic-asset', 'transfer')},
        );
        const CENNZ = 16000;
        const reciever = dave.address;
        const amount = 8767535;

        const tx = api.tx.genericAsset.transfer(CENNZ, reciever, amount);
        const doughnutB = new Doughnut(api.registry, doughnut);
        Doughnut.doughnutLength = doughnut.length;
        const opt = {doughnut: doughnutB};
        await tx.signAndSend(bob, opt as any, async ({events, status}) => {
            if (status.isFinalized) {
                events.forEach(({phase, event: {data, method, section}}) => {
                    console.log('\t', phase.toString(), `: ${section}.${method}`, data.toString());
                });
                const transfer = checkEventMatches(
                    {
                        allEvents: events,
                        method: 'Transferred',
                        section: 'genericAsset',
                        sender: aliceKeyPair.address,
                        reciever,
                        amount: amount.toString(),
                        asset: CENNZ.toString(),
                    });
                if (transfer != undefined) {
                    done();
                } else {
                    assert(true, 'false');
                }
            }
        });
    });


    function checkEventMatches({allEvents, method, section, sender, reciever, amount, asset}) {
        if (method === 'Transferred') {
            return allEvents.find(
                event => (
                    event.event.data.method === method &&
                    event.event.data.section === section &&
                    event.event.data[1].toString() === sender &&
                    event.event.data[0].toString() === asset &&
                    event.event.data[2].toString() === reciever &&
                    event.event.data[3].toString() === amount
                ),
            );
        } else if (method === 'Minted') {
            return allEvents.find(
                event => (
                    event.event.data.method === method &&
                    event.event.data.section === section &&
                    event.event.data[1].toString() === reciever &&
                    event.event.data[0].toString() === asset &&
                    event.event.data[2].toString() === amount
                ),
            );
        }
    }

    it('Fails when charlie uses bob\'s doughnut and works well when bob uses it', async done => {
        let doughnut = await makeDoughnut(
            aliceKeyPair,
            bob,
            {'cennznet': makeCennznut('generic-asset', 'transfer')},
        );
        const doughnutB = new Doughnut(api.registry, doughnut);
        Doughnut.doughnutLength = doughnut.length;
        const opt = {doughnut: doughnutB};
        const tx = api.tx.genericAsset.transfer(16001, charlie.address, 10000);

        await expect(tx.signAndSend(charlie, opt as any, () => {
        })).rejects.toThrow('submitAndWatchExtrinsic(extrinsic: Extrinsic): ExtrinsicStatus:: 1010: Invalid Transaction: {"Custom":180}');

        // Signed by bob
        await tx.signAndSend(bob, opt as any, async ({events, status}) => {
            if (status.isFinalized) {
                const transfer = checkEventMatches(
                    {
                        allEvents: events,
                        method: 'Transferred', section: 'genericAsset',
                        sender: aliceKeyPair.address,
                        reciever: charlie.address,
                        amount: '10000',
                        asset: '16001',
                    });
                if (transfer != undefined) {
                    done();
                }
            }
        });
    });

    it('fails when cennznut does not authorize the extrinsic method', async (done) => {
        let doughnut = await makeDoughnut(
            aliceKeyPair,
            bob,
            {'cennznet': makeCennznut('generic-asset', 'mint')},
        );
        const doughnutB = new Doughnut(api.registry, doughnut);
        Doughnut.doughnutLength = doughnut.length;
        const opt = {doughnut: doughnutB};
        const tx = api.tx.genericAsset.transfer(16001, charlie.address, 10000);
        await new Promise(async (resolve, reject) => {
            await tx.signAndSend(bob, opt as any, async ({events, status}) => {
                if (status.isFinalized) {
                    const failed = events.find(event => event.event.data.method === 'ExtrinsicFailed');
                    if (failed == undefined) {
                        assert(false, 'expected extrinsic to fail');
                    }
                    resolve();
                }
            });
        });
        // works fine for authorize extrinsic method
        const extrinsic = api.tx.genericAsset.mint(16001, charlie.address, 10000);
        await extrinsic.signAndSend(bob, opt as any, async ({events, status}) => {
            if (status.isFinalized) {
                const transfer = checkEventMatches(
                    {
                        allEvents: events,
                        method: 'Minted',
                        section: 'genericAsset',
                        sender: aliceKeyPair.address,
                        reciever: charlie.address,
                        amount: '10000',
                        asset: '16001',
                    });
                if (transfer != undefined) {
                    done();
                } else {
                    assert(true, 'false');
                }
            }
        });

    });

    it('fails when cennznut does not authorize the extrinsic module', async (done) => {
        let badDoughnut = await makeDoughnut(
            aliceKeyPair,
            bob,
            {'cennznet': makeCennznut('balance', 'transfer')},
        );

        const tx = api.tx.genericAsset.transfer(16001, charlie.address, 10000);
        const doughnutB = new Doughnut(api.registry, badDoughnut);
        Doughnut.doughnutLength = badDoughnut.length;
        const opt = {doughnut: doughnutB};

        await new Promise(async (resolve, reject) => {
            await tx.signAndSend(bob, opt as any, async ({events, status}) => {
                if (status.isFinalized) {
                    const failed = events.find(event => event.event.data.method === 'ExtrinsicFailed');
                    if (failed == undefined) {
                        assert(false, 'expected extrinsic to fail');
                    }
                    resolve();
                }
            });
        });

        // works well with good doughnut
        let goodDoughnut = await makeDoughnut(
            aliceKeyPair,
            bob,
            {'cennznet': makeCennznut('generic-asset', 'transfer')},
        );
        const doughnutG = new Doughnut(api.registry, goodDoughnut);
        Doughnut.doughnutLength = goodDoughnut.length;
        const txPayload = {doughnut: doughnutG};

        await tx.signAndSend(bob, txPayload as any, async ({events, status}) => {
            if (status.isFinalized) {
                const transfer = checkEventMatches(
                    {
                        allEvents: events,
                        method: 'Transferred',
                        section: 'genericAsset',
                        sender: aliceKeyPair.address,
                        reciever: charlie.address,
                        amount: '10000',
                        asset: '16001',
                    });
                if (transfer != undefined) {
                    done();
                }
            }
        });

    });
});

