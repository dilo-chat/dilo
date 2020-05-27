export type EnvVarName = "SERVER_URL"
  | "SECURITY_ENCRYPTION_ALG_NAME"
  | "SECURITY_ENCRYPTION_KEY_LENGTH"
  | "SECURITY_DERIVE_ALG_NAME"
  | "SECURITY_DERIVE_ALG_NAMED_CURVE";

type Variable = string | undefined;
type EnvVar = { name: EnvVarName, value: Variable };

export type WebClientConfig = {
  readonly [key in EnvVarName]: string;
};

const envVars: EnvVar[] = [
  { name: 'SERVER_URL', value: process.env.SERVER_URL },
  { name: 'SECURITY_ENCRYPTION_ALG_NAME', value: process.env.SECURITY_ENCRYPTION_ALG_NAME },
  { name: 'SECURITY_ENCRYPTION_KEY_LENGTH', value: process.env.SECURITY_ENCRYPTION_KEY_LENGTH },
  { name: 'SECURITY_DERIVE_ALG_NAME', value: process.env.SECURITY_DERIVE_ALG_NAME },
  { name: 'SECURITY_DERIVE_ALG_NAMED_CURVE', value: process.env.SECURITY_DERIVE_ALG_NAMED_CURVE },
]

const env = (envVarName: EnvVarName): string => {
  const envVar = envVars.find(({ name }) => name == envVarName);
  if (!envVar || !envVar.value) {
    throw new Error(`${envVarName} was not set as an environment variable!`);
  }
  return envVar.value;
}

const config: WebClientConfig = Object.freeze<WebClientConfig>({
  SERVER_URL: env('SERVER_URL'),
  SECURITY_ENCRYPTION_ALG_NAME: env('SECURITY_ENCRYPTION_ALG_NAME'),
  SECURITY_ENCRYPTION_KEY_LENGTH: env('SECURITY_ENCRYPTION_KEY_LENGTH'),
  SECURITY_DERIVE_ALG_NAME: env('SECURITY_DERIVE_ALG_NAME'),
  SECURITY_DERIVE_ALG_NAMED_CURVE: env('SECURITY_DERIVE_ALG_NAMED_CURVE'),
});

export default config;
