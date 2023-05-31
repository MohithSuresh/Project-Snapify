import { FunctionComponent, ReactNode, useContext } from 'react';
import styled from 'styled-components';
import { Footer, Header } from './components';

import { GlobalStyle } from './config/theme';
import { ToggleThemeContext } from './Root';
import Unity, { UnityContext } from 'react-unity-webgl';
import React, { useState, useEffect, Component } from 'react';

import {
  connectSnap,
  getAccountDetails,
  setAccountDetails,
  getSnap,
  sendHello,
  transferNFT,
  mintNFT,
  getNFTs,
} from './utils';
import { db } from './utils/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore/lite';
import { element } from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  max-width: 100vw;
`;

export type AppProps = {
  children: ReactNode;
};

const unityContext = new UnityContext({
  loaderUrl: 'Game/newBuild.loader.js',
  dataUrl: 'Game/newBuild.data',
  frameworkUrl: 'Game/newBuild.framework.js',
  codeUrl: 'Game/newBuild.wasm',
});
// function App() {
//   return <Unity unityContext={unityContext} />;
// }
var nftDetails = {
  AssetItem: [{}],
};
var AssetItem: never[] = [];

var ProgressionDetails = {
  ProgressionItem: [{}],
};
var progressionItem: never[] = [];
export const App: FunctionComponent<AppProps> = ({ children }) => {
  const toggleTheme = useContext(ToggleThemeContext);
  const [data, setdata] = useState('');

  useEffect(function () {
    unityContext.on('debug', function (message) {
      console.log(message);
    });
  }, []);

  useEffect(function () {
    unityContext.on('ConnectToMetamask', async function () {
      console.log('hi');
      connectSnap();
    });
  }, []);
  useEffect(function () {
    unityContext.on('PushAccountDetails', async function (s) {
      console.log('pushing details');
      console.log(s);
      // setdata(s);
      setAccountDetails(s);
    });
  }, []);
  useEffect(function () {
    unityContext.on('AskForAccountDetails', async function () {
      console.log('unity asked for account details');

      let response: any = await getAccountDetails();
      console.log('response');
      console.log(response);

      unityContext.send('ItemContainer', 'GetAccountDetails', response.book);
    });
  }, []);
  useEffect(function () {
    unityContext.on('AskForAllProgression', async function () {
      console.log('unity asked for all progression details');

      const nfts = getNFTs();
      const result = await nfts;
      ProgressionDetails.ProgressionItem = [];
      const res = await function (result: any) {
        return new Promise(async (resolve) => {
          for (const element of result) {
            const docRef = doc(db, 'data', element.tokenURI);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              ProgressionDetails.ProgressionItem.push({
                key: element.tokenURI,
                tokenID: element.tokenId,
                level: docSnap.data().level,
                money: docSnap.data().money,
              });
              console.log('Document data:', ProgressionDetails.ProgressionItem);
            }
          }
          resolve(ProgressionDetails);
        });
      };
      res(result).then((fin) => {
        unityContext.send(
          'ProgressionManager',
          'ReceiveAllProgression',
          JSON.stringify(fin),
        );
      });
    });
  }, []);
  useEffect(function () {
    unityContext.on(
      'CreateAcc',
      async function (uri: string, level: number, money: number) {
        await mintNFT(uri);
        await setDoc(doc(db, 'data', uri), {
          level,
          money,
        });
      },
    );
  }, []);
  useEffect(function () {
    unityContext.on(
      'UpdateAcc',
      async function (uri: string, level: number, money: number) {
        await updateDoc(doc(db, 'data', uri), {
          level,
          money,
        });
      },
    );
  }, []);
  useEffect(function () {
    unityContext.on('GetAcc', async function (uri: string) {
      // await updateDoc(doc(db, 'data', uri), {
      //   level,
      //   money,
      // });
    });
  }, []);

  useEffect(function () {
    unityContext.on('AskForAssetNFTs', async function () {
      console.log('nuity asked for asset NFT details');
      let response = getNFTs();
      nftDetails.AssetItem = AssetItem;
      nftDetails.AssetItem = [];
      response.then((result) => {
        console.log(result);
        result.forEach((element: any) =>
          nftDetails.AssetItem.push({
            key: element.tokenURI,
            tokenID: element.tokenId,
          }),
        );
        // let details = JSON.stringify(nftDetails);
        console.log('PP');
        console.log(JSON.stringify(nftDetails));
        unityContext.send(
          'assetListContainer',
          'ReceiveAssetNFTs',
          JSON.stringify(nftDetails),
        );
      });

      // let response = await getAssetDetails();
    });
  }, []);
  // \"{\"AssetItem\":[{\"key\":\"abcdedffsdgdfsguhdefiuyg\",\"tokenID\":1},{\"key\":\"s\",\"tokenID\":5},{\"key\":\"sed lol\",\"tokenID\":6},{\"key\":\"0\",\"tokenID\":7},{\"key\":\"1\",\"tokenID\":8},{\"key\":\"2\",\"tokenID\":9},{\"key\":\"0\",\"tokenID\":10},{\"key\":\"1\",\"tokenID\":11},{\"key\":\"2\",\"tokenID\":12}]}
  useEffect(function () {
    unityContext.on('SendTxn', async function (r, s) {
      console.log('nuity asked to snd nft');
      console.log(r);
      console.log(s);
      transferNFT('0xFa372aA180664647A579B940a6760Bd13ecd8aDb', s);
      // s can be id of asset or URI
      // let response = await getAssetDetails();
      // unityContext.send(\"assetListContainer", "ReceiveAssetNFTs", response);
    });
  }, []);

  return (
    <Unity
      unityContext={unityContext}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <Header handleToggleClick={toggleTheme} />
        {children}
        <Footer />
      </Wrapper>
    </>
  );
};
