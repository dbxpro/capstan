import * as express from 'express';
import type { ResponseModel } from '../../../components-shared/index';
import { RESPONSE_STATUS } from '../../../components-shared/index';
import {
  getUserByUserIDHandler,
  verifyCredentials,
} from '../../../component-tenant/index';
import jwt from 'jsonwebtoken';

// Middleware to verify the token
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function verifyToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log('Entered middleware with token :', token);

  if (!token) {
    return res.status(401).json({
      status: RESPONSE_STATUS.UNAUTHORIZED,
      message: 'Access token is missing or invalid',
    });
  }

  const secret = 'capstainWay';

  jwt.verify(token, secret, (err: any) => {
    if (err) {
      return res.status(403).json({
        status: RESPONSE_STATUS.FAILED,
        message: 'Invalid token or session has expired',
      });
    }
    next(); // Proceed to the next middleware or route handler
  });
}

export async function login(
  req: express.Request,
  res: express.Response
): Promise<express.Response<any>> {
  // get userName & pwd from req
  const { userName, password } = req.body;
  console.log('login', JSON.stringify({ userName, password }));
  const { data, status, message } = await loginHandler(userName, password);

  if (status === RESPONSE_STATUS.SUCCESS) {
    return res.status(200).json({
      data: {
        accessToken: data,
      },
      status: RESPONSE_STATUS.SUCCESS,
    });
  }

  if (status === RESPONSE_STATUS.UNAUTHORIZED) {
    return res.status(401).json({
      status: RESPONSE_STATUS.UNAUTHORIZED,
      message: message,
    });
  }

  if (status === RESPONSE_STATUS.MISMATCH) {
    return res.status(403).json({
      status: RESPONSE_STATUS.MISMATCH,
      message: message,
    });
  }

  if (status === RESPONSE_STATUS.FAILED) {
    return res.status(500).json({
      status: RESPONSE_STATUS.FAILED,
      message: message,
    });
  }

  return res.status(500).json({
    status: RESPONSE_STATUS.FAILED,
    message: 'An unexpected error occurred',
  });
}

export async function loginHandler(
  userName: string,
  password: string
): Promise<ResponseModel<string | null>> {
  const { data: userID, status } = await verifyCredentials(
    userName,
    password,
    '4'
  );
  // const validUserLogIn: boolean | undefined = userLogInInfo.data;
  if (status === RESPONSE_STATUS.MISMATCH) {
    return {
      status: RESPONSE_STATUS.MISMATCH,
      message: 'mismatched userName and passowrd',
    };
  }

  if (status === RESPONSE_STATUS.UNAUTHORIZED) {
    return {
      status: RESPONSE_STATUS.UNAUTHORIZED,
      message: 'inactive user account',
    };
  }

  if (!userID) {
    return {
      status: RESPONSE_STATUS.FAILED,
      message: 'userID not found',
    };
  }

  const { data: user, status: userStatus } = await getUserByUserIDHandler(
    userID,
    '1',
    false,
    false,
    false,
    true
  );

  if (userStatus !== RESPONSE_STATUS.SUCCESS) {
    return {
      status: RESPONSE_STATUS.FAILED,
      message: 'failed to get user info',
    };
  }

  const email = user?.userInfo?.email;
  const fullName = user?.fullName;

  if (!email || !fullName) {
    return {
      status: RESPONSE_STATUS.FAILED,
      message: 'no email or fullName found for user',
    };
  }

  console.log('userEmail:', JSON.stringify(email));

  const payload = { fullName, email };
  // const secret = process.env.AUTHORIZATION_SECRET!;
  const secret = 'capstainWay';

  const token = jwt.sign(payload, secret, { expiresIn: '8h' });
  console.log(token);

  return {
    status: RESPONSE_STATUS.SUCCESS,
    data: token,
  };
}
