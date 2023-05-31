import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';

const config = {
  apiKey: 'AIzaSyDDfxepNZrUOL53F81Mc3Rawd-rA3JTWJU',
  authDomain: 'cgl-game.firebaseapp.com',
  databaseURL:
    'https://cgl-game-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'cgl-game',
  storageBucket: 'cgl-game.appspot.com',
  messagingSenderId: '594673839073',
  appId: '1:594673839073:web:e202e5c98ef2c9475740a0',
  measurementId: 'G-XKDGYKLH5B',
};

export const app = initializeApp(config);

export const db = getFirestore(app);

export async function getCities() {
  const citiesCol = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map((doc) => doc.data());
  return cityList;
}
