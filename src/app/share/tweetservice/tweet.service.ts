import {Injectable} from "@angular/core";
import {Tweet} from "../model/tweet";
import {Subject} from "rxjs";
import {UserService} from "./user.service";
import {User} from "../model/user";
import {Web3Service} from "../web3service/web3.service";

@Injectable()
export class TweetService {

    public newTweets$ = new Subject();

    protected tweets: any[] = [];

    public constructor(protected userService: UserService,
                       protected web3Service: Web3Service) {

        this.web3Service.newTweet$.subscribe(async () => {
            this.newTweets$.next(true);
        });

    }

    public async publishTweet(tweet: Tweet): Promise<void> {
        //append the tweet at the very beginning of this.tweet array:
        await this.web3Service.publishTweet(tweet);
    }

    public async getTweets(): Promise<Tweet[]> 
    {
        let returnValue: Tweet[] = [];
        let tweets = await this.web3Service.getAllTweets();
        tweets.forEach( async (tweetData: any) => 
        {
            let tweet = new Tweet();
            tweet.message = tweetData.tweetText;
            tweet.image = tweetData.tweetImage;
            tweet.date = new Date(tweetData.date * 1000);
            let authorAddress = tweetData.author;
            let user = await this.userService.getUser(authorAddress);
            tweet.author = user;
            returnValue.push(tweet);
        });
        return returnValue;
    }

    public async getMyTweets(): Promise<Tweet[]> 
    {
        let returnValue: Tweet[] = [];
        let tweets = await this.web3Service.getAllTweets();
        
        tweets.forEach( async (tweetData: any) => 
        {
            if((tweetData[1].toString()).toLowerCase() == this.web3Service.getUserAdress().toString())
            {
                let tweet = new Tweet();
                tweet.message = tweetData.tweetText;
                tweet.image = tweetData.tweetImage;
                tweet.date = new Date(tweetData.date * 1000);
                let authorAddress = tweetData.author;
                let authorImage = tweetData.avatar
                let user = await this.userService.getUser(authorAddress);
                user.avatar = authorImage;
                tweet.author = user;
                returnValue.push(tweet);
            }
        });
        return returnValue;
    }

}
