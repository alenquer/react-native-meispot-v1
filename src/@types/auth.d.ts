declare interface IAuthGroup {
  id: any;
}

declare interface IAuthUser {
  id: any;
  email: string;
  username: string;
  groups: IAuthGroup[];
}

declare interface IAuthContent {
  email: string;
  username?: string;
  password: string;
}

declare interface IAuthResponse {
  user: IAuthUser;
  token: string;
  error?: string;
}
