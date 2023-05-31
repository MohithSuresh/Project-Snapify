# Snapatar Game snap

Snapatar for gaming enables developers to bring their web2 games to web3 and create an interconnected ecosystem of games that support sharing of assets and progression using NFTs, while also maintaining anonymity. 
## Snapatar for gaming adds the following functionalities:
### 1. Shared Accounts: 
We introduce the concept shared account. It is utilizing `snap_manageState` the ability to store data locally in the metamask wallet to support in app logins, that store fundamental information for the user.
### 2. Mutable Player Data sharing:
Developers can use this to easily facilitate sharing and managing of mutable data, such as player progression, inventory and stats. that is authorised by owning an nft that holds the key to unlock the encoded data. This enables anonymous sharing of player data while also maintaining full security. The mutable data is stored in a database and the NFT holder holds the key to unlock that data. This method ensures that data can be shared without introducing duplicacy while also ensuring usablitiy and security. Even when the mutable data is changed, the key remains the same, enabling modification of data live, while also maintaining anonymity.
### 3. Immutable asset sharing: 
We implement a system to make it trivial for developers to integrate sharing and owning of in game assets, cosmetics or collectibles in their existing web2 game. This is done by mapping each asset to a key, and then storing them as NFTs. This paves way for building the economy of the metaverse.


We also utilize Metamask snaps features such as `onTransaction` and `snap_confirm` to provide information to the user and make the entire experience more user friendly and enable developers to send custom messages to the user.


## Snapatar2.0: Phase 2 implementation
### 1. Megafunction:
We plan to ease the process of integrating games to our snap by creating a single function that minimizes the complexity on the game side of the applicaiton, we do this by passing each method and parameter as a base64 encoded string, then decoding it on the snap side.

### 2. Custom UI:
Utilizing upcoming snaps features to create custom UI, we plan to use the `snap_dialog` feature to implement user side `prompts`. This helps to make the entire user experience more consistent across all apps in the ecosystem.
