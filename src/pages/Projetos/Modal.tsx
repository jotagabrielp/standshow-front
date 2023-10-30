import { Button } from "@/components";
import { Model } from "@/components/Model";
import { MapControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import ReactModal from "react-modal";

interface ModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string | undefined>>;
  images: string[];
}

export const Modal = ({ isOpen, setIsOpen, images, setImage }: ModalProps) => {
  const [showAprovar, setShowAprovar] = useState(false);
  const [showAlterar, setShowAlterar] = useState(false);
  const [showAlterado, setShowAlterado] = useState(false);
  return (
    <ReactModal
      isOpen={isOpen}
      className="relative flex w-[95%] mx-auto flex-col gap-4 p-5 mt-5 overflow-hidden bg-white rounded-md"
    >
      <span
        className="absolute cursor-pointer top-1 right-1"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        X
      </span>
      <div className="flex flex-row justify-between w-full h-full">
        <div className="w-1/2 border border-black">
          <Suspense fallback={<p>Carregando...</p>}>
            <Canvas
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <ambientLight intensity={1} />
              <Model />
              <MapControls panSpeed={3} />
            </Canvas>
          </Suspense>
        </div>
        <div className="flex flex-row flex-wrap w-1/2 max-h-[850px] overflow-auto">
          {images.map((image, index) => (
            <img
              src={image}
              key={index}
              onClick={() => setImage(image)}
              className="w-[50%]"
            />
          ))}
        </div>
      </div>
      <div className="flex flex-row w-full gap-8">
        <div className="flex items-center justify-center w-full">
          {showAprovar ? (
            <p className="text-lg font-medium text-center">
              Projeto aprovado, NFS será disponibilizada em até 24 hrs!
            </p>
          ) : (
            <Button
              onClick={() => setShowAprovar(true)}
              disabled={showAlterar}
              label="Aprovar"
              type="button"
              className="w-full"
            />
          )}
        </div>
        <div className="flex flex-row w-full gap-2">
          {showAlterar ? (
            showAlterado ? (
              <p className="text-lg font-medium text-center">
                Solcitação de alteração enviada!
              </p>
            ) : (
              <>
                <textarea
                  className="w-full border border-black rounded-md"
                  placeholder="Descreva a alteração desejada:"
                />
                <Button
                  onClick={() => setShowAlterado(true)}
                  label="enviar alteração"
                  type="button"
                />
              </>
            )
          ) : (
            <Button
              disabled={showAprovar}
              onClick={() => setShowAlterar(true)}
              label="Pedir alteração"
              type="button"
              className="w-full"
            />
          )}
        </div>
      </div>
    </ReactModal>
  );
};
