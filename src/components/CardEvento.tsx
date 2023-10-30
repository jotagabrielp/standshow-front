interface CardEventoProps {
  image?: string;
  title: string;
  onClick?: () => void;
}

export const CardEvento = ({ title, onClick }: CardEventoProps) => {
  return (
    <div
      className="flex flex-col w-fit hover:scale-[1.05] transition-all cursor-pointer"
      onClick={onClick}
    >
      <img
        alt={`Imagem do evento: ${title}`}
        src="https://placehold.co/300x200"
        className="rounded-t-md"
      />
      <div className="px-2 py-1 text-white bg-primary-04 rounded-b-md">
        <span>{title}</span>
      </div>
    </div>
  );
};
