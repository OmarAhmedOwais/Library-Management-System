import jwt from 'jsonwebtoken';

interface GenerateTokenPayload {
  id: number;
}
export const generateToken = (payload: GenerateTokenPayload): string => {
  const createdAt = Date.now();
  return jwt.sign({ ...payload, createdAt }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

interface VerifyTokenPayload extends GenerateTokenPayload {
  createdAt: number;
}

export const verifyToken = (token: string): VerifyTokenPayload => {
  return <VerifyTokenPayload>jwt.verify(token, process.env.JWT_SECRET!);
};
