import {Injectable} from "@angular/core";
import {User} from "../model/user";
import {Web3Service} from "../web3service/web3.service";
import {Subject} from "rxjs";

@Injectable()
export class UserService {

    public anonymousUser = new User("",'El señor X', '', 'https://pbs.twimg.com/profile_images/1012362101510160384/EjayQ10E_400x400.jpg');

    protected userInSession: any;

    public userInSessionChanged$ = new Subject();

    public constructor(protected web3Service: Web3Service) {
        this.userInSession = this.anonymousUser; //by default;
        this.web3Service.status$.subscribe(async (status) => 
        {
            if(status == true) {
                this.userInSession = this.buildUser(await this.web3Service.getUserInSession());
            }
            else {
                this.userInSession = this.anonymousUser;
            }
            this.userInSessionChanged$.next(this.userInSession);
        });
    }

    public async updateUser(user: User): Promise<void> {
        this.anonymousUser = user;
        await this.web3Service.updateUser(user);
    }

    public async getUser(address: string) 
    {
        let user = this.anonymousUser; //by default
        try {
            return user = this.buildUser(await this.web3Service.getUser(address));
        }
        catch(error) {
            //nothing
        }
        return user;
    }

    /*public async getMyUser() 
    {
        try {
            console.log("User in session: ",this.web3Service.getUserInSession())
            this.buildMyUser(this.web3Service.getUserInSession());
        }
        catch(error) {
            //nothing
        }
        return this.anonymousUser;
    }*/

    public buildUser(userFromWeb3: any) 
    {
        let user = new User(
                            "",
                            userFromWeb3.name,
                            userFromWeb3.bio,
                      'https://mysupercoolipfs.infura-ipfs.io/ipfs/' + userFromWeb3.avatar);
        return user;
    }

    /*public buildMyUser(userFromWeb3: any) 
    {   
        console.log("Usserrr web3: ",userFromWeb3.owner);

        this.anonymousUser.address = userFromWeb3.owner
        this.anonymousUser.name = userFromWeb3.name
        this.anonymousUser.bio = userFromWeb3.bio
        this.anonymousUser.avatar = 'https://mysupercoolipfs.infura-ipfs.io/ipfs/' + userFromWeb3.avatar;
    }*/

    public getUserInSession() {
        return this.userInSession;
    }


}
