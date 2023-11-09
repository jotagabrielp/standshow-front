import orcamento1 from "@/assets/orcamento1.png";
import orcamento2 from "@/assets/orcamento2.png";
import { Button, Title } from "@/components";
import { useState } from "react";

export const Orcamento = () => {
  const [image, setImage] = useState<string>();
  return (
    <>
      <div className="flex flex-col w-full gap-10 p-16">
        <Title>Orcamento</Title>
        <div className="flex flex-row justify-center gap-8 h-[80%]">
          <img
            src={orcamento1}
            onClick={() => setImage(orcamento1)}
            className="h-[80%]"
          />
          <img
            src={orcamento2}
            onClick={() => setImage(orcamento2)}
            className="h-[80%]"
          />
        </div>
        <div className="flex flex-row w-full gap-12">
          <Button label="Aprovar" className="w-full" type="button" />
          <Button label="Negociar" className="w-full" type="button" />
        </div>
      </div>
      {image && (
        <div
          onClick={() => setImage(undefined)}
          className="absolute z-40 flex items-center justify-center object-cover w-full h-screen overflow-hidden bg-gray-900/60"
        >
          <img src={image} className="relative h-screen" />
        </div>
      )}
    </>
  );
};
