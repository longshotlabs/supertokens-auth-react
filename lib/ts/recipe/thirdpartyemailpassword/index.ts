/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
import ThirdPartyEmailPassword from "./recipe";
import { SuccessAPIResponse } from "../../types";
import EmailVerificationTheme from "../emailverification/components/themes/emailVerification";
import ResetPasswordUsingTokenTheme from "../emailpassword/components/themes/resetPasswordUsingToken";

import {
    UserInput,
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    SignInAndUpInput,
    SignInAndUpOutput,
    RecipeInterface,
    EPFunctionOptions as EmailPasswordFunctionOptions,
    TPFunctionOptions as ThirdPartyFunctionOptions,
} from "./types";
import ThirdPartyEmailPasswordAuth from "./thirdpartyEmailpasswordAuth";
import SignInAndUpTheme from "./components/themes/signInAndUp";
import { Apple, Google, Facebook, Github } from "../thirdparty/";
import RecipeImplementation from "./recipeImplementation";

export default class Wrapper {
    static init(config: UserInput) {
        return ThirdPartyEmailPassword.init(config);
    }

    static async signOut(): Promise<SuccessAPIResponse> {
        return ThirdPartyEmailPassword.getInstanceOrThrow().signOut();
    }

    static async isEmailVerified(): Promise<boolean> {
        return ThirdPartyEmailPassword.getInstanceOrThrow().emailVerification.isEmailVerified();
    }

    static redirectToAuth(show?: "signin" | "signup"): void {
        return ThirdPartyEmailPassword.getInstanceOrThrow().redirectToAuthWithRedirectToPath(show);
    }

    static Google = Google;
    static Apple = Apple;
    static Facebook = Facebook;
    static Github = Github;
    static ThirdPartyEmailPasswordAuth = ThirdPartyEmailPasswordAuth;
    static SignInAndUp = (prop?: any) =>
        ThirdPartyEmailPassword.getInstanceOrThrow().getFeatureComponent("signinup", prop);
    static SignInAndUpTheme = SignInAndUpTheme;
    static ResetPasswordUsingToken = (prop?: any) =>
        ThirdPartyEmailPassword.getInstanceOrThrow().getFeatureComponent("resetpassword", prop);
    static ResetPasswordUsingTokenTheme = ResetPasswordUsingTokenTheme;
    static EmailVerification = (prop?: any) =>
        ThirdPartyEmailPassword.getInstanceOrThrow().getFeatureComponent("emailverification", prop);
    static EmailVerificationTheme = EmailVerificationTheme;
}

const init = Wrapper.init;
const signOut = Wrapper.signOut;
const isEmailVerified = Wrapper.isEmailVerified;
const redirectToAuth = Wrapper.redirectToAuth;
const SignInAndUp = Wrapper.SignInAndUp;
const EmailVerification = Wrapper.EmailVerification;
const ResetPasswordUsingToken = Wrapper.ResetPasswordUsingToken;

export {
    ThirdPartyEmailPasswordAuth,
    init,
    Apple,
    Google,
    Facebook,
    Github,
    isEmailVerified,
    SignInAndUp,
    SignInAndUpTheme,
    signOut,
    redirectToAuth,
    EmailVerification,
    EmailVerificationTheme,
    ResetPasswordUsingToken,
    ResetPasswordUsingTokenTheme,
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    UserInput,
    SignInAndUpInput,
    SignInAndUpOutput,
    RecipeInterface,
    RecipeImplementation,
    EmailPasswordFunctionOptions,
    ThirdPartyFunctionOptions,
};
