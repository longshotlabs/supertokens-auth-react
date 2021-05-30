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
import { RecipeInterface } from "../../../types";
import { getWindowOrThrow } from "../../../../../utils";
import Session from "../../../../session";
import { EmailVerificationTheme } from "../../themes/emailVerification";
import { FeatureBaseProps } from "../../../../../types";
import FeatureWrapper from "../../../../../components/featureWrapper";
import Recipe from "../../../recipe";

type Prop = FeatureBaseProps & { recipe: Recipe };

class EmailVerification extends PureComponent<Prop, { status: "READY" | "LOADING"; token: string | undefined }> {
    /*
     * Constructor.
     */
    constructor(props: Prop) {
        super(props);

        const urlParams = new URLSearchParams(getWindowOrThrow().location.search);
        const token = urlParams.get("token");
        if (token === null) {
            this.state = {
                status: "LOADING",
                token: undefined,
            };
        } else {
            this.state = {
                status: "LOADING",
                token,
            };
        }
    }

    signOut = async (): Promise<void> => {
        try {
            await this.props.recipe.config.signOut();
            return await this.props.recipe.config.redirectToSignIn(this.props.history);
        } catch (e) {}
    };

    getModifiedRecipeInterface = (): RecipeInterface => {
        return {
            ...this.props.recipe.recipeImpl,
            sendVerificationEmail: async (input) => {
                const response = await this.props.recipe.recipeImpl.sendVerificationEmail(input);
                this.setState(() => ({
                    token: undefined,
                }));
                return response;
            },
        };
    };

    async componentDidMount(): Promise<void> {
        // Redirect to login if no existing session and no token.
        // We don't redirect if a token exists because the user might
        // be verifying their token on another browser
        if (this.state.token === undefined) {
            const sessionExists = await Session.doesSessionExist();
            if (sessionExists === false) {
                return await this.props.recipe.config.redirectToSignIn(this.props.history);
            }
        }

        this.setState((oldState) => {
            return {
                ...oldState,
                status: "READY",
            };
        });
    }

    render = (): JSX.Element => {
        if (this.state.status === "LOADING") {
            return <Fragment />;
        }

        const sendVerifyEmailScreenFeature = this.props.recipe.config.sendVerifyEmailScreen;

        const sendVerifyEmailScreen = {
            styleFromInit: sendVerifyEmailScreenFeature.style,
            recipeImplementation: this.getModifiedRecipeInterface(),
            config: this.props.recipe.config,
            signOut: this.signOut,
            onEmailAlreadyVerified: async () => this.props.recipe.config.postVerificationRedirect(this.props.history),
        };

        const verifyEmailLinkClickedScreenFeature = this.props.recipe.config.verifyEmailLinkClickedScreen;

        const verifyEmailLinkClickedScreen =
            this.state.token === undefined
                ? undefined
                : {
                      styleFromInit: verifyEmailLinkClickedScreenFeature.style,
                      onTokenInvalidRedirect: async () => {
                          this.props.recipe.config.redirectToSignIn(this.props.history);
                      },
                      onContinueClicked: () => this.props.recipe.config.postVerificationRedirect(this.props.history),
                      recipeImplementation: this.getModifiedRecipeInterface(),
                      config: this.props.recipe.config,
                      token: this.state.token,
                  };

        const props = {
            config: this.props.recipe.config,
            sendVerifyEmailScreen: sendVerifyEmailScreen,
            verifyEmailLinkClickedScreen,
            hasToken: this.state.token !== undefined,
        };

        return (
            <FeatureWrapper useShadowDom={this.props.recipe.config.useShadowDom}>
                <Fragment>
                    {/* No custom theme, use default. */}
                    {this.props.children === undefined && <EmailVerificationTheme {...props} />}
                    {/* Otherwise, custom theme is provided, propagate props. */}
                    {this.props.children && React.cloneElement(this.props.children, props)}
                </Fragment>
            </FeatureWrapper>
        );
    };
}

export default EmailVerification;
