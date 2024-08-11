/**
 * Checks if an environment variable is defined and not an empty string.
 *
 * @param value - The environment variable value.
 * @param defaultValue - The default value to be returned if the environment variable is not defined or is an empty string.
 * @returns The environment variable value or the default value.
 *
 */

export const getEnvVariable = (
  value: string | undefined,
  defaultValue: string,
): string => {
  return value && value !== "" ? value.trim() : defaultValue;
};
