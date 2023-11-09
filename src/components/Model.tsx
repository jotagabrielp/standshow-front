import { useLoader } from "@react-three/fiber";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export const Model = () => {
  const materials = useLoader(MTLLoader, "/stand/stand.mtl");
  const obj = useLoader(OBJLoader, "/stand/stand.obj", (loader) => {
    materials.preload();
    loader.setMaterials(materials);
  });

  return (
    <primitive
      object={obj}
      scale={0.09}
      position={[-18, -20, -50]}
      rotation={[Math.PI / 0.5, 0, 0]}
    />
  );
};
