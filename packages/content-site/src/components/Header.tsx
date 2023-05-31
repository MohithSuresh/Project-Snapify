import { useContext, useState } from 'react';
import styled from 'styled-components';
import { defaultSnapOrigin } from '../config';
import { MetamaskActions, MetaMaskContext } from '../hooks';
import { connectSnap, getSnap } from '../utils';
import { AccountBox } from './AccountBox';
import { HeaderButtons } from './Buttons';

const HeaderWrapper = styled.header`
  height: 60px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  padding: 0.5rem;
  background-color: #ffffff;
  position: fixed;
  z-index: 3;
`;

const Title = styled.p`
  font-size: ${(props) => props.theme.fontSizes.title};
  font-weight: bold;
  margin: 0;
  margin-left: 1.2rem;
  color: rgb(246, 133, 27);
  background: linear-gradient(
    to right,
    rgb(138, 66, 173) 0%,
    rgb(103, 98, 235) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AccountButton = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  border-radius: 12px;
  padding: 0.5rem 1rem;
  color: #333333;

  & div {
    width: 40px;
    height: 40px;
    overflow: hidden;
    border-radius: 6px;
  }

  & img {
    width: 100px;
    margin: -5px -25px 0px -25px;
    border-radius: 6px;
    border: none;
    object-fit: cover;
  }

  & > span {
    color: #333333;
    font-weight: bold;
  }
`;

const FloatButton = styled.div`
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 3;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 1);
  border-radius: 12px;
  border: none;
  color: #333333;
  background-color: white;
`;

export const Header = () => {
  const [state, dispatch] = useContext(MetaMaskContext);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [showAccountBox, setAccountBox] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);

  const fetchUserData = async () => {
    try {
      const response = await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'getUserData',
          },
        ],
      });
      setUserData(response);
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const handleConnectClick = async () => {
    try {
      await connectSnap(`local:http://localhost:8070`);
      const installedSnap = await getSnap();

      dispatch({
        type: MetamaskActions.SetInstalled,
        payload: installedSnap,
      });
      await fetchUserData();
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  const toggleAccountBox = async () => {
    try {
      if (showAccountBox) {
        setAccountBox(false);
        setIsEditable(false);
      } else {
        await fetchUserData();
        setAccountBox(true);
      }
    } catch (e) {
      console.error(e);
      dispatch({ type: MetamaskActions.SetError, payload: e });
    }
  };

  return (
    <>
      <HeaderWrapper>
        <Title>ARTSHARE</Title>
        {userData ? (
          <AccountButton onClick={toggleAccountBox}>
            <div><img src={userData.avatarLink} /></div>
            <span>{userData.username}</span>
          </AccountButton>
        ) : (
          <HeaderButtons state={state} onConnectClick={handleConnectClick} />
        )}
      </HeaderWrapper>
      <FloatButton>
        <HeaderButtons state={state} onConnectClick={handleConnectClick} />
      </FloatButton>
      {showAccountBox && (
        <AccountBox
          userData={userData}
          setUserData={setUserData}
          setAccountBox={setAccountBox}
          isEditable={isEditable}
          setIsEditable={setIsEditable}
        />
      )}
    </>
  );
};
