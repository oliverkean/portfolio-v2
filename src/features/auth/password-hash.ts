import bcrypt from "bcryptjs";

const bcryptHashPattern = /^\$2[aby]\$(0[4-9]|[12]\d|3[01])\$[./A-Za-z0-9]{53}$/;

export function isBcryptPasswordHash(value: string) {
  return bcryptHashPattern.test(value);
}

export async function resolvePasswordHash(options: {
  password: string;
  passwordHash?: string;
  saltRounds?: number;
}) {
  const passwordHash = options.passwordHash?.trim();

  if (passwordHash) {
    if (!isBcryptPasswordHash(passwordHash)) {
      throw new Error("OWNER_PASSWORD_HASH must be a valid bcrypt hash.");
    }

    return passwordHash;
  }

  return bcrypt.hash(options.password, options.saltRounds ?? 12);
}
