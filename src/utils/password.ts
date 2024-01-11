import * as bcrypt from 'bcryptjs';
export class Password {
  static hash(plainText: string): string {
    const salt = bcrypt.genSaltSync(Number(process.env.BCRYPT_SALT));
    return bcrypt.hashSync(plainText, salt);
  }

  static compare(plainText: string, hash: string): boolean {
    return bcrypt.compareSync(plainText, hash);
  }
}
