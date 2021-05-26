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
import NormalisedURLPath from "./normalisedURLPath";
import { isRequestInit } from "./utils";
import { supported_fdi } from "./version";
import { PreAPIHookFunction, NormalisedAppInfo } from "./types";

export default class Querier {
    recipeId: string;

    appInfo: NormalisedAppInfo;

    constructor(recipeId: string, appInfo: NormalisedAppInfo) {
        this.recipeId = recipeId;
        this.appInfo = appInfo;
    }

    get = async <T>(
        path: string,
        config: RequestInit,
        queryParams?: Record<string, string>,
        preAPIHook?: PreAPIHookFunction
    ): Promise<T> => {
        const result = await this.fetch(
            this.getFullUrl(path, queryParams),
            {
                method: "GET",
                ...config,
            },
            preAPIHook
        );
        if (result.status >= 300) {
            throw result;
        }
        return await result.json();
    };

    post = async <T>(path: string, config: RequestInit, preAPIHook?: PreAPIHookFunction): Promise<T> => {
        const result = await this.fetch(
            this.getFullUrl(path),
            {
                method: "POST",
                ...config,
            },
            preAPIHook
        );
        if (result.status >= 300) {
            throw result;
        }
        return await result.json();
    };

    delete = async <T>(path: string, config: RequestInit, preAPIHook?: PreAPIHookFunction): Promise<T> => {
        const result = await this.fetch(
            this.getFullUrl(path),
            {
                method: "DELETE",
                ...config,
            },
            preAPIHook
        );
        if (result.status >= 300) {
            throw result;
        }
        return await result.json();
    };

    put = async <T>(path: string, config: RequestInit, preAPIHook?: PreAPIHookFunction): Promise<T> => {
        const result = await this.fetch(
            this.getFullUrl(path),
            {
                method: "PUT",
                ...config,
            },
            preAPIHook
        );
        if (result.status >= 300) {
            throw result;
        }
        return await result.json();
    };

    fetch = async (url: string, config: RequestInit, preAPIHook?: PreAPIHookFunction): Promise<Response> => {
        let headers;
        if (config === undefined) {
            headers = {};
        } else {
            headers = config.headers;
        }

        const { requestInit, url: modifiedUrl } = await this.callPreAPIHook({
            preAPIHook,
            url,
            requestInit: {
                ...config,
                headers: {
                    ...headers,
                    "fdi-version": supported_fdi.join(","),
                    "Content-Type": "application/json",
                    rid: this.recipeId,
                },
            },
        });

        return await fetch(modifiedUrl, requestInit);
    };

    /*
     * For backward compatibility
     */
    callPreAPIHook = async (context: {
        preAPIHook?: PreAPIHookFunction;
        requestInit: RequestInit;
        url: string;
    }): Promise<{ url: string; requestInit: RequestInit }> => {
        if (context.preAPIHook === undefined) {
            return {
                url: context.url,
                requestInit: context.requestInit,
            };
        }
        const result = await context.preAPIHook({ url: context.url, requestInit: context.requestInit });
        if (isRequestInit(result)) {
            return {
                url: context.url,
                requestInit: result as RequestInit,
            };
        } else {
            return {
                url: context.url,
                ...result,
            };
        }
    };

    getFullUrl = (pathStr: string, queryParams?: Record<string, string>): string => {
        const path = new NormalisedURLPath(pathStr);
        const fullUrl = `${this.appInfo.apiDomain.getAsStringDangerous()}${this.appInfo.apiBasePath.getAsStringDangerous()}${path.getAsStringDangerous()}`;

        if (queryParams === undefined) {
            return fullUrl;
        }

        // If query params, add.
        return fullUrl + "?" + new URLSearchParams(queryParams);
    };
}
