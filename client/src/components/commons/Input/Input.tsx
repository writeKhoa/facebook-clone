import { FC } from "react";

interface Props {
  type?: string;
  name: string;
  value: string;
  placeholder: string;
  size?: "base" | "small";
  onChange: (e: any) => void;
  onFocus?: () => void;
  passProps?: any;
}

const Input: FC<Props> = ({
  name,
  size = "base",
  type = "text",
  placeholder,
  onChange,
  onFocus,
  value,
  ...passProps
}) => {
  const sizeInput =
    size === "small" ? "p-[11px] text-1516" : "px-4 py-[14px] text-1716";

  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      type={type}
      className={`w-full h-full rounded-md border border-divider focus:outline-none focus:border-primary placeholder:text-secondaryIcon ${sizeInput}`}
      placeholder={placeholder}
      autoComplete=""
      {...passProps}
    />
  );
};

export default Input;
