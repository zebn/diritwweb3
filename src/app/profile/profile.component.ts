import { AfterViewInit, Component, Inject, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { Tweet } from '../share/model/tweet';
import { User } from '../share/model/user';
import { TweetService } from '../share/tweetservice/tweet.service';
import { UserService } from '../share/tweetservice/user.service';
import { Web3Service } from '../share/web3service/web3.service';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { DialogComponent } from '../share/dialog/dialog.component';

export interface DialogData {
  name: string;
  avatar: string;
  bio: string;
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements AfterViewInit {

  public tweets: Tweet[] =[];
  public user: any;
  public subscriptions: Subscription[] = new Array<Subscription>();

  public subscription: Subscription = new Subscription();
  public isUserConnected: boolean = false;

  public name: string | undefined;
  public avatar: string | undefined;
  public bio: string | undefined;

  public constructor(
    private tweetService: TweetService, 
    private userService: UserService, 
    private web3Service: Web3Service,
    public dialog: MatDialog) 
  {
    this.web3Service.userConected$.subscribe((status: boolean) => 
    {
      this.user = this.userService.getUserInSession();
      this.loadTweets();
      this.user = this.tweets[0].author;
    });
  }

  ngAfterViewInit()
  {
    this.user = this.userService.getUserInSession();
    this.loadTweets();
  }

  private loadTweets()
  {
    this.tweetService.getMyTweets().then((tweets: Tweet[]) => 
    {
      this.tweets = tweets;
    });

    this.subscription = this.tweetService.newTweets$.subscribe(async () => 
    {
      this.tweets = await this.tweetService.getMyTweets();
    });
  }

  public ngOnDestroy() {
    //this.subscriptions.forEach(subscription => { subscription.unsubscribe(); });
    this.subscription.unsubscribe();
  }

  openDialog(): void 
  {
    this.user = this.tweets[0].author;
    const dialogRef = this.dialog.open(DialogComponent, 
    {
      data: {name: this.user?.name, avatar: this.user?.avatar, bio: this.user?.bio},
    });

    dialogRef.afterClosed().subscribe(result => 
    {
      this.user.name = result.name;
      this.user.avatar = result.avatar;
      this.user.bio = result.bio;

      this.userService.updateUser(this.user);
      this.web3Service.userConected$.next(true);

    });
  }
}
