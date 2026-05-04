export type AuthFormMode = 'signIn' | 'register';

export interface LoginFormValue {
  displayName: string;
  email: string;
  password: string;
  rememberMe: boolean;
}
