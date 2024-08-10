import { getRepository } from '../../../../services/service-data-source';
import User from '../model/user.entity';
import UserAuth from '../model/user-auth.entity';
import type { ResponseModel } from '../../../components-shared/index';
import { RESPONSE_STATUS } from '../../../components-shared/index';

export async function getUserByUserID(
  userID: number,
  correlationID: string,
  includeTenant: boolean = true,
  includePermission: boolean = true,
  includeConfig: boolean = true
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
  };
}

export async function verifyCredentials(
  userName: string,
  password: string,
  correlationID: string
): Promise<ResponseModel<boolean>> {
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
        status: RESPONSE_STATUS.FAILED,
        message: 'credentials not match',
        data: false,
      };
    }

    const user = await getUserByUserID(
      userAuth.userID,
      correlationID,
      false,
      false,
      false
    );
    if (!user.data || user.data?.status !== 'ACTIVE') {
      return {
        status: RESPONSE_STATUS.FAILED,
        message: 'user is not active',
        data: false,
      };
    }

    return {
      status: RESPONSE_STATUS.SUCCESS,
      data: true,
    };
  } catch (error) {
    // todo logging the error
    console.log(error, correlationID);
  }

  return {
    data: false,
    status: RESPONSE_STATUS.FAILED,
  };
}
