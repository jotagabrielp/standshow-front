import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
};

const Modal: React.FC<ModalProps> = ({
  className,
  isOpen,
  onClose,
  children,
}) => {
  const style = twMerge(
    "inline-block sm:w-fit h-fit px-5 py-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:w-full",
    className
  );
  return (
    <>
      {isOpen ? (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className={style}>
              <div
                className="flex justify-end w-full cursor-pointer"
                onClick={onClose}
              >
                <AiOutlineClose size={20} />
              </div>
              {children}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Modal;
