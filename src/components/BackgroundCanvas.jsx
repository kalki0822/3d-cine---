import React, { useEffect, useRef, useState } from 'react';
import { SceneManager } from '../scene/SceneManager';
import { AlertCircle } from 'lucide-react';

export default function BackgroundCanvas({ onSceneReady }) {
  const canvasRef = useRef(null);
  const sceneManagerRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Check if WebGL is supported
    let gl = null;
    try {
      gl = canvasRef.current.getContext('webgl2', { powerPreference: 'high-performance' }) ||
           canvasRef.current.getContext('webgl');
    } catch (e) {
      console.warn('WebGL context check exception:', e);
    }

    if (!gl) {
      console.warn('WebGL not supported on this browser/GPU environment.');
      setWebglSupported(false);
      if (onSceneReady) {
        onSceneReady({
          setScrollProgress: () => {},
          setStageProgress: () => {},
          resize: () => {},
          dispose: () => {}
        });
      }
      return;
    }

    try {
      const sceneManager = new SceneManager(canvasRef.current);
      sceneManagerRef.current = sceneManager;

      if (onSceneReady) {
        onSceneReady(sceneManager);
      }

      const handleResize = () => {
        if (sceneManagerRef.current) {
          sceneManagerRef.current.resize(window.innerWidth, window.innerHeight);
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (sceneManagerRef.current) {
          sceneManagerRef.current.dispose();
        }
      };
    } catch (err) {
      console.error('SceneManager initialization error:', err);
      setWebglSupported(false);
      if (onSceneReady) {
        onSceneReady({
          setScrollProgress: () => {},
          setStageProgress: () => {},
          resize: () => {},
          dispose: () => {}
        });
      }
    }
  }, [onSceneReady]);

  return (
    <>
      <div id="webgl-canvas-container">
        <canvas ref={canvasRef} id="cinematic-canvas" />
      </div>
      <div className="canvas-vignette" />

      {/* Graceful Fallback if WebGL is unsupported */}
      {!webglSupported && (
        <div className="webgl-fallback-banner">
          <AlertCircle size={16} />
          <span>Interactive 3D hardware acceleration is unavailable on your display adapter. Product specifications, dosage data, and supply catalogues remain fully accessible.</span>
        </div>
      )}
    </>
  );
}
