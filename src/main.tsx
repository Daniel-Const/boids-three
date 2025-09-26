import { Canvas } from '@react-three/fiber'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Flock } from './Flock.tsx'
import { OrbitControls } from '@react-three/drei'

createRoot(document.getElementById('root')!).render(
  <Canvas>
    <color attach="background" args={["#3b3b5c"]} />
    <ambientLight intensity={Math.PI / 2} color={"green"} />
    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} color={"purple"} />
    <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
    {/* VGB Box */}
    {/* <mesh>
      <boxGeometry args={[-5, 5, 1]} />
      <meshStandardMaterial wireframe />
    </mesh> */}
    <Flock />
    <OrbitControls />
  </Canvas>
)
