import dynamic from 'next/dynamic';

// Dynamic import with ssr: false for Three.js canvas & WebXR browser APIs
const VolumetricCinemaViewer = dynamic(
  () => import('@/components/VolumetricCinemaViewer'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="w-full h-full min-h-screen">
      <VolumetricCinemaViewer />
    </main>
  );
}
