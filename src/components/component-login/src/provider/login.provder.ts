import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import {
  getUserIDByCredentials,
  getUserByUserID,
} from '../../../component-tenant/index';
import { RESPONSE_STATUS } from '../../../components-shared';

export async function login(req: Request, res: Response): Promise<void> {
  const response = { status: RESPONSE_STATUS.FAILED, message: '' };
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      response.message = 'username or password missing';
      res.status(401).send(response);
      return Promise.resolve();
    }

    const { data: userId } = await getUserIDByCredentials(username, password);

    if (!userId) {
      response.message = 'incorrect credentials';
      res.status(401).send(response);
      return Promise.resolve();
    }

    const { data: user } = await getUserByUserID(
      userId!,
      true,
      true,
      false,
      false
    );

    if (
      !user ||
      user?.status !== 'ACTIVE' ||
      !user?.tenant ||
      user?.tenant?.status !== 'ACTIVE'
    ) {
      response.message = 'inactive user or tenant';
      res.status(403).send(response);
      return Promise.resolve();
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    const token = jwt.sign(
      {
        tenantID: user?.tenant?.tenantID,
        userID: user?.userID,
        exp: Math.floor(Date.now() / 1000) + 8 * 60 * 60,
      },
      process.env.JWT_SECRET
    );

    res.status(200).send({
      status: RESPONSE_STATUS.SUCCESS,
      data: token,
    });
    return Promise.resolve();
  } catch (error) {
    // todo logging the error
    console.log(error);
  }

  res.status(400).send({
    status: RESPONSE_STATUS.FAILED,
  });
  return Promise.resolve();
}
