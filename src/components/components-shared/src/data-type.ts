export type ResponseModel<Type> = {
  status: RESPONSE_STATUS;
  data?: Type;
  message?: string | undefined;
};

export enum RESPONSE_STATUS {
  // eslint-disable-next-line no-unused-vars
  SUCCESS,
  // eslint-disable-next-line no-unused-vars
  FAILED,
}
