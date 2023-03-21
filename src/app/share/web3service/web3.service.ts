import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import TwitterContract from "../../../abi/TwitterContract.json";
import Web3 from "web3";
import {AbiItem} from "web3-utils";
import {Tweet} from "../model/tweet";
import {create} from "ipfs-http-client";
import {User} from "../model/user";

//declare window variable
declare let window: any;

@Injectable()
export class Web3Service {

    protected infuraProjectId = "2MQhBSXzN9jeVnjfQ7geHJOlhdP";
    protected infuraProjectSecret = "75e3e955a15463e6c7135d3296ba0d51";

    protected contractAddress = "0x2BEC0f98C63474786389Cd7D149C153ea638CaF6";

    protected web3 = new Web3("wss://goerli.infura.io/ws/v3/9ead5103315e43628c5e8d3e1c4e4f1c");

    protected ipfsClient: any = null;

    protected contractInstance: any;

    protected account: string = "";

    public newTweet$ = new Subject<any>();

    public status$ = new Subject<boolean>();

    public userConected$ = new Subject<boolean>();

    public constructor() {

        window.Buffer = require('buffer').Buffer;
        const auth = 'Basic ' + window.Buffer
            .from(this.infuraProjectId + ":" + this.infuraProjectSecret)
            .toString('base64');

        this.ipfsClient = create({
            host: 'ipfs.infura.io',
            port: 5001,
            protocol: 'https',
            apiPath: '/api/v0',
            headers: {
                authorization: auth
            }
        })

        if (!window.ethereum) {
            alert('Please install MetaMask first.');
        }
        else {

            this.contractInstance = new this.web3.eth.Contract(TwitterContract.abi as AbiItem[], this.contractAddress)
            this.contractInstance.events.AddTweet({})
                .on('data', (event: any) => {
                    this.newTweet$.next(event);
                });

            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    this.account = accounts[0];
                    this.status$.next(true);
                } else {
                    this.disconnectWallet();
                }
            });
        }

    }

    public async getAllTweets() {
        return this.contractInstance.methods.getAllTweets().call();
    }

    public async getMyTweets() {
        return this.contractInstance.methods.getMyTweets().call();
    }

    public async updateUser(user: User) {

        if(user.avatarBuffer != null) {
            //upload to IPFS
            const file = await this.ipfsClient.add(user.avatarBuffer);
            user.avatar = file.path;
        }

        let gas = await this.contractInstance.methods.updateUser(user.name, user.bio, user.avatar).estimateGas({from: this.account});
        let gasPrice = await this.web3.eth.getGasPrice();

        let encodedABI = this.contractInstance.methods.updateUser(user.name, user.bio, user.avatar).encodeABI();

        let tx: any = {
            to: this.contractAddress,
            from: this.account,
            gas: this.web3.utils.toHex(gas),
            gasPrice: this.web3.utils.toHex(gasPrice),
            data: encodedABI,
        };

        await this.sendTransaction(tx);
        this.userConected$.next(true);

    }

    protected async sendTransaction(tx: any) {

        try {
            const transactionHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [
                    tx,
                ],
            });
            // Handle the result
            console.log(transactionHash);
        } catch (error) {
            console.error(error);
        }

    }

    public async getUser(address: any) 
    {
        return this.contractInstance.methods.getUser(address).call();
    }

    public async getUserInSession() 
    {
        return await this.getUser(this.account);
    }

    public getUserAdress()
    {
        return this.account
    }

    public async publishTweet(tweet: Tweet) 
    {

        if(tweet.imageBuffer != null) {
            //upload to IPFS
            const file = await this.ipfsClient.add(tweet.imageBuffer);
            tweet.image = file.path;
        }

        let gas = await this.contractInstance.methods.addTweet(tweet.message, tweet.image).estimateGas({from: this.account});
        let gasPrice = await this.web3.eth.getGasPrice();

        let encodedABI = this.contractInstance.methods.addTweet(tweet.message, tweet.image).encodeABI();

        let tx: any = {
            to: this.contractAddress,
            from: this.account,
            gas: this.web3.utils.toHex(gas),
            gasPrice: this.web3.utils.toHex(gasPrice),
            data: encodedABI,
        };

        await this.sendTransaction(tx);

    }

    public async connectWallet() {
        if (!window.ethereum) {
            alert('Please install MetaMask first.');
        }
        else {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];
            this.status$.next(true);
            this.userConected$.next(true);
        }
    }

    public disconnectWallet() {
        this.account = "";
        this.status$.next(false);
    }

    public isWalletConnected() {
        return this.account != null;
    }

}
