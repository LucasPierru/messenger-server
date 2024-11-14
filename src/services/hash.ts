import bcrypt from "bcrypt";

const saltRounds = 10;

const generateSalt = async () => {
  const salt = await bcrypt.genSalt(saltRounds);
  return salt;
};

export const hashPassword = async (password: string) => {
  const salt = await generateSalt();
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};
