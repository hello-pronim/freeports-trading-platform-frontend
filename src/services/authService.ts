import { CurrentUser } from "../types/User";
import axios from "../util/axios";

interface LoginParamsType {
  email: string;
  password: string;
}

interface LoginTokenResponseType {
  tokenType: string;
  accessToken: string;
  accessTokenExpires: string;
  refreshToken: string;
  refreshTokenExpires: string;
}
export interface LoginResponseType {
  user: CurrentUser;
  token: LoginTokenResponseType;
  isOTPDefined: boolean;
}
interface ResetPasswordParamsType {
  password: string;
  token: string;
}
interface ResetPasswordResponseType {
  success: boolean;
}
interface UpdatePasswordParamsType {
  currentPassword: string;
  newPassword: string;
}

const login = (credentials: LoginParamsType): Promise<LoginResponseType> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/auth/login`, credentials)
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

const qrCodeGen = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    axios
      .post("/auth/2fa/generate", null, { responseType: "arraybuffer" })
      .then((res: any) => {
        return resolve(Buffer.from(res.data, "binary").toString("base64"));
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

const otpCheck = (otpCode: string): Promise<LoginResponseType> => {
  return new Promise((resolve, reject) => {
    axios
      .post("/auth/2fa/authenticate", {
        code: otpCode,
      })
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

const publicKey = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios
      .get("my/public-key")
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

const resetPassword = (
  userId: string,
  params: ResetPasswordParamsType
): Promise<ResetPasswordResponseType> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/auth/${userId}/setpassword`, params)
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

const updatePassword = (
  userId: string,
  params: UpdatePasswordParamsType
): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios
      .post(`/auth/${userId}/password`, params)
      .then((res: any) => {
        return resolve(res.data);
      })
      .catch((err) => {
        return reject(err.response.data);
      });
  });
};

export {
  login as default,
  login,
  qrCodeGen,
  otpCheck,
  publicKey,
  resetPassword,
  updatePassword,
};
