import {makeAutoObservable} from "mobx";

interface INftData {
  name: string;
  image: string;
  uri: string
}

class Nft {
  data: INftData[] = [];
  get loading() {
    return !this.data.length;
  }

  async load(nft: any) {
    const res = await fetch(nft.token_uri);
    const nftData = await res.json();
    this.data.push({
      ...nftData,
      uri: `https://testnets.opensea.io/assets/goerli/${nft.token_address}/${nft.token_id}`
    })
  }
  constructor() {
    makeAutoObservable(this);
  }
}

export const nft = new Nft()
