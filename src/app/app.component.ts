import {ApplicationRef, Component} from '@angular/core';
import {Web3Service} from "./share/web3service/web3.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'twitter-web3';

  public isWalletConnected: boolean = false;

  public constructor(protected web3Service: Web3Service,
                     protected applicationRef: ApplicationRef) {

    this.web3Service.status$.subscribe((status: boolean) => {
      this.isWalletConnected = status;
      this.applicationRef.tick();
    });

  }

  public connectWallet() {
    this.web3Service.connectWallet();

  }

}
