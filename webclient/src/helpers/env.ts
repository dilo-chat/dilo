export type ENV_VAR = "SERVER_URL"
  | "SECURITY_ENCRYPTION_ALG_NAME"
  | "SECURITY_ENCRYPTION_KEY_LENGTH"
  | "SECURITY_DERIVE_ALG_NAME"
  | "SECURITY_DERIVE_ALG_NAMED_CURVE";

export type WebClientConfig = {
  readonly [key in ENV_VAR]: string;
};

const env = (envvar: ENV_VAR): string => {
  const value = process.env[envvar];
  if (!value) {
    throw new Error(`${envvar} was not set as an environment variable!`);
  }
  return value;
}

const config: WebClientConfig = Object.freeze<WebClientConfig>({
  SERVER_URL: env('SERVER_URL'),
  SECURITY_ENCRYPTION_ALG_NAME: env('SECURITY_ENCRYPTION_ALG_NAME'),
  SECURITY_ENCRYPTION_KEY_LENGTH: env('SECURITY_ENCRYPTION_KEY_LENGTH'),
  SECURITY_DERIVE_ALG_NAME: env('SECURITY_DERIVE_ALG_NAME'),
  SECURITY_DERIVE_ALG_NAMED_CURVE: env('SECURITY_DERIVE_ALG_NAMED_CURVE'),
});

export default config;
