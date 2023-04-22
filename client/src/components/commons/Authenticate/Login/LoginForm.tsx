import { FC, useEffect, useState } from "react";
import Input from "@/components/commons/Input";
import { EyeVisibleIcon, EyeInvisibleIcon } from "@/components/commons/Icons";
import { Button } from "@/components/commons";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks";

interface Props {
  onOpenRegister: () => void;
}

const LoginForm: FC<Props> = ({ onOpenRegister }) => {
  const { login } = useAuth();
  const [account, setAccount] = useState({ account: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isShowEye, setIsShowEye] = useState(false);
  const handleOnChange = (e: any) => {
    setAccount((pre) => {
      return {
        ...pre,
        [e.target.name]: e.target.value,
      };
    });
  };
  const handleFocus = () => setErrorMsg("");
  const handleVisiblePassword = () => setIsVisiblePassword((pre) => !pre);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (!account.account || !account.password) {
        throw "Vui lòng điền đầy đủ các ttrường";
      }
      await login(account);
    } catch (error) {
      const myError: any = error;

      if (typeof myError?.response?.data?.error === "string") {
        setErrorMsg(myError?.response?.data?.error);
      }
    }
  };

  useEffect(() => {
    if (account.password) {
      setIsShowEye(true);
    }
  }, [account.password]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="px-4">
        <div>
          <div className="py-[6px]">
            <Input
              placeholder="Email hoặc số điện thoại"
              name="account"
              value={account.account}
              onChange={handleOnChange}
              onFocus={handleFocus}
            />
          </div>

          <div className="py-[6px] relative">
            <Input
              placeholder="Mật khẩu"
              type={isVisiblePassword ? "text" : "password"}
              name="password"
              value={account.password}
              onChange={handleOnChange}
              onFocus={handleFocus}
            />
            {isShowEye ? (
              <button
                type="button"
                onClick={handleVisiblePassword}
                className="absolute right-2 top-4 flex items-center justify-center w-7 h-7 rounded-full hover:bg-black/5 cursor-pointer"
              >
                {isVisiblePassword ? (
                  <i>
                    <EyeVisibleIcon />
                  </i>
                ) : (
                  <i>
                    <EyeInvisibleIcon />
                  </i>
                )}
              </button>
            ) : null}
          </div>
        </div>

        <div className="text-center">
          {errorMsg ? <span className="text-red-500">{errorMsg}</span> : null}
        </div>

        <div className="pt-[6px]">
          <Button variant="primary" type="submit">
            Đăng nhập
          </Button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to={"/notdevelopment"}
            className="text-sm text-primary hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <div className="my-5 mx-1 border-b-[1px] border-border"></div>

        <div className="pt-[6px] text-center mx-auto">
          <Button variant="secondary" onClick={onOpenRegister}>
            Tạo tài khoản mới
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
