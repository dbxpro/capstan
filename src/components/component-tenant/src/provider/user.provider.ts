import { getRepository } from '../../../../services/service-data-source';
import User from '../model/user.entity';
import type { ResponseModel } from '../../../components-shared/index';
import { RESPONSE_STATUS } from '../../../components-shared/index';

export function getUserByUserID(
  userID: number,
  correlationID: number,
  includeTenant: boolean = true
): ResponseModel<Promise<User> | undefined> {
  const repo = getRepository(User);

  try {
    const user: Promise<User> = repo.findOneOrFail({
      where: {
        userID,
        status: 'ACTIVE',
      },
      relations: {
        tenant: includeTenant,
      },
    });

    return {
      data: user,
      status: RESPONSE_STATUS.SUCCESS,
    };
  } catch (error) {
    // todo logging the error
    // console.log(error, correlationID);
  }

  return {
    status: RESPONSE_STATUS.FAILED,
  };
}
