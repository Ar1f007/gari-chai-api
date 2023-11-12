export type Status = 'success' | 'fail' | 'error' | 'validationError';

export type TReqUser = {
  id: any;
  name: string;
  role: string[];
  phoneNumber: string;
};
