import {ApplicationRef, Component} from '@angular/core';
import { Tweet } from './share/model/tweet';
import { TweetService } from './share/tweetservice/tweet.service';
import { UserService } from './share/tweetservice/user.service';
import {Web3Service} from "./share/web3service/web3.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'twitter-web3';

  public user: any;

  public tweets: Tweet[] =[];

  public isWalletConnected: boolean = false;

  public constructor(private tweetService: TweetService, 
    private userService: UserService, 
    private web3Service: Web3Service,
                     protected applicationRef: ApplicationRef) {

    this.web3Service.status$.subscribe((status: boolean) => {
      this.isWalletConnected = status;
      this.applicationRef.tick();
      this.user = this.userService.getUserInSession();
      this.loadTweets();
      if (this.tweets[0]){
      this.user = this.tweets[0].author;
      }
    });
    
  }

  public connectWallet() {
    this.web3Service.connectWallet();

  }

  private loadTweets()
  {
    this.tweetService.getMyTweets().then((tweets: Tweet[]) => 
    {
      this.tweets = tweets;
    });
  }
    
}
