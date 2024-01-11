import { add } from 'date-fns';

import { cryptoHash, generateRandomCode, prisma, sendEmail } from '@/utils';
const CODE_EXPIRE_TIME = 10; // minutes

// TODO: Update Html
const HTML = (code: string) => `
    <h1>Forget Password</h1>
    <h2>Your Reset Code is: ${code}</h2>
    <h3>Use this code to reset your password</h3>
    <p>Code will expire in ${CODE_EXPIRE_TIME} minutes</p>
`;

export const sendForgetPasswordEmail = async (email: string): Promise<void> => {
  const code = generateRandomCode();
  const expiredAt = add(new Date(), { minutes: CODE_EXPIRE_TIME }).getTime();
  await prisma.forgetPassword.create({
    data: {
      code: cryptoHash(code),
      email,
      expiredAt,
    },
  });

  await sendEmail({
    from: process.env.Email!,
    to: [email],
    subject: 'Forget Password',
    text: `Your Reset Code is: ${code}`,
    html: HTML(code),
  });
};
