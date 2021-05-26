import { RecipeInterface, NormalisedConfig } from "./types";
import { User } from "../authRecipeModule/types";
import { PreAPIHookFunction } from "../../types";
import Querier from "../../querier";
import { validateForm } from "../../utils";

export default class RecipeImplementation implements RecipeInterface {
    querier: Querier;
    config: NormalisedConfig;

    constructor(config: NormalisedConfig) {
        this.querier = new Querier(config.recipeId, config.appInfo);
        this.config = config;
    }

    submitNewPassword = async (
        formFields: {
            id: string;
            value: string;
        }[],
        token: string,
        preAPIHook?: PreAPIHookFunction
    ): Promise<SubmitNewPasswordAPIResponse> => {
        // first we validate on the frontend
        const validationErrors = await validateForm(
            formFields,
            this.config.resetPasswordUsingTokenFeature.submitNewPasswordForm.formFields
        );

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

        // then we call API
        const response: SubmitNewPasswordAPIResponse = await this.querier.post(
            "/user/password/reset",
            { body: JSON.stringify({ formFields: [formFields[0]], token, method: "token" }) },
            preAPIHook
        );

        return response;
    };

    sendPasswordResetEmail = async (
        formFields: {
            id: string;
            value: string;
        }[],
        preAPIHook?: PreAPIHookFunction
    ): Promise<SendPasswordResetEmailAPIResponse> => {
        // first we validate on the frontend
        const validationErrors = await validateForm(
            formFields,
            this.config.resetPasswordUsingTokenFeature.enterEmailForm.formFields
        );

        if (validationErrors.length > 0) {
            return {
                status: "FIELD_ERROR",
                formFields: validationErrors,
            };
        }

        // then we call API
        const response: SendPasswordResetEmailAPIResponse = await this.querier.post(
            "/user/password/reset/token",
            { body: JSON.stringify({ formFields }) },
            preAPIHook
        );
        return response;
    };

    signUp = async (
        formFields: {
            id: string;
            value: string;
        }[],
        preAPIHook?: PreAPIHookFunction
    ): Promise<SignUpAPIResponse> => {
        // first we validate on the frontend
        const validationErrors = await validateForm(formFields, this.config.signInAndUpFeature.signUpForm.formFields);

        if (validationErrors.length > 0) {
            return {
                status: "FIELD_ERROR",
                formFields: validationErrors,
            };
        }

        // then we call API
        const response: SignUpAPIResponse = await this.querier.post(
            "/signup",
            { body: JSON.stringify({ formFields }) },
            preAPIHook
        );

        return response;
    };

    signIn = async (
        formFields: {
            id: string;
            value: string;
        }[],
        preAPIHook?: PreAPIHookFunction
    ): Promise<SignInAPIResponse> => {
        // first we validate on the frontend
        const validationErrors = await validateForm(formFields, this.config.signInAndUpFeature.signInForm.formFields);

        if (validationErrors.length > 0) {
            return {
                status: "FIELD_ERROR",
                formFields: validationErrors,
            };
        }

        // then we call API
        const response: SignInAPIResponse = await this.querier.post(
            "/signin",
            { body: JSON.stringify({ formFields }) },
            preAPIHook
        );
        return response;
    };

    doesEmailExist = async (email: string, preAPIHook?: PreAPIHookFunction): Promise<boolean> => {
        const response: EmailExistsAPIResponse = await this.querier.get(
            "/signup/email/exists",
            {},
            { email },
            preAPIHook
        );

        return response.exists;
    };
}

type SubmitNewPasswordAPIResponse =
    | {
          status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR";
      }
    | {
          status: "FIELD_ERROR";
          formFields: {
              id: string;
              error: string;
          }[];
      };

type SendPasswordResetEmailAPIResponse =
    | {
          status: "OK";
      }
    | {
          status: "FIELD_ERROR";
          formFields: {
              id: string;
              error: string;
          }[];
      };

type SignUpAPIResponse =
    | {
          status: "OK";
          user: User;
      }
    | {
          status: "FIELD_ERROR";
          formFields: {
              id: string;
              error: string;
          }[];
      };

type SignInAPIResponse =
    | {
          status: "OK";
          user: User;
      }
    | {
          status: "FIELD_ERROR";
          formFields: {
              id: string;
              error: string;
          }[];
      }
    | {
          status: "WRONG_CREDENTIALS_ERROR";
      };

type EmailExistsAPIResponse = {
    status: "OK";
    exists: boolean;
};
