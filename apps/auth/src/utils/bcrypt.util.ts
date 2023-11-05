import * as bcrypt from 'bcryptjs';
export const hassPass = async (password: string) =>
  await bcrypt.hash(password, 8);

export const comparePass = async (passA: string, passB: string) =>
  await bcrypt.compare(passA, passB);
