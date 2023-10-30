import { MASKS } from "@/utils/mask";
import {
  ChangeEvent,
  useState,
  useImperativeHandle,
  forwardRef,
  InputHTMLAttributes,
  useRef,
  useEffect,
} from "react";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";

export interface InputHandle {
  getUnmaskedValue: () => string | number | undefined;
  getName: () => string;
  setValue: (v: string) => void;
  setError: (e: string) => void;
  dismissError: () => void;
  focus?: () => void;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  mask?: keyof typeof MASKS;
  loading?: boolean;
  Icon?: IconType;
  className?: string;
  onChange?: () => void;
  valor?: string | number;
}

export const Input = forwardRef<InputHandle, InputProps>(
  (
    {
      label,
      mask,
      name,
      loading,
      maxLength,
      valor,
      Icon,
      className,
      onChange,
      ...props
    }: InputProps,
    ref
  ) => {
    const [value, setValue] = useState<string | number>();
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement | null>(null);

    const getName = () => name;
    const getUnmaskedValue = () =>
      mask && value ? MASKS[mask].unmask(value as string) : value;
    const setInputValue = (v: string) => setValue(v);
    const setInputError = (e: string) => setError(e);
    const dismissError = () => setError("");

    useImperativeHandle(ref, () => ({
      getName,
      getUnmaskedValue,
      setValue: setInputValue,
      setError: setInputError,
      dismissError,
    }));

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (error) {
        dismissError();
      }
      const { value } = e.target;
      if (maxLength && value.length >= maxLength) return;
      if (!value) {
        setValue("");
        return;
      }
      setValue(mask ? MASKS[mask].mask(value) : value);
    };
    useEffect(() => {
      if (valor) {
        setError("");
        setValue(valor);
      }
    }, [valor, setValue, setError]);

    useEffect(() => {
      onChange && onChange();
    }, [value, onChange]);

    const classes = twMerge(
      "border-neutral-02 border-2 rounded-lg w-full max-w-[500px] h-14 px-14 bg-white placeholder:text-zinc-400 placeholder:font-sans placeholder:font-light placeholder:text-xl disabled:bg-zinc-300",
      className
    );

    return (
      <div className="flex flex-col gap-2">
        <label className="font-sans text-lg font-medium" htmlFor={name}>
          {label}
        </label>
        <div className="flex flex-col gap-1">
          <div className="relative w-full">
            {Icon && (
              <Icon
                className="absolute top-0 bottom-0 mx-0 my-auto left-4 w-7 h-7 fill-zinc-400 cursor-text"
                onClick={() => inputRef.current?.focus()}
              />
            )}
            <input
              className={classes}
              id={name}
              value={value}
              onChange={handleChange}
              disabled={loading}
              ref={inputRef}
              {...props}
            />
          </div>
          <span className="h-3 text-xs text-error">{error}</span>
        </div>
      </div>
    );
  }
);
