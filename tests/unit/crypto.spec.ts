import { comparePasswords, hashPassword } from '../../src/utils/crypto';

describe('crypto utils', () => {
  it('hashPassword should return hashed value different from plain text', async () => {
    const plainPassword = 'mySafePassword123';
    const hashedPassword = await hashPassword(plainPassword);

    expect(hashedPassword).toBeTruthy();
    expect(hashedPassword).not.toBe(plainPassword);
  });

  it('comparePasswords should validate matching password and hash', async () => {
    const plainPassword = 'mySafePassword123';
    const hashedPassword = await hashPassword(plainPassword);

    expect(comparePasswords(plainPassword, hashedPassword)).toBe(true);
    expect(comparePasswords('wrongPassword', hashedPassword)).toBe(false);
  });
});

