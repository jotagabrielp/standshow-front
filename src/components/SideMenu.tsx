import { AiFillDashboard, AiFillCalendar, AiFillProject } from "react-icons/ai";
import { Link } from "react-router-dom";
const LINKS = [
  {
    icon: AiFillDashboard,
    name: "Projetos",
    to: "",
  },
  {
    icon: AiFillCalendar,
    name: "Eventos",
    to: "eventos",
  },
  {
    icon: AiFillProject,
    name: "Briefing",
    to: "projetos/adicionar",
  },
];
export const SideMenu = ({ className }: { className?: string }) => {
  return (
    <div className={`flex flex-col gap-4 px-1 py-2 bg-primary-03 ${className}`}>
      {LINKS.map((link, index) => (
        <Link to={link.to} key={index} className="w-fit">
          <span className="flex items-center text-neutral-04 transition-all w-fit hover:scale-[1.05] gap-1">
            <link.icon className="fill-neutral-04" />
            {link.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
