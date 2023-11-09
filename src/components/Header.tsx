import { useAuth } from "@/context/auth/useAuth";
import { useUsuariosContext } from "@/context/users/useUsuariosContext";
import { FaSignOutAlt } from "react-icons/fa";

export const Header = ({ className }: { className?: string }) => {
  const { signOut } = useAuth();
  const { usuarioAtual } = useUsuariosContext();
  return (
    <header
      className={`top-0 flex flex-row justify-between w-full px-3 py-2 text-white bg-primary-01 ${className}`}
    >
      <span>Stand Show</span>
      <span
        className="flex flex-row items-center justify-center gap-2 cursor-pointer"
        onClick={signOut}
      >
        {usuarioAtual?.nome} <FaSignOutAlt />
      </span>
    </header>
  );
};
