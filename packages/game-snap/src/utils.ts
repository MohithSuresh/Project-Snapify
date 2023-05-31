import { BigNumber, ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xB967F2C084617c83C0618F35Be9970e0d571137f';

export const mintNFT = async (tokenURI: string) => {
  let simpleNFTInterface = new ethers.utils.Interface([
    'constructor(string memory name_, string memory symbol_)',
    'function mint(string memory tokenURI) public returns (uint256)',
    'function transferFrom(address from, address to, uint256 tokenId)',
  ]);
  let functionData = simpleNFTInterface.encodeFunctionData('mint', [tokenURI]);
  try {
    const [from] = (await wallet.request({
      method: 'eth_requestAccounts',
    })) as string[];
    // Send a transaction to MetaMask.
    const data = await wallet.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: CONTRACT_ADDRESS,
          value: '0x0',
          data: functionData,
        },
      ],
    });
    console.log(data);
    return data;
  } catch (e) {
    console.error(e);
  }
  return false;
};

export const transferNFT = async (toAddress: string, tokenID: number) => {
  const simpleNFTInterface = new ethers.utils.Interface([
    'constructor(string memory name_, string memory symbol_)',
    'function mint(string memory tokenURI) public returns (uint256)',
    'function transferFrom(address from, address to, uint256 tokenId)',
  ]);
  try {
    const [from] = (await wallet.request({
      method: 'eth_requestAccounts',
    })) as string[];
    const functionData = simpleNFTInterface.encodeFunctionData('transferFrom', [
      from,
      toAddress,
      tokenID,
    ]);
    const confirmResult = await wallet.request({
      method: 'snap_confirm',
      params: [
        {
          prompt: 'Would you like to transfer the NFT?',
          description: `You will be transfering this NFT to ${toAddress}`,
        },
      ],
    });
    if (!confirmResult) return false;
    // Send a transaction to MetaMask.
    const data = await wallet.request({
      method: 'eth_sendTransaction',
      params: [
        {
          from,
          to: CONTRACT_ADDRESS,
          value: '0x0',
          data: functionData,
        },
      ],
    });
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};

export const decodeTransferData = (transactionData: ethers.utils.BytesLike) => {
  const simpleNFTInterface = new ethers.utils.Interface([
    'constructor(string memory name_, string memory symbol_)',
    'function mint(string memory tokenURI) public returns (uint256)',
    'function transferFrom(address from, address to, uint256 tokenId)',
  ]);
  const data = simpleNFTInterface.decodeFunctionData(
    'transferFrom',
    transactionData,
  );
  return {
    to: data[1],
    tokenID: (data[2] as BigNumber).toNumber(),
  };
};
