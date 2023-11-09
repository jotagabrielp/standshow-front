import { TailSpin } from "react-loader-spinner";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
  loading?: boolean;
  onClick?: () => void;
  type: "button" | "submit";
  className?: string;
  label: string;
  disabled?: boolean;
}

export const Button = ({
  loading,
  onClick,
  type,
  className,
  label,
  disabled,
}: ButtonProps) => {
  const style = twMerge(
    "flex items-center px-6 py-1 justify-center font-bold disabled:opacity-60 text-white uppercase rounded-md bg-primary-01",
    className
  );
  return (
    <button
      type={type}
      onClick={onClick}
      className={style}
      disabled={loading || disabled}
    >
      {loading ? <TailSpin color="white" width={24} height={24} /> : label}
    </button>
  );
};
