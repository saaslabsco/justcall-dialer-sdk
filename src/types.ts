type UserDetails = {
  loggedIn: boolean;
  loginNumbers: Array<String>;
  userInfo: {
    email: string;
    name: string;
  };
};

export type LoginCallback = (userDetails: UserDetails) => void;

export type JustCallDialerInitProps = {
  dialerId: string;
  onLogin: LoginCallback;
  onLogout: () => void;
};
