import { ReactNode } from "react";

interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => (
  <div className="flex items-center w-full h-screen gap-48 overflow-hidden bg-neutral-04 lg:h-full">
    {children}
  </div>
);
