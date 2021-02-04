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
import RecipeModule from "./recipe/recipeModule";
import NormalisedURLPath from "./normalisedURLPath";
import NormalisedURLDomain from "./normalisedURLDomain";
import { CSSObject } from "@emotion/react/types/index";
import { ComponentClass } from "react";

/*
 * Recipe Module Manager Config Types.
 */

export type SuperTokensConfig = {
    /*
     * App Info configurations.
     */
    appInfo: AppInfoUserInput;

    /*
     * List of recipes for authentication and session management.
     */
    recipeList: CreateRecipeFunction[];
};

export type CreateRecipeFunction = (appInfo: NormalisedAppInfo) => RecipeModule;

export type AppInfoUserInput = {
    /*
     * The name of the application.
     */
    appName: string;

    /*
     * The API that connects with the application.
     */
    apiDomain: string;

    /*
     * The domain on which the application runs.
     */
    websiteDomain: string;

    /*
     * The base path for SuperTokens middleware in the API.
     * Default to `/auth`
     */
    apiBasePath?: string;

    /*
     * The base path for SuperTokens middleware in the front end application.
     * Default to `/auth`
     */
    websiteBasePath?: string;
};

export type NormalisedAppInfo = {
    /*
     * The name of the application.
     */
    appName: string;

    /*
     * The API that connects with the application.
     */
    apiDomain: NormalisedURLDomain;

    /*
     * The domain on which the application runs.
     */
    websiteDomain: NormalisedURLDomain;

    /*
     * The base path for SuperTokens middleware in the API.
     * Default to `/auth`
     */
    apiBasePath: NormalisedURLPath;

    /*
     * The base path for SuperTokens middleware in the front end application.
     * Default to `/auth`
     */
    websiteBasePath: NormalisedURLPath;
};

export type RecipeModuleConfig<S, R> = RecipeModuleHooks<S, R> & {
    /*
     * Unique Identifier of a module.
     */
    recipeId: string;

    /**
     *
     * AppInfo as present in the recipe module manager
     */
    appInfo: NormalisedAppInfo;
};

export type RecipeModuleHooks<S, R> = {
    /*
     * Optional pre API Hook.
     */
    preAPIHook?: (context: S) => Promise<RequestInit>;

    /*
     * Optional method used for handling event success.
     */
    onHandleEvent?: (context: R) => void;
};

export type NormalisedRecipeModuleHooks = {
    /*
     * Optional pre API Hook.
     */
    preAPIHook: (context: unknown) => Promise<RequestInit>;

    /*
     * Method used for handling event success.
     */
    onHandleEvent: (context: unknown) => void;
};

export type NormalisedAuthRecipeConfigHooks = {
    /*
     * Method used for redirections.
     */
    getRedirectionURL: (context: unknown) => Promise<string | undefined>;
};

export type AuthRecipeModuleConfig<T, S, R> = AuthRecipeModuleUserInput<T, S, R> & RecipeModuleConfig<S, R>;

export type AuthRecipeModuleUserInput<T, S, R> = RecipeModuleHooks<S, R> & {
    /*
     * Use shadow Dom root.
     */
    useShadowDom?: boolean;

    /*
     * Styling palette.
     */
    palette?: Record<string, string>;

    /*
     * Optional method used for redirections.
     */
    getRedirectionURL?: (context: T) => Promise<string | undefined>;
};

export type NormalisedAuthRecipeConfig = {
    /*
     * Use shadow Dom root.
     */
    useShadowDom: boolean;

    /*
     * Styling palette.
     */
    palette: Record<string, string>;
};

/*
 * Routing manipulation types.
 */
export type RouteToFeatureComponentMap = Record<string, ReactComponentClass>;

export type ComponentWithRecipeId = {
    /*
     * recipeId of the component.
     */
    rid: string;

    /*
     * Component.
     */
    component: ReactComponentClass;
};

export type PathToComponentWithRecipeIdMap = Record<string, ComponentWithRecipeId[]>;

export type FormFieldBaseConfig = {
    /*
     * name of the input field.
     */
    id: string;

    /*
     * Label of the input field.
     */
    label: string;

    /*
     * placeholder of the input field.
     */
    placeholder?: string;
};

export type FormField = FormFieldBaseConfig & {
    /*
     * Validation function of the input field. Returns an error as a string, or undefined.
     */
    validate?: (value: any) => Promise<string | undefined>;

    /*
     * Whether the field is optional or not.
     */
    optional?: boolean;
};

export type APIFormField = {
    /*
     * Id, or name of the input.
     */
    id: string;

    /*
     * Value of the corresponding id.
     */
    value: string;
};

export type NormalisedFormField = {
    /*
     * name of the input field.
     */
    id: string;

    /*
     * Label of the input field.
     */
    label: string;

    /*
     * placeholder of the input field.
     */
    placeholder: string;

    /*
     * Validation function of the input field. Returns an error as a string, or undefined.
     */
    validate: (value: any) => Promise<string | undefined>;

    /*
     * Whether the field is optional or not.
     */
    optional: boolean;

    /*
     * Autocomplete input.
     */
    autoComplete?: string;
};

export type ReactComponentClass = ComponentClass | (<T>(props: T) => JSX.Element);
export type WithRouterType = (Component: ReactComponentClass) => ReactComponentClass;

export type Styles = Record<string, CSSObject>;

/*
 * Features Config Types.
 */

export type FeatureBaseConfig = {
    /*
     * Additional styles to override themes.
     */
    style?: Styles;
};

export type NormalisedBaseConfig = {
    /*
     * Additional styles to override themes.
     */
    style: Styles;
};

export type SuccessAPIResponse = {
    /*
     * Success.
     */
    status: "OK";
};
