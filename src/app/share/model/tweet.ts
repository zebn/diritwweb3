import {User} from "./user";


export class Tweet {

  public date: Date|null = null;
  public message: string|null = null;
  public author: User|null = null;
  public likes: number|null = null;
  public image: string = "";

  public imageBuffer: any = null;

}
