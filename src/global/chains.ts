export interface IChain {
  name: string;
  currency: string;
  rpc: string;
  blockScanUri: string;
  chainId: number
}

enum EChains {
  goerli ='goerli', sepolia = 'sepolia', mumbai = 'mumbai'
}

export const Chains: Record<EChains, IChain> = {
  goerli: {
    name: 'Goerli',
    currency: 'ETH',
    rpc: 'https://goerli.infura.io/v3/d87b55ad8191420d834014708a0a0f17',
    blockScanUri: 'https://goerli.etherscan.io',
    chainId: 0x5
  },
  sepolia: {
    name: 'Sepolia',
    currency: 'ETH',
    rpc: 'https://rpc.notadegen.com/sepolia',
    blockScanUri: 'https://sepolia.etherscan.io',
    chainId: 0xaa36a7
  },
  mumbai: {
    name: 'Mumbai',
    currency: 'MATIC',
    rpc: 'https://matic-mumbai.chainstacklabs.com',
    blockScanUri: 'mumbai.polygonscan.com',
    chainId: 0x13881
  }
}
