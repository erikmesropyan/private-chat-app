export interface ResponseModel {
  status: Statuses;
  token?: string;
  data?: any;
  message?: string;
}

export enum Statuses {
  success = 'success',
  fail = 'fail',
  error = 'error'
}
