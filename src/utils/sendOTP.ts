type TSendOtp = {
  phoneNumber: string;
  code: number;
};
export async function sendOTP({ phoneNumber, code }: TSendOtp) {
  return code + phoneNumber;
}
