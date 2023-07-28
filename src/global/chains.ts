export interface IChain {
  name: string;
  currency: string;
  rpc: string;
  blockScanUri: string;
  chainId: string;
  network: string;
  chain: string;
}

enum EChains {
  mainnet = 'mainnet', goerli ='goerli', sepolia = 'sepolia', mumbai = 'mumbai'
}

export const Chains: Record<EChains, IChain> = {
  mainnet: {
    name: 'Mainnet',
    currency: 'ETH',
    rpc: 'https://eth.llamarpc.com',
    blockScanUri: 'https://etherscan.io',
    chainId: '0x1',
    network: 'mainnet',
    chain: 'Ethereum',
  },
  goerli: {
    name: 'Goerli',
    currency: 'ETH',
    rpc: 'https://goerli.infura.io/v3/d87b55ad8191420d834014708a0a0f17',
    blockScanUri: 'https://goerli.etherscan.io',
    chainId: '0x5',
    network: 'testnet',
    chain: 'Ethereum',
  },
  sepolia: {
    name: 'Sepolia',
    currency: 'ETH',
    rpc: 'https://rpc.notadegen.com/sepolia',
    blockScanUri: 'https://sepolia.etherscan.io',
    chainId: '0xaa36a7',
    network: 'testnet',
    chain: 'Ethereum',
  },
  mumbai: {
    name: 'Mumbai',
    currency: 'MATIC',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    blockScanUri: 'mumbai.polygonscan.com',
    chainId: '0x13881',
    network: 'testnet',
    chain: 'Polygon',
  }
}
