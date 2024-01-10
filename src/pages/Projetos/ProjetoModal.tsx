import { Suspense, useEffect, useState } from "react";
import { DDSLoader } from "three-stdlib";

import * as THREE from "three";
import { Model } from "@/components/Model";
import { Canvas } from "@react-three/fiber";
import { MapControls } from "@react-three/drei";
import { Button } from "@/components";

import img1 from "@/assets/img1.jpg";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/img3.jpg";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.jpg";
import img7 from "@/assets/img7.jpg";
import Modal from "@/components/Modal";
import { Stand } from "@/types/stand";
import useApi from "@/hooks/useApi";
import { getAlteracaoUrl } from "@/utils/url";
import toast from "react-hot-toast";

const images = [img1, img2, img3, img4, img5, img6, img7];

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

interface ProjetoModalProps {
  project: Stand | null;
  onClose: () => void;
  setImage?: (image: string) => void;
}

export const ProjetoModal = ({
  setImage,
  project,
  onClose,
}: ProjetoModalProps) => {
  const [showAprovar, setShowAprovar] = useState(false);
  const [showAlterar, setShowAlterar] = useState(false);
  const [alteracao, setAlteracao] = useState("");

  const { fetchData, response, loading } = useApi({
    url: getAlteracaoUrl(),
    method: "POST",
    autoRun: false,
  });

  const handleAlteracao = () => {
    if (alteracao !== "") {
      fetchData({
        data: {
          uuidEstande: project?.uuid,
          descricao: alteracao,
        },
      });
    }
  };

  useEffect(() => {
    if (response) {
      onClose();
      toast.success("Alteração enviada com sucesso!");
    }
  }, [response, onClose]);
  return (
    <Modal isOpen={!!project} onClose={onClose}>
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
              onClick={() => setImage?.(image)}
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
            <>
              <textarea
                className="w-full border border-black rounded-md"
                placeholder="Descreva a alteração desejada:"
                onChange={(e) => setAlteracao(e.target.value)}
              />
              <Button
                onClick={handleAlteracao}
                label="enviar alteração"
                loading={loading}
                type="button"
              />
            </>
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
    </Modal>
  );
};
