import styled from 'styled-components';
import { useRef, useEffect } from 'react';
import { defaultSnapOrigin } from '../config';

const AccountBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  position: fixed;
  right: 2rem;
  top: 60px;
  border-radius: 12px;
  z-index: 3;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);

  & input,
  & textarea {
    border: 1px solid #666;
    border-radius: 6px;
    background-color: transparent;
    color: #333333;
  }

  & input:focus,
  & textarea:focus {
    outline: none;
    border-color: #666666;
    background-color: transparent;
  }

  & input:disabled,
  & textarea:disabled {
    border-color: transparent;
  }
`;
const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 0.5rem;
  & textarea {
    width: 100%;
    resize: none;
    word-break: break-word;
    font-size: 1.4rem;
    color: #333333;
    width: 20vw;
    font-family: inherit;
    height: 10vh;
  }
`;
const AvatarContainer = styled.div`
  border-radius: 12px;
  background-color: rgba(3, 125, 214, 0.1);
  & > img {
    border-radius: 12px;
    height: 40vh;
    aspect-ratio: 1/2;
    object-fit: cover;
  }
`;
const Username = styled.div`
  & > input {
    resize: none;
    font-size: 2rem;
    color: black;
    font-weight: bold;
    background-color: transparent;
  }
`;
const LinkContainer = styled.div`
  width: 300px;
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
  margin-top: 1rem;
`;

const Link = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: auto;
  gap: 0.5rem;

  & > svg {
    width: 2.4rem;
    height: 2.4rem;
    fill: rgb(3, 125, 214);
  }

  & > input,
  textarea {
    color: #333333;
    width: 100%;
    resize: none;
    background-color: transparent;
  }
`;
const EditButton = styled.button`
  margin-top: 1.5rem;
  background-color: rgb(3, 125, 214);
  border: none;
  width: 40%;
  align-self: center;
  color: #ffffff;
`;

export const AccountBox = ({
  userData,
  setUserData,
  setAccountBox,
  isEditable,
  setIsEditable,
}: {
  userData: any;
  setUserData: any;
  setAccountBox: any;
  isEditable: boolean;
  setIsEditable: any;
}) => {
  const instagramLinkRef = useRef(null);
  const redditLinkRef = useRef(null);
  const twitterLinkRef = useRef(null);
  const avatarLinkRef = useRef(null);
  const usernameRef = useRef(null);
  const userbioRef = useRef(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const outsideClickHandler = (event: any) => {
      if (
        modalRef.current &&
        !(modalRef.current as any).contains(event.target)
      ) {
        setAccountBox(false);
        setIsEditable(false);
      }
    };
    document.addEventListener('click', outsideClickHandler, true);
    return () => {
      document.removeEventListener('click', outsideClickHandler, true);
    };
  }, []);

  const updateUserData = async () => {
    try {
      const newUserData = {
        ...userData,
        instagramLink: instagramLinkRef.current
          ? (instagramLinkRef.current as any).value
          : '',
        redditLink: redditLinkRef.current
          ? (redditLinkRef.current as any).value
          : '',
        twitterLink: twitterLinkRef.current
          ? (twitterLinkRef.current as any).value
          : '',
        username: usernameRef.current ? (usernameRef.current as any).value : '',
        userbio: userbioRef.current ? (userbioRef.current as any).value : '',
        avatarLink: avatarLinkRef.current
          ? (avatarLinkRef.current as any).value
          : '',
      };
      await window.ethereum.request({
        method: 'wallet_invokeSnap',
        params: [
          defaultSnapOrigin,
          {
            method: 'updateUserData',
            params: {
              ...newUserData,
            },
          },
        ],
      });
      setUserData(newUserData);
      setIsEditable(false);
      setAccountBox(false);
    } catch (e) {
      console.error(e);
    }
  };

  const clickHandler = () => {
    if (isEditable) {
      return updateUserData;
    }
    return () => setIsEditable(true);
  };

  return (
    <AccountBoxWrapper ref={modalRef}>
      <AvatarContainer>
        <img src={userData.avatarLink} />
      </AvatarContainer>
      <InfoWrapper>
        <Username>
          <input
            disabled={!isEditable}
            ref={usernameRef}
            defaultValue={userData.username}
          />
        </Username>
        <textarea
          disabled={!isEditable}
          ref={userbioRef}
          defaultValue={userData.userbio}
        />
        <LinkContainer>
          <Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
            </svg>
            <input
              disabled={!isEditable}
              ref={instagramLinkRef}
              defaultValue={userData.instagramLink}
            />
          </Link>
          <Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M6.167 8a.831.831 0 0 0-.83.83c0 .459.372.84.83.831a.831.831 0 0 0 0-1.661zm1.843 3.647c.315 0 1.403-.038 1.976-.611a.232.232 0 0 0 0-.306.213.213 0 0 0-.306 0c-.353.363-1.126.487-1.67.487-.545 0-1.308-.124-1.671-.487a.213.213 0 0 0-.306 0 .213.213 0 0 0 0 .306c.564.563 1.652.61 1.977.61zm.992-2.807c0 .458.373.83.831.83.458 0 .83-.381.83-.83a.831.831 0 0 0-1.66 0z" />
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.828-1.165c-.315 0-.602.124-.812.325-.801-.573-1.9-.945-3.121-.993l.534-2.501 1.738.372a.83.83 0 1 0 .83-.869.83.83 0 0 0-.744.468l-1.938-.41a.203.203 0 0 0-.153.028.186.186 0 0 0-.086.134l-.592 2.788c-1.24.038-2.358.41-3.17.992-.21-.2-.496-.324-.81-.324a1.163 1.163 0 0 0-.478 2.224c-.02.115-.029.23-.029.353 0 1.795 2.091 3.256 4.669 3.256 2.577 0 4.668-1.451 4.668-3.256 0-.114-.01-.238-.029-.353.401-.181.688-.592.688-1.069 0-.65-.525-1.165-1.165-1.165z" />
            </svg>
            <input
              disabled={!isEditable}
              ref={redditLinkRef}
              defaultValue={userData.redditLink}
            />
          </Link>
          <Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
            </svg>
            <input
              disabled={!isEditable}
              ref={twitterLinkRef}
              defaultValue={userData.twitterLink}
            />
          </Link>
          <Link>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
              <path
                fill-rule="evenodd"
                d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
              />
            </svg>
            <input
              disabled={!isEditable}
              ref={avatarLinkRef}
              defaultValue={userData.avatarLink}
            />
          </Link>
        </LinkContainer>
        <EditButton onClick={clickHandler()}>
          {isEditable ? 'Save' : 'Edit'}
        </EditButton>
      </InfoWrapper>
    </AccountBoxWrapper>
  );
};
