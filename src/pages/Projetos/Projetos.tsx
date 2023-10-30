import { useEffect, useState } from "react";
import { DDSLoader } from "three-stdlib";

import * as THREE from "three";

import { Title, ApiComponent } from "@/components";

import useApi from "@/hooks/useApi";

import { getProjetosUrl } from "@/utils/url";

import { Stand } from "@/types/stand";

import img1 from "@/assets/img1.jpg";
import img2 from "@/assets/img2.jpg";
import img3 from "@/assets/img3.jpg";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.jpg";
import img7 from "@/assets/img7.jpg";
import { Modal } from "./Modal";
import { Table } from "@/components/Table";
import { useEventosContext } from "@/context/eventos/useEventosContext";

const images = [img1, img2, img3, img4, img5, img6, img7];

THREE.DefaultLoadingManager.addHandler(/\.dds$/i, new DDSLoader());

export const Projetos = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { fetchData } = useEventosContext() || {};
  const [image, setImage] = useState<string>();

  const { loading, error, response } = useApi<Stand[]>({
    url: getProjetosUrl(),
    method: "GET",
  });
  useEffect(() => {
    fetchData?.();
  }, [fetchData]);

  return (
    <>
      <div className="p-10 bg-neutral-03">
        <div className="flex flex-col items-center h-full gap-10 p-10 bg-white rounded-lg">
          <div className="flex flex-row justify-between w-full">
            <Title>Projetos</Title>
          </div>
          <ApiComponent error={error} loading={loading}>
            <div className="flex flex-col items-center justify-center h-full align-center">
              <Table items={response} openModal={() => setIsOpen(true)} />
            </div>
          </ApiComponent>
        </div>
      </div>

      <Modal
        images={images}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        setImage={setImage}
      />
      {image && (
        <div
          onClick={() => setImage(undefined)}
          className="absolute z-40 flex items-center justify-center w-full h-full overflow-hidden bg-gray-900/60"
        >
          <img src={image} className="relative w-2/3" />
        </div>
      )}
    </>
  );
};
