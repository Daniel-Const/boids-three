import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Flock } from "./Flock.tsx";
import "./index.css";
import { CustomSpotLight } from "./Light.tsx";
import {
  ParamInputs,
  useTuneableParams,
  type TuneableParams,
} from "./Params.tsx";

export const App = () => {
  const { params, setParams } = useTuneableParams();
  return (
    <>
      <ChakraProvider value={defaultSystem}>
        <ParamInputs
          params={params}
          onChange={(update: Partial<TuneableParams>) => {
            setParams({ ...params, ...update });
          }}
        />
      </ChakraProvider>

      <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={Math.PI / 4} color={"white"} />
        <CustomSpotLight
          helper={false}
          position={[8, 8, 8]}
          angle={0.3}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
          color={"green"}
        />
        <CustomSpotLight
          helper={false}
          position={[-8, 8, 6]}
          angle={0.3}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
          color={"blue"}
        />
        {/* VGB Box */}
        {/* <mesh>
              <boxGeometry args={[-10, 10, 1]} />
              <meshStandardMaterial wireframe />
            </mesh> */}
        <Flock key={params.TOTAL_BOIDS} params={params} />
        <OrbitControls />
      </Canvas>
    </>
  );
};
