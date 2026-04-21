import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Environment, Html, Center } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/pixellabs-glb-3347.glb')
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  )
}

export function Demo3dModelPage() {
  return (
    <div style={{ width: '100%', height: '100vh', background: '#12102A', position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 16, left: 24, zIndex: 10,
        color: '#AFA9EC', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        3D Model Viewer
      </div>
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.4} />
        <Suspense fallback={<Html center><span style={{ color: '#AFA9EC' }}>Loading…</span></Html>}>
          <Model />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls enableDamping dampingFactor={0.08} />
      </Canvas>
    </div>
  )
}
