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

/*
 * Imports.
 */
import RecipeModule from "../recipeModule";
import { CreateRecipeFunction, NormalisedAppInfo, RecipeFeatureComponentMap } from "../../types";
import { isTest } from "../../utils";
import { InputType } from "./types";
import sessionSdk from "supertokens-website";

export default class Session extends RecipeModule<unknown, unknown, unknown, any> {
    static instance?: Session;
    static RECIPE_ID = "session";

    constructor(config: InputType & { recipeId: string; appInfo: NormalisedAppInfo }) {
        super(config);

        sessionSdk.init({
            ...config,
            preAPIHook: async (context) => {
                const response = {
                    ...context,
                    requestInit: {
                        ...context.requestInit,
                        headers: {
                            ...context.requestInit.headers,
                            rid: config.recipeId,
                        },
                    },
                };
                if (config.preAPIHook === undefined) {
                    return response;
                } else {
                    return config.preAPIHook(context);
                }
            },
            apiDomain: config.appInfo.apiDomain.getAsStringDangerous(),
            apiBasePath: config.appInfo.apiBasePath.getAsStringDangerous(),
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFeatureComponent = (_: string): JSX.Element => {
        throw new Error("should never come here");
    };

    getFeatures = (): RecipeFeatureComponentMap => {
        return {};
    };

    getUserId = (): Promise<string> => {
        return sessionSdk.getUserId();
    };

    getJWTPayloadSecurely = async (): Promise<any> => {
        return sessionSdk.getJWTPayloadSecurely();
    };

    doesSessionExist = (): Promise<boolean> => {
        return sessionSdk.doesSessionExist();
    };

    signOut = (): Promise<void> => {
        return sessionSdk.signOut();
    };

    attemptRefreshingSession = async (): Promise<boolean> => {
        return sessionSdk.attemptRefreshingSession();
    };

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    static addAxiosInterceptors(axiosInstance: any): void {
        return sessionSdk.addAxiosInterceptors(axiosInstance);
    }

    static init(config?: InputType): CreateRecipeFunction<unknown, unknown, unknown, any> {
        return (appInfo: NormalisedAppInfo): RecipeModule<unknown, unknown, unknown, any> => {
            Session.instance = new Session({
                ...config,
                appInfo,
                recipeId: Session.RECIPE_ID,
            });
            return Session.instance;
        };
    }

    static getInstanceOrThrow(): Session {
        if (Session.instance === undefined) {
            throw Error(
                "No instance of Session found. Make sure to call the Session.init method. See https://supertokens.io/docs/emailpassword/quick-setup/frontend"
            );
        }

        return Session.instance;
    }

    static reset(): void {
        if (!isTest()) {
            return;
        }

        Session.instance = undefined;
        return;
    }
}
