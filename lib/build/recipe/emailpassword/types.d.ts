import { APIFormField, FeatureBaseConfig, FormField, FormFieldBaseConfig, NormalisedBaseConfig, NormalisedFormField, ThemeBaseProps, PreAPIHookFunction } from "../../types";
import { RefObject } from "react";
import { GetRedirectionURLContext as AuthRecipeModuleGetRedirectionURLContext, OnHandleEventContext as AuthRecipeModuleOnHandleEventContext, PreAPIHookContext as AuthRecipeModulePreAPIHookContext, User, Config as AuthRecipeModuleConfig, NormalisedConfig as NormalisedAuthRecipeModuleConfig, UserInput as AuthRecipeModuleUserInput } from "../authRecipeModule/types";
export declare type UserInput = {
    signInAndUpFeature?: SignInAndUpFeatureUserInput;
    resetPasswordUsingTokenFeature?: ResetPasswordUsingTokenUserInput;
} & AuthRecipeModuleUserInput;
export declare type Config = UserInput & AuthRecipeModuleConfig<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext>;
export declare type NormalisedConfig = {
    signInAndUpFeature: NormalisedSignInAndUpFeatureConfig;
    resetPasswordUsingTokenFeature: NormalisedResetPasswordUsingTokenFeatureConfig;
} & NormalisedAuthRecipeModuleConfig<GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext>;
export declare type SignInAndUpFeatureUserInput = {
    disableDefaultImplementation?: boolean;
    defaultToSignUp?: boolean;
    signUpForm?: SignUpFormFeatureUserInput;
    signInForm?: SignInFormFeatureUserInput;
};
export declare type NormalisedSignInAndUpFeatureConfig = {
    disableDefaultImplementation: boolean;
    defaultToSignUp: boolean;
    signUpForm: NormalisedSignUpFormFeatureConfig;
    signInForm: NormalisedSignInFormFeatureConfig;
};
export declare type SignUpFormFeatureUserInput = FeatureBaseConfig & {
    formFields?: FormFieldSignUpConfig[];
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
};
export declare type NormalisedSignUpFormFeatureConfig = NormalisedBaseConfig & {
    formFields: NormalisedFormField[];
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
};
export declare type SignInFormFeatureUserInput = FeatureBaseConfig & {
    formFields?: FormFieldSignInConfig[];
};
export declare type NormalisedSignInFormFeatureConfig = NormalisedBaseConfig & {
    formFields: NormalisedFormField[];
};
export declare type FormFieldSignInConfig = FormFieldBaseConfig;
export declare type FormFieldSignUpConfig = FormField;
export declare type ResetPasswordUsingTokenUserInput = {
    disableDefaultImplementation?: boolean;
    submitNewPasswordForm?: FeatureBaseConfig;
    enterEmailForm?: FeatureBaseConfig;
};
export declare type NormalisedResetPasswordUsingTokenFeatureConfig = {
    disableDefaultImplementation: boolean;
    submitNewPasswordForm: NormalisedSubmitNewPasswordForm;
    enterEmailForm: NormalisedEnterEmailForm;
};
export declare type NormalisedSubmitNewPasswordForm = FeatureBaseConfig & {
    formFields: NormalisedFormField[];
};
export declare type NormalisedEnterEmailForm = FeatureBaseConfig & {
    formFields: NormalisedFormField[];
};
declare type FormThemeBaseProps = ThemeBaseProps & {
    formFields: FormFieldThemeProps[];
};
export declare type SignInThemeProps = FormThemeBaseProps & {
    recipeImplementation: RecipeInterface;
    signUpClicked?: () => void;
    forgotPasswordClick: () => void;
};
export declare type SignUpThemeProps = FormThemeBaseProps & {
    recipeImplementation: RecipeInterface;
    signInClicked?: () => void;
    privacyPolicyLink?: string;
    termsOfServiceLink?: string;
};
export declare type SignInAndUpThemeProps = {
    defaultToSignUp: boolean;
    signInForm: SignInThemeProps;
    signUpForm: SignUpThemeProps;
    rawPalette: Record<string, string>;
};
export declare type NormalisedFormFieldWithError = NormalisedFormField & {
    error?: string;
};
export declare type FormFieldThemeProps = NormalisedFormFieldWithError & {
    showIsRequired?: boolean;
    autoComplete?: string;
};
export declare type FormFieldState = FormFieldThemeProps & {
    validated: boolean;
    ref: RefObject<InputRef>;
};
export declare type InputRef = HTMLInputElement & {
    isFocused?: boolean;
};
export declare type FormFieldError = {
    id: string;
    error: string;
};
export declare type EmailExistsAPIResponse = {
    status: "OK";
    exists: boolean;
};
export declare type FormFieldAPIResponse = {
    status: "FIELD_ERROR";
    formFields: FormFieldError[];
};
export declare type BaseSignInUpAPIResponse = {
    status: "OK";
    user: User;
} | FormFieldAPIResponse;
export declare type BaseResetPasswordAPIResponse = {
    status: "OK";
} | FormFieldAPIResponse;
export declare type ThemeResponseGeneralError = {
    status: "GENERAL_ERROR";
    message: string;
};
export declare type SignUpAPIResponse = BaseSignInUpAPIResponse;
export declare type SignInAPIResponse = BaseSignInUpAPIResponse | {
    status: "WRONG_CREDENTIALS_ERROR";
    message: string;
};
export declare type EnterEmailAPIResponse = BaseResetPasswordAPIResponse;
export declare type SubmitNewPasswordAPIResponse = BaseResetPasswordAPIResponse | {
    status: "RESET_PASSWORD_INVALID_TOKEN_ERROR";
};
export declare type PreAPIHookContext = AuthRecipeModulePreAPIHookContext | {
    action: "SIGN_UP" | "SEND_RESET_PASSWORD_EMAIL" | "SUBMIT_NEW_PASSWORD";
    requestInit: RequestInit;
    url: string;
};
export declare type GetRedirectionURLContext = AuthRecipeModuleGetRedirectionURLContext | {
    action: "RESET_PASSWORD";
};
export declare type OnHandleEventContext = AuthRecipeModuleOnHandleEventContext | {
    action: "RESET_PASSWORD_EMAIL_SENT" | "PASSWORD_RESET_SUCCESSFUL";
};
export declare type ResetPasswordUsingTokenThemeProps = {
    enterEmailForm: EnterEmailThemeProps;
    submitNewPasswordForm: SubmitNewPasswordThemeProps;
    token: string | undefined;
    rawPalette: Record<string, string>;
};
export declare type EnterEmailThemeProps = FormThemeBaseProps & {
    recipeImplementation: RecipeInterface;
};
export declare type SubmitNewPasswordThemeProps = FormThemeBaseProps & {
    recipeImplementation: RecipeInterface;
    onSignInClicked: () => void;
    token: string;
};
export declare type EnterEmailThemeState = {
    status: "READY" | "SENT";
};
export declare type SubmitNewPasswordThemeState = {
    status: "READY" | "SUCCESS";
};
export declare type SendVerifyEmailThemeState = {
    status: "READY" | "SUCCESS" | "ERROR";
};
export declare type FormBaseState = {
    formFields: FormFieldState[];
    status: "IN_PROGRESS" | "READY" | "LOADING" | "FIELD_ERRORS" | "SUCCESS";
} | {
    formFields: FormFieldState[];
    status: "GENERAL_ERROR";
    generalError: string;
};
export declare type FormBaseProps = {
    header?: JSX.Element;
    footer?: JSX.Element;
    formFields: FormFieldThemeProps[];
    showLabels: boolean;
    buttonLabel: string;
    validateOnBlur?: boolean;
    onSuccess?: () => void;
    callAPI: (fields: APIFormField[]) => Promise<FormBaseAPIResponse>;
};
export declare type FormBaseAPIResponse = {
    status: "OK";
    user?: User;
} | {
    status: "GENERAL_ERROR";
    message: string;
} | {
    status: "FIELD_ERROR";
    formFields: FormFieldError[];
};
declare global {
    interface Document {
        documentMode?: any;
    }
}
export declare type SignInAndUpState = {
    status: "LOADING" | "READY";
} | {
    status: "SUCCESSFUL";
    user: User;
};
export interface RecipeInterface {
    submitNewPassword: (formFields: {
        id: string;
        value: string;
    }[], token: string, preAPIHook?: PreAPIHookFunction) => Promise<{
        status: "OK" | "RESET_PASSWORD_INVALID_TOKEN_ERROR";
    } | {
        status: "FIELD_ERROR";
        formFields: {
            id: string;
            error: string;
        }[];
    }>;
    sendPasswordResetEmail: (formFields: {
        id: string;
        value: string;
    }[], preAPIHook?: PreAPIHookFunction) => Promise<{
        status: "OK";
    } | {
        status: "FIELD_ERROR";
        formFields: {
            id: string;
            error: string;
        }[];
    }>;
    signUp: (formFields: {
        id: string;
        value: string;
    }[], preAPIHook?: PreAPIHookFunction) => Promise<{
        status: "OK";
        user: User;
    } | {
        status: "FIELD_ERROR";
        formFields: {
            id: string;
            error: string;
        }[];
    }>;
    signIn: (formFields: {
        id: string;
        value: string;
    }[], preAPIHook?: PreAPIHookFunction) => Promise<{
        status: "OK";
        user: User;
    } | {
        status: "FIELD_ERROR";
        formFields: {
            id: string;
            error: string;
        }[];
    } | {
        status: "WRONG_CREDENTIALS_ERROR";
    }>;
    doesEmailExist: (email: string, preAPIHook?: PreAPIHookFunction) => Promise<boolean>;
}
export {};
