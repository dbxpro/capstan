import { getRepository } from '../../../../services/service-data-source';
import User from '../model/user.entity';
import UserAuth from '../model/user-auth.entity';
import type { ResponseModel } from '../../../components-shared/index';
import { RESPONSE_STATUS } from '../../../components-shared/index';

export async function getUserByUserID(
  userID: number,
  isActive: boolean = true,
  includeTenant: boolean = true,
  includePermission: boolean = true,
  includeConfig: boolean = true
): Promise<ResponseModel<User | undefined>> {
  const repo = getRepository(User);

  try {
    const user: User = await repo.findOneOrFail({
      where: {
        userID,
      },
      relations: {
        tenant: includeTenant,
        configurations: includeConfig,
        permissions: includePermission,
      },
    });

    if (isActive && user.status !== 'ACTIVE') {
      return {
        message: 'inactive user',
        status: RESPONSE_STATUS.FAILED,
      };
    }

    return {
      data: user,
      status: RESPONSE_STATUS.SUCCESS,
    };
  } catch (error) {
    // todo logging the error
    console.log(error);
  }

  return {
    status: RESPONSE_STATUS.FAILED,
  };
}

export async function getUserIDByCredentials(
  userName: string,
  password: string
): Promise<ResponseModel<number | undefined>> {
  if (!userName || !password) {
    return {
      status: RESPONSE_STATUS.FAILED,
    };
  }

  try {
    const repo = getRepository(UserAuth);

    const crendentials = await repo.findOne({
      where: {
        userName,
        password,
      },
    });

    return {
      status: RESPONSE_STATUS.SUCCESS,
      data: crendentials?.userID,
    };
  } catch (error) {
    console.log(error);
  }

  return {
    status: RESPONSE_STATUS.FAILED,
  };
}
