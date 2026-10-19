import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Sections from './components/Sections';
import ScrollStoryboard from './components/ScrollStoryboard';
import './styles/cinematic.css';

export default function App() {
  const [sceneManager, setSceneManager] = useState(null);

  useEffect(() => {
    if (!sceneManager) return;
    const params = new URLSearchParams(window.location.search);
    const testProgress = params.get('progress');
    if (testProgress !== null) {
      sceneManager.setScrollProgress(parseFloat(testProgress));
    }
  }, [sceneManager]);

  return (
    <div className="cinematic-root">
      {/* 1. Full-Viewport Persistent 3D WebGL Canvas */}
      <BackgroundCanvas onSceneReady={setSceneManager} />

      {/* 2. Top Navigation */}
      <Navbar />

      {/* 3. HTML Storyboard Sections layered on top */}
      <Sections />

      {/* 4. GSAP ScrollTrigger Orchestrator */}
      <ScrollStoryboard sceneManager={sceneManager} />
    </div>
  );
}
