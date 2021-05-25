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
/** @jsx jsx */
import { jsx } from "@emotion/react";
import * as React from "react";
import { PureComponent, Fragment } from "react";
import {
    GetRedirectionURLContext,
    OnHandleEventContext,
    PreAPIHookContext,
    FormBaseAPIResponse,
    NormalisedConfig,
    SubmitNewPasswordThemeProps,
} from "../../../types";
import { ResetPasswordUsingTokenTheme } from "../../..";
import { APIFormField, FeatureBaseProps } from "../../../../../types";

import { getWindowOrThrow, validateForm } from "../../../../../utils";
import { enterEmailAPI, handleSubmitNewPasswordAPI } from "./api";
import FeatureWrapper from "../../../../../components/featureWrapper";
import AuthRecipeModule from "../../../../authRecipeModule";
import SuperTokens from "../../../../../superTokens";

/*
 * Component.
 */

class ResetPasswordUsingToken extends PureComponent<FeatureBaseProps, { token: string }> {
    /*
     * Constructor.
     */
    constructor(props: FeatureBaseProps) {
        super(props);

        const urlParams = new URLSearchParams(getWindowOrThrow().location.search);
        let token = urlParams.get("token");
        if (token === null) {
            token = "";
        }

        this.state = {
            token,
        };
    }

    getRecipeInstanceOrThrow = (): AuthRecipeModule<
        GetRedirectionURLContext,
        PreAPIHookContext,
        OnHandleEventContext,
        NormalisedConfig
    > => {
        if (this.props.recipeId === undefined) {
            throw new Error("No recipeId props given to SignInAndUp component");
        }

        const recipe = SuperTokens.getInstanceOrThrow().getRecipeOrThrow(this.props.recipeId);
        if (recipe instanceof AuthRecipeModule === false) {
            throw new Error(`${recipe.recipeId} must be an instance of AuthRecipeModule to use SignInAndUp component.`);
        }

        return recipe as AuthRecipeModule<
            GetRedirectionURLContext,
            PreAPIHookContext,
            OnHandleEventContext,
            NormalisedConfig
        >;
    };

    getIsEmbedded = (): boolean => {
        if (this.props.isEmbedded !== undefined) {
            return this.props.isEmbedded;
        }
        return false;
    };

    /*
     * Methods.
     */

    submitNewPassword = async (formFields: APIFormField[]): Promise<FormBaseAPIResponse> => {
        // Front end validation.
        const validationErrors = await validateForm(
            formFields,
            this.getRecipeInstanceOrThrow().config.resetPasswordUsingTokenFeature.submitNewPasswordForm.formFields
        );

        // If errors, return.
        if (validationErrors.length > 0) {
            return {
                status: "FIELD_ERROR",
                formFields: validationErrors,
            };
        }

        // Verify that both passwords match.
        if (formFields[0].value !== formFields[1].value) {
            return {
                status: "FIELD_ERROR",
                formFields: [
                    {
                        id: "confirm-password",
                        error: "Confirmation password doesn't match",
                    },
                ],
            };
        }

        // Call API, only send first password.
        return await handleSubmitNewPasswordAPI(
            [formFields[0]],
            this.getRecipeInstanceOrThrow(),
            this.state.token
        );
    };

    enterEmail = async (formFields: APIFormField[]): Promise<FormBaseAPIResponse> => {
        // Front end validation.
        const validationErrors = await validateForm(
            formFields,
            this.getRecipeInstanceOrThrow().config.resetPasswordUsingTokenFeature.enterEmailForm.formFields
        );

        // If errors, return.
        if (validationErrors.length > 0) {
            return {
                status: "FIELD_ERROR",
                formFields: validationErrors,
            };
        }

        return await enterEmailAPI(
            formFields,
            this.getRecipeInstanceOrThrow()
        );
    };

    render = (): JSX.Element => {
        const enterEmailFormFeature = this.getRecipeInstanceOrThrow().config.resetPasswordUsingTokenFeature.enterEmailForm;

        const submitNewPasswordFormFeature = this.getRecipeInstanceOrThrow().config.resetPasswordUsingTokenFeature
            .submitNewPasswordForm;

        const submitNewPasswordForm: SubmitNewPasswordThemeProps = {
            styleFromInit: submitNewPasswordFormFeature.style,
            formFields: submitNewPasswordFormFeature.formFields,
            submitNewPasswordAPI: this.submitNewPassword,
            onSuccess: () => {
                this.getRecipeInstanceOrThrow().config.onHandleEvent({
                    action: "PASSWORD_RESET_SUCCESSFUL",
                });
            },
            onSignInClicked: () => {
                this.getRecipeInstanceOrThrow().redirect({ action: "SIGN_IN_AND_UP" }, this.props.history);
            },
        };

        const enterEmailForm = {
            styleFromInit: enterEmailFormFeature.style,
            formFields: enterEmailFormFeature.formFields,
            onSuccess: () => {
                this.getRecipeInstanceOrThrow().config.onHandleEvent({
                    action: "RESET_PASSWORD_EMAIL_SENT",
                });
            },
            enterEmailAPI: this.enterEmail,
        };

        const hasToken = this.state.token.length !== 0;

        /*
         * Render.
         */
        return (
            <FeatureWrapper isEmbedded={this.getIsEmbedded()} useShadowDom={this.getRecipeInstanceOrThrow().config.useShadowDom}>
                <Fragment>
                    {/* No custom theme, use default. */}
                    {this.props.children === undefined && (
                        <ResetPasswordUsingTokenTheme
                            rawPalette={this.getRecipeInstanceOrThrow().config.palette}
                            submitNewPasswordForm={submitNewPasswordForm}
                            enterEmailForm={enterEmailForm}
                            hasToken={hasToken}
                        />
                    )}
                    {/* Otherwise, custom theme is provided, propagate props. */}
                    {this.props.children &&
                        React.cloneElement(this.props.children, {
                            rawPalette: this.getRecipeInstanceOrThrow().config.palette,
                            submitNewPasswordForm,
                            enterEmailForm,
                            hasToken,
                        })}
                </Fragment>
            </FeatureWrapper>
        );
    };
}

export default ResetPasswordUsingToken;
