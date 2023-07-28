import {makeAutoObservable} from "mobx";
import {ethers} from "ethers";
import {notification} from "../utils/notification";
import {STAKING_CONTRACT_ADDRESS} from "../contracts/addresses";
import stakingAbi from "../contracts/abi/staking.json";
import {wallet} from "./Wallet";
// @ts-ignore
import console from 'console-browserify'

class Stake {
  staked: string | null = null;
  private async getStakingContract() {
    const signer = new ethers.Wallet(wallet.privateKey!, wallet.provider)
    return new ethers.Contract(STAKING_CONTRACT_ADDRESS, stakingAbi, signer);
  }
  async stake(amount: string) {
    const stakingContract = await this.getStakingContract()
    const tx: ethers.providers.TransactionResponse = await stakingContract.stake({ value: ethers.utils.parseEther(amount) });
    this.getStakedTokens()
    return tx.hash
  }
  async unstake() {
    try {
      const stakingContract = await this.getStakingContract()
      const tx = await stakingContract.unstake();
      console.log(tx);
      await this.getStakedTokens()
    }
    catch (e: any) {
      notification.error({message: 'Staked period not complete.'})
    }
  }
  async getStakedTokens() {
    const stakingContract = await this.getStakingContract()
    const stakedAmount = await stakingContract.balances(wallet.address);
    this.staked = ethers.utils.formatEther(stakedAmount)
    console.log(this.staked)
  }
  async getStakedPeriod() {
    const stakingContract = await this.getStakingContract()
    const stakedPeriod = await stakingContract.stakingTimestamps(wallet.address);
    console.log(stakedPeriod)
  }
  constructor() {
    makeAutoObservable(this)
  }
}

export const stake = new Stake()
