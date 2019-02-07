// Copyright 2017-2018 @polkadot/api authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import {KeyringPair} from '@polkadot/keyring/types';

import {AnyNumber, AnyU8a} from '@polkadot/types/types';
import {EventRecord, Extrinsic, ExtrinsicStatus, Hash, Method, SignedBlock} from '@polkadot/types';
import {TxOpt} from 'cennznet-types';
import {Api} from './Api';
import {SubmittableSendResult} from './types';
import filterEvents from './util/filterEvents';
import {SignatureOptions} from '@polkadot/types/ExtrinsicSignature';

export default class SubmittableExtrinsic extends Extrinsic {
    private _api: Api;

    constructor(api: Api, extrinsic: Extrinsic | Method) {
        super(extrinsic);

        this._api = api;
    }

    private trackStatus(statusCb: (result: SubmittableSendResult) => any): (status: ExtrinsicStatus) => Promise<void> {
        return async (status: ExtrinsicStatus): Promise<void> => {
            let events: Array<any> | undefined = undefined;

            if (status.type === 'Finalised') {
                const blockHash = status.value as Hash;
                const signedBlock: SignedBlock = await this._api.rpc.chain.getBlock(blockHash);
                const allEvents: Array<EventRecord> = (await this._api.query.system.events.at(blockHash)) as any;

                events = filterEvents(this.hash, signedBlock, allEvents);
            }

            statusCb({
                events,
                status,
                type: status.type,
            });
        };
    }

    public async send(txOpt?: TxOpt, statusCb?: (status: SubmittableSendResult) => any): Promise<Hash> {
        if (!this.isSigned) {
            if (!txOpt) {
                throw new Error('txOpt is required for signing extrinsic');
            }
            let nonce: AnyNumber = txOpt.nonce;
            if (nonce === undefined) {
                try {
                    nonce = (await this._api.query.system.accountNonce(txOpt.from)).toString();
                } catch (e) {
                    throw new Error('Failed to fetch nonce for account: ' + txOpt.from);
                }
            }
            const blockHash = txOpt.blockHash || this._api.genesisHash;
            await this._api.signer.sign(this, {...txOpt, nonce, blockHash});
        }
        if (!statusCb || !this._api.hasSubscriptions) {
            return this._api.rpc.author.submitExtrinsic(this);
        }

        return this._api.rpc.author.submitAndWatchExtrinsic(this, this.trackStatus(statusCb));
    }

    public sign(signerPair: KeyringPair, options: SignatureOptions): SubmittableExtrinsic {
        super.sign(signerPair, options);

        return this;
    }
}
