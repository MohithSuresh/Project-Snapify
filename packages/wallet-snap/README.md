
# SnapaMoto Bitcoin snap

Snapamoto allows users to send Bitcoin transactions via the MetaMask wallet extension. This is achieved by sharing the user's public key and validating the transaction over the blockchain network.

## Accomplishment:

This snap allows for the control of non-EVM accounts and assets within MetaMask. It can derive BIP-32 key pairs based on the secret recovery phrase without exposing it. This gives developers the ability to build snaps that support various blockchain protocols and integrate non-EVM tokens, such as BTC, into their browser dashboards using snaps. This is made possible through the use of the snap_getBip32Entropy entropy.

## Explanation:

### 1. Guide: 

To use the snap, connect the website to the MetaMask Flask and install the snap dependencies. Then, select the Bitcoin Download button.


### 2. Backend process: 

To initiate a Bitcoin transaction, the system uses a Bip32PublicKey. It converts the single address to a p2wpkh segwit key, generating a segwit address. In this example, the testnet API URL is used, but it can be extended to any URL. The system retrieves balance and transaction data and returns it to the front end.

To send the Bitcoin, the private key must be retrieved from MetaMask. The system fetches the unspent transaction output (utxo) from the API URL and checks if the user has sufficient balance. The fees are calculated using a dummy transaction. The transaction's validity is then verified.

After receiving confirmation from the MetaMask wallet, the transaction is posted to a public node validator, and the response is returned. It should be noted that Bitcoin transactions typically take 10 minutes to process and will be confirmed in the next block.


## SnapaMoto 2.0 : Phase 2 Implementation

### Enables the integration of other coins.
### Utilizes BIP-32 to generate multiple addresses for the user.

