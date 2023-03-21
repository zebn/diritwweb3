import {Tweet} from "./tweet";


export class User {

    protected _name: string;

    set name(value: any) {
        this._name = value;
    }

    get name(): any {
        return this._name;
    }

    protected _avatar: string;

    set avatar(value: any) {
        this._avatar = value;
    }

    get avatar(): any {
        return this._avatar;
    }

    protected _bio: string;

    set bio(value: any) {
        this._bio = value;
    }

    get bio(): any {
        return this._bio;
    }

    protected _address: string|null = null;

    set address(value: any) {
        this._address = value;
    }

    get address(): any {
        return this._address;
    }

    public avatarBuffer: any = null;

    public constructor(address: string, name: string, bio: string, avatar: string) {
        this._address = address;
        this._name = name;
        this._bio = bio;
        this._avatar = avatar;
    }


}
