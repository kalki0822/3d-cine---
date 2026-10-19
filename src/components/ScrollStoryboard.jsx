import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStoryboard({ sceneManager }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Showcase Track and Panels
    const track = document.querySelector('.showcase-pin-track');
    const viewport = document.querySelector('.showcase-viewport');
    const panels = [
      document.querySelector('#hero-panel'),
      document.querySelector('#pharma-panel'),
      document.querySelector('#devices-panel'),
      document.querySelector('#diagnostic-panel'),
      document.querySelector('#sourcing-panel')
    ];
    const navLinks = document.querySelectorAll('.nav-link');

    if (!track) return;

    // Coordinated update for 3D scene, panels, and nav links
    const updateProgressState = (p) => {
      const clampedP = Math.max(0, Math.min(1, p));

      // A. Direct 1:1 control of 3D Scene animations and component separations (if available)
      if (sceneManager && typeof sceneManager.setScrollProgress === 'function') {
        sceneManager.setScrollProgress(clampedP);
      }

      // B. Coordinated text panel opacity, transform & explicit visibility
      // Milestones strictly locked with SceneManager (localP 0.00-0.90 held; 0.90-1.00 transition)
      panels.forEach((panel, i) => {
        if (!panel) return;
        const stageStart = i * 0.20;
        const stageEnd = (i + 1) * 0.20;
        const stageRange = 0.20;

        let opacity = 0;
        let translateY = 30;

        if (clampedP >= stageStart && clampedP < stageEnd) {
          const localP = (clampedP - stageStart) / stageRange;

          if (localP <= 0.90) {
            // Actively presenting: 100% static, readable, in place
            opacity = 1.0;
            translateY = 0;
          } else {
            // Outgoing transition: smoothly moves up and fades out
            if (i === 4) {
              opacity = 1.0;
              translateY = 0;
            } else {
              const t = (localP - 0.90) / 0.10; // 0.0 -> 1.0
              opacity = 1.0 - t;
              translateY = -t * 30;
            }
          }
        } else if (i > 0 && clampedP >= stageStart - stageRange * 0.10 && clampedP < stageStart) {
          // Incoming transition during previous stage's final 10%
          const prevLocalP = (clampedP - (stageStart - stageRange)) / stageRange;
          const t = Math.max(0, (prevLocalP - 0.90) / 0.10); // 0.0 -> 1.0
          opacity = t;
          translateY = (1.0 - t) * 30;
        }

        const isVisible = opacity > 0.01;
        panel.style.opacity = Math.max(0, Math.min(1, opacity));
        panel.style.transform = `translateY(${translateY}px)`;
        panel.style.visibility = isVisible ? 'visible' : 'hidden';
        panel.style.pointerEvents = opacity > 0.4 ? 'auto' : 'none';
        panel.classList.toggle('active', isVisible);
      });

      // C. Synchronize Active Navigation Link
      navLinks.forEach((l) => l.classList.remove('active'));
      if (clampedP < 0.20) {
        navLinks[0]?.classList.add('active'); // Overview
      } else if (clampedP < 0.40) {
        navLinks[1]?.classList.add('active'); // Pharmaceuticals
      } else if (clampedP < 0.60) {
        navLinks[2]?.classList.add('active'); // Medical Devices
      } else if (clampedP < 0.80) {
        navLinks[3]?.classList.add('active'); // Diagnostics
      } else {
        navLinks[4]?.classList.add('active'); // Sourcing & Supply
      }
    };

    // 2. Direct Scrubbed Timeline with robust Pinning
    // Using GSAP pin on .showcase-viewport guarantees viewport stays fixed during scroll across all browsers
    const showcaseTrigger = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      pin: viewport || '.showcase-viewport',
      pinSpacing: false,
      anticipatePin: 1,
      scrub: prefersReducedMotion ? false : 0.12,
      onUpdate: (self) => updateProgressState(self.progress)
    });

    // Provide programmatic helper for smooth nav link scrolling
    window.scrollToProgress = (targetP) => {
      const start = showcaseTrigger.start;
      const end = showcaseTrigger.end;
      const targetY = start + (end - start) * targetP;
      window.scrollTo({
        top: targetY,
        behavior: 'smooth'
      });
    };

    // Check for URL query param ?progress=X for automated verification & testing
    const params = new URLSearchParams(window.location.search);
    const testP = params.get('progress');
    if (testP !== null) {
      const p = parseFloat(testP);
      updateProgressState(p);
    } else {
      // Synchronize immediately on mount to current scroll position
      updateProgressState(showcaseTrigger.progress);
    }

    // Refresh ScrollTrigger calculations after initial DOM paint
    ScrollTrigger.refresh();

    const handleResize = () => {
      ScrollTrigger.refresh();
      updateProgressState(showcaseTrigger.progress);
    };
    window.addEventListener('resize', handleResize);

    // 3. Enquiry & Quotation Stage Trigger (Normal scroll area)
    const enquiryEl = document.querySelector('#enquiry');
    let enquiryTrigger = null;
    if (enquiryEl) {
      enquiryTrigger = ScrollTrigger.create({
        trigger: enquiryEl,
        start: 'top 85%',
        end: 'bottom bottom',
        onUpdate: (self) => {
          if (self.isActive && sceneManager && typeof sceneManager.setStageProgress === 'function') {
            sceneManager.setStageProgress(5, self.progress);
          }
        }
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      showcaseTrigger.kill();
      if (enquiryTrigger) enquiryTrigger.kill();
      delete window.scrollToProgress;
    };
  }, [sceneManager]);

  return null;
}
