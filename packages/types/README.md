# @cennznet/types

10/07/2020]  1.0.3 version:
  - `@cennznet/api@1.0.3` (current stage) is working with [cennznet/cennznet:latest][cennznet/cennznet:latest];

Changes made in this version:

- Added AssetInfo types

[27/03/2020]  1.0.0 version:

 - `@cennznet/api@1.0.0` (current stage) is working with [cennznet/cennznet:latest][cennznet/cennznet:latest];

Changes made in this version:
 
- changed Address: 'AccountId'
- Support MultiSignature, registry, fee exchange, discontinue support to v1.

[17/01/2020] Proper document to be added when 1.0.0 final is releasing, here is a quick note:

- `@cennznet/types@0.20.7` is the last version working with `cennznet/cennznet:0.*.*`;
- `@cennznet/types@1.0.0-alpha.**`(current stage) is working with [cennznet/cennznet:1.0.0-rc1][cennznet/cennznet:1.0.0-rc1];
- `@cennznet/types@1.0.0-beta.**`(next stage) is planned to work with `cennznet/cennznet:1.0.0-rc2`(to be released);

Changes made in alpha version:

- Updated `Extrinsic` types
- Added `ChargeTransactionPayment` type, which contains `tip (default 0)` and `FeeExchange (default None)`;
- Changed dependencies from `@plugnet/api` to `@polkadot/types@0.96.1` (breaking changes were introduced in `@polkadot/types@0.97.1`, which could be upgraded in beta releases);

[cennznet/cennznet:1.0.0-rc1]: https://hub.docker.com/r/cennznet/cennznet/tags
