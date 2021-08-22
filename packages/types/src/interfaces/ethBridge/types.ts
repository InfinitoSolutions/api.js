// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

import type { Enum, Struct, U256, u16, u32, u64 } from '@polkadot/types';
import type { Address, H160, H256 } from '@polkadot/types/interfaces/runtime';

/** @name Erc20DepositEvent */
export interface Erc20DepositEvent extends Struct {
  readonly tokenAddress: EthAddress;
  readonly amount: U256;
  readonly beneficiary: Address;
}

/** @name EthAddress */
export interface EthAddress extends H160 {}

/** @name EthHash */
export interface EthHash extends H256 {}

/** @name EventClaimId */
export interface EventClaimId extends u64 {}

/** @name EventClaimResult */
export interface EventClaimResult extends Enum {
  readonly isValid: boolean;
  readonly isDataProviderErr: boolean;
  readonly isTxStatusFailed: boolean;
  readonly isUnexpectedContractAddress: boolean;
  readonly isNoTxLogs: boolean;
  readonly isNotEnoughConfirmations: boolean;
  readonly isUnexpectedData: boolean;
  readonly isExpired: boolean;
}

/** @name EventTypeId */
export interface EventTypeId extends u32 {}

/** @name NotarizationPayload */
export interface NotarizationPayload extends Struct {
  readonly eventClaimId: EventClaimId;
  readonly authorityIndex: u16;
  readonly result: EventClaimResult;
}

export type PHANTOM_ETHBRIDGE = 'ethBridge';
