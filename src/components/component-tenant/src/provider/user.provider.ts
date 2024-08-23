import { getRepository } from '../../../../services/service-data-source';
import User from '../model/user.entity';
import UserAuth from '../model/user-auth.entity';
import type { ResponseModel } from '../../../components-shared/index';
import { RESPONSE_STATUS } from '../../../components-shared/index';
import * as express from 'express';

export async function getUserByUserID(
  req: express.Request,
  res: express.Response
): Promise<express.Response<any>> {
  const userID = parseInt(req.params.id);

  console.log('getUserByUserID', JSON.stringify({ userID }));
  const { data, status, message } = await getUserByUserIDHandler(userID, '1');

  if (status === RESPONSE_STATUS.SUCCESS) {
    return res.status(200).json({
      data: {
        user: data,
      },
      status: RESPONSE_STATUS.SUCCESS,
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
    message: 'An unexpected error occurred when finding the user',
  });
}

export async function getUserByUserIDHandler(
  userID: number,
  correlationID: string,
  includeTenant: boolean = true,
  includePermission: boolean = true,
  includeConfig: boolean = true,
  includeUserInformation: boolean = true
): Promise<ResponseModel<User | undefined>> {
  const repo = getRepository(User);

  try {
    const user: User = await repo.findOneOrFail({
      where: {
        userID,
        status: 'ACTIVE',
      },
      relations: {
        tenant: includeTenant,
        configurations: includeConfig,
        permissions: includePermission,
        userInfo: includeUserInformation,
      },
    });

    return {
      data: user,
      status: RESPONSE_STATUS.SUCCESS,
    };
  } catch (error) {
    // todo logging the error
    console.log(error, correlationID);
  }

  return {
    status: RESPONSE_STATUS.FAILED,
    message: 'cannot find the active user',
  };
}

export async function verifyCredentials(
  userName: string,
  password: string,
  correlationID: string
): Promise<ResponseModel<number | undefined>> {
  const repo = getRepository(UserAuth);

  try {
    // todo
    // decrypt username and pwd
    // base64 decode
    // private key encode
    const userAuth = await repo.findOne({
      where: {
        userName,
        password,
      },
    });

    if (!userAuth?.userID) {
      return {
        status: RESPONSE_STATUS.MISMATCH,
        message: 'credentials not match',
      };
    }

    const user = await getUserByUserIDHandler(
      userAuth.userID,
      correlationID,
      false,
      false,
      false
    );
    if (!user.data || user.data?.status !== 'ACTIVE') {
      return {
        status: RESPONSE_STATUS.UNAUTHORIZED,
        message: 'user is not active',
      };
    }

    return {
      status: RESPONSE_STATUS.SUCCESS,
      data: user.data.userID,
    };
  } catch (error) {
    // todo logging the error
    console.log(error, correlationID);
  }

  return {
    status: RESPONSE_STATUS.FAILED,
  };
}
