import pautaimg from "@/assets/gantt.jfif";
import { Title } from "@/components";

export const Pauta = () => {
  return (
    <div className="flex flex-col w-full gap-20 p-16">
      <Title>Pauta</Title>
      <img src={pautaimg} className="w-[70%]" />
    </div>
  );
};
