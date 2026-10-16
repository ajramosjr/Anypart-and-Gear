/** Match APG's configured password policy; never send or log the password here. */
export function getPasswordRequirements(password: string) {
  return [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "A lowercase letter (a–z)", met: /[a-z]/.test(password) },
    { label: "An uppercase letter (A–Z)", met: /[A-Z]/.test(password) },
    { label: "A number (0–9)", met: /[0-9]/.test(password) },
    { label: "A symbol (for example !, @ or #)", met: [...password].some(char => {
      const code = char.charCodeAt(0);
      return code >= 33 && code <= 126 && !/[A-Za-z0-9]/.test(char);
    }) },
  ];
}
export function isPasswordPolicyError(message: string) {
  return /password.*(?:should contain|at least|weak|character)/i.test(message);
}
