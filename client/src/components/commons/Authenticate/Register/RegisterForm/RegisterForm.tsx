import { ProccessRegister } from "@/assets/images";
import { Button, Modal } from "@/components/commons";
import Input from "@/components/commons/Input";
import { QuestionIcon } from "@/components/commons/Icons";
import { useAuth } from "@/hooks";
import { payloadRegister } from "@/models";
import { useEffect, useState } from "react";
import MoreResearch from "../MoreResearch";
import SelectGender from "./SelectGender";
import SelectPronouce from "./SelectPronounce";
import SelectTime from "./SelectTime";

const RegisterForm = () => {
  const time = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenRegisterSuccess, setIsOpenRegisterSuccess] = useState(false);
  const { register, login } = useAuth();
  const [errorMsg, setErrorMsg] = useState("");
  const [account, setAccount] = useState<payloadRegister>({
    firstName: "",
    surnName: "",
    account: "",
    password: "",
    date: time.getDate(),
    month: time.getMonth() + 1,
    year: time.getFullYear(),
    gender: undefined,
    pronounce: "-1",
    pronounceCustom: "",
  });

  const handleOnChange = (e: any) => {
    setAccount((pre) => {
      return {
        ...pre,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleFocus = () => {
    setErrorMsg("");
  };

  const isNumberPhone = (numberPhone: string) => {
    const re = /^\d{10}$/;
    return re.test(numberPhone);
  };

  const handleLogin = async () => {
    try {
      await login({ account: account.account, password: account.password });
    } catch (error) {
      if (typeof error === "string") {
        setErrorMsg(error);
      }
      setIsOpenRegisterSuccess(false);
    }
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsLoading(true);
      if (
        !account.firstName ||
        !account.surnName ||
        !account.password ||
        !account.account ||
        !account.gender
      ) {
        throw "Vui lòng điền đầy đủ các trường";
      }
      if (
        !(
          account.gender !== 2 ||
          !!account.pronounceCustom ||
          account.pronounce !== "-1"
        )
      ) {
        throw "Vui lòng chọn danh xưng hoặc tùy chỉnh danh xưng";
      }

      if (account.gender === 2) {
        if (account.pronounceCustom) {
          await register({ ...account, pronounce: account.pronounceCustom });
        } else {
          await register({ ...account, pronounce: account.pronounce });
        }
      }
      await register({
        ...account,
        pronounce: undefined,
        pronounceCustom: "",
      });

      setErrorMsg("");
      setIsOpenRegisterSuccess(true);
    } catch (error) {
      if (typeof error === "string") {
        setErrorMsg(error);
      }
      const myError: any = error;
      if (typeof myError?.response.data.error === "string") {
        setErrorMsg(myError.response.data.error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setAccount({
        firstName: "",
        surnName: "",
        account: "",
        password: "",
        date: time.getDate(),
        month: time.getMonth() + 1,
        year: time.getFullYear(),
        gender: undefined,
        pronounce: "-1",
        pronounceCustom: "",
      });
      setErrorMsg("");
      setIsOpenRegisterSuccess(false);
    };
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="h-[50px] flex">
          <div className="mb-2 mr-2">
            <Input
              placeholder="Họ"
              size="small"
              name="firstName"
              value={account.firstName}
              onChange={handleOnChange}
              onFocus={handleFocus}
            />
          </div>

          <div className="mb-2">
            <Input
              placeholder="Tên"
              size="small"
              name="surnName"
              value={account.surnName}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="mb-[10px]">
          <Input
            placeholder="Số di động hoặc email"
            size="small"
            name="account"
            value={account.account}
            onChange={handleOnChange}
          />
        </div>

        <div className="mb-[10px]">
          <Input
            placeholder="Mật khẩu mới"
            size="small"
            name="password"
            value={account.password}
            onChange={handleOnChange}
          />
        </div>

        <div>
          <div className="text-1220 flex items-center">
            Sinh nhật{" "}
            <i className="ml-1">
              <QuestionIcon />
            </i>
          </div>
          <div className="flex justify-between">
            <SelectTime
              type="date"
              name="date"
              value={account.date}
              onChange={handleOnChange}
            />
            <SelectTime
              type="month"
              name="month"
              value={account.month}
              onChange={handleOnChange}
            />
            <SelectTime
              type="year"
              name="year"
              value={account.year}
              onChange={handleOnChange}
            />
          </div>
        </div>

        <div className="mt-[10px]">
          <div className="text-1220 flex items-center">
            Giới tính{" "}
            <i className="ml-1">
              <QuestionIcon />
            </i>
          </div>
          <div className="flex -mx-[6px]">
            <SelectGender
              name="gender"
              onChange={handleOnChange}
              value={account.gender}
            />
          </div>
        </div>

        {String(account.gender) === "2" ? (
          <div className="mt-[10px]">
            <div className="my-1">
              <SelectPronouce
                name="pronounce"
                onChange={handleOnChange}
                value={String(account.pronounce)}
              />
            </div>
            <div>
              <div className="flex items-center text-1215 text-primaryText">
                Danh xưng của bạn hiển thị với tất cả mọi người.
              </div>
              <div className="my-2">
                <Input
                  size="small"
                  placeholder="Giới tính (Không bắt buộc)"
                  name="pronounceCustom"
                  value={account.pronounceCustom}
                  onChange={handleOnChange}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-[11px] mb-5 text-1215 text-textAuth">
          <MoreResearch />
        </div>

        <div className="text-center text-red-500">
          <span>{errorMsg}</span>
        </div>

        <div className="relative w-[194px] mx-auto my-[10px] h-9 text-center">
          <Button size="small" variant="secondary" type="submit">
            Đăng ký
          </Button>
          {isLoading ? (
            <div className="absolute top-3 -right-9">
              <img src={ProccessRegister} alt="" />
            </div>
          ) : null}
        </div>
      </form>
      <Modal wrapperId="alert-register-success" isOpen={isOpenRegisterSuccess}>
        <div className="fixed inset-0 w-screen h-screen bg-space z-50">
          <div className="flex items-center justify-center w-screen h-screen">
            <div className="w-96 border-divider rounded-md p-4 shadow-md">
              <h2 className="text-2024 font-bold text-right">
                Đã xác nhận tài khoản
              </h2>
              <p>
                Bạn đã xác nhận thành công tài khoản của mình bằng{" "}
                {isNumberPhone(account.account) ? "số điện thoại" : "email"}{" "}
                <span className="font-semibold text-primaryText">
                  {account.account}
                </span>
                . Bạn sẽ sử dụng{" "}
                {isNumberPhone(account.account)
                  ? "số điện thoại"
                  : "địa chỉ email"}{" "}
                này để đăng nhập.
              </p>
              <div className="w-20 ml-auto mt-3">
                <Button
                  variant="primary"
                  size="small"
                  minWidth={80}
                  onClick={handleLogin}
                >
                  Ok
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RegisterForm;
