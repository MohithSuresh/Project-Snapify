# Using Snapatar in a Dummy Content Sharing Application 

This is a dummy content sharing application which utilizes Snapatar for fetching and updating user credentials after successful authentication through the Metamask Wallet.

## Getting Started

Clone the repository and setup the development environment:

```shell
yarn install && yarn start
```

The site will be visible on `http://localhost:5000`

## Interacting with the Dapp

Start by pressing the connect button in the top right corner. Connect to your Metamask Wallet if prompted, and then approve and install the snap.

### View your data
As soon as your account gets connected with the dapp, your user details will get loaded. You can view the same by clicking on your avatar.

![image](https://user-images.githubusercontent.com/97452093/217234052-34b626c4-802a-4228-9f99-1a87efe876c1.png)

All the data visible in the modal is being fetched by invoking the `getUserData` method.

```typescript
  let state: any = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
```
```typescript
  case 'getUserData':
      return state;
```

### Edit your data

You can also edit your credentials by pressing the edit button. 

![image](https://user-images.githubusercontent.com/97452093/217234220-62aa49f3-50f6-4f7d-9436-8297774e987d.png)

When you click save, the dapp invokes the `updateUserData` method to update the state of the snap.

```typescript
    case 'updateUserData':
      state = request.params;
      return await wallet.request({
        method: 'snap_manageState',
        params: ['update', state],
      });
```
