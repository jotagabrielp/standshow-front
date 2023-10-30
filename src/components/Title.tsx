import { ReactNode } from "react";
export const Title = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col w-fit">
      <span className="font-sans text-2xl font-semibold lg:text-3xl">
        {children}
      </span>
      <i className="w-full h-1 bg-gradient-to-b from-primary-04 to-primary-05 " />
    </div>
  );
};
