import {EnumType} from '@polkadot/types';
import PermissionsV1 from './PermissionsV1';

export default class PermissionVersioned extends EnumType<PermissionsV1> {
    constructor(values: any) {
        super({PermissionsV1}, values);
    }
}
