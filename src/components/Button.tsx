import { TailSpin } from "react-loader-spinner";

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
}: ButtonProps) => (
  <button
    type={type}
    onClick={onClick}
    className={`flex items-center justify-center py-3 text-xl font-bold disabled:opacity-60 text-white uppercase rounded-md bg-primary-02 ${className}`}
    disabled={loading || disabled}
  >
    {loading ? <TailSpin color="white" width={24} height={24} /> : label}
  </button>
);
