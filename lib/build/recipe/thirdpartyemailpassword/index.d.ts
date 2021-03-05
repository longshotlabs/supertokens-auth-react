import { CreateRecipeFunction, SuccessAPIResponse } from "../../types";
import EmailVerificationTheme from "../emailverification/components/themes/emailVerification";
import EmailVerification from "./components/features/emailVerification/wrapper";
import ResetPasswordUsingToken from "./components/features/resetPasswordUsingToken/wrapper";
import ResetPasswordUsingTokenTheme from "../emailpassword/components/themes/resetPasswordUsingToken";
import { ThirdPartyEmailPasswordUserInput, ThirdPartyEmailPasswordGetRedirectionURLContext, ThirdPartyEmailPasswordPreAPIHookContext, ThirdPartyEmailPasswordOnHandleEventContext } from "./types";
import ThirdPartyEmailPasswordAuth from "./thirdpartyEmailpasswordAuth";
import SignInAndUp from "./components/features/signInAndUp/wrapper";
import SignInAndUpTheme from "./components/themes/signInAndUp";
import { Apple, Google, Facebook, Github } from "../thirdparty/";
export default class ThirdPartyEmailPasswordAPIWrapper {
    static init(config: ThirdPartyEmailPasswordUserInput): CreateRecipeFunction;
    static signOut(): Promise<SuccessAPIResponse>;
    static isEmailVerified(): Promise<boolean>;
    static Google: typeof Google;
    static Apple: typeof Apple;
    static Facebook: typeof Facebook;
    static Github: typeof Github;
    static ThirdPartyEmailPasswordAuth: typeof ThirdPartyEmailPasswordAuth;
    static SignInAndUp: typeof SignInAndUp;
    static SignInAndUpTheme: typeof SignInAndUpTheme;
    static ResetPasswordUsingToken: typeof ResetPasswordUsingToken;
    static ResetPasswordUsingTokenTheme: typeof ResetPasswordUsingTokenTheme;
    static EmailVerification: typeof EmailVerification;
    static EmailVerificationTheme: typeof EmailVerificationTheme;
}
declare const init: typeof ThirdPartyEmailPasswordAPIWrapper.init;
declare const signOut: typeof ThirdPartyEmailPasswordAPIWrapper.signOut;
declare const isEmailVerified: typeof ThirdPartyEmailPasswordAPIWrapper.isEmailVerified;
export { ThirdPartyEmailPasswordAuth, ThirdPartyEmailPasswordAPIWrapper, init, Apple, Google, Facebook, Github, isEmailVerified, SignInAndUp, SignInAndUpTheme, signOut, EmailVerification, EmailVerificationTheme, ResetPasswordUsingToken, ResetPasswordUsingTokenTheme, ThirdPartyEmailPasswordGetRedirectionURLContext, ThirdPartyEmailPasswordPreAPIHookContext, ThirdPartyEmailPasswordOnHandleEventContext };