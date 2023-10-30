import { useAuth } from "@/context/auth/useAuth";
import { FaSignOutAlt } from "react-icons/fa";

export const Header = ({ className }: { className?: string }) => {
  const { user, signOut } = useAuth() || {};
  return (
    <header
      className={`top-0 flex flex-row justify-between w-full px-3 py-2 text-white bg-primary-01 ${className}`}
    >
      <span>Stand show</span>
      <span
        className="flex flex-row items-center justify-center gap-2 cursor-pointer"
        onClick={signOut}
      >
        {user?.name} <FaSignOutAlt />
      </span>
    </header>
  );
};
