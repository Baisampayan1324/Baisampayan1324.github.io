'use client';

import { useEffect, useState } from 'react';
import LoaderScreen from './loader-screen';

/**
 * Mounts the intro LoaderScreen over the whole site on first load of a browser
 * session. ENTER opens the window, fires `intro-entered` (so the hero video can
 * unmute inside the user gesture), then unmounts to reveal the live portfolio.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Per tab session — new tab shows the full loader; any refresh (F5/Ctrl+R)
    // keeps the flag and skips straight to the site (Next.js loading fallback).
    if (sessionStorage.getItem('introSeen')) return;
    setShow(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!show) return null;

  return (
    <LoaderScreen
      onEnter={() => {
        // Valid user gesture → let the hero unmute with sound. Remember it so
        // audio stays available across refreshes for the rest of this tab.
        sessionStorage.setItem('audioOn', '1');
        window.dispatchEvent(new Event('intro-entered'));
      }}
      onDone={() => {
        sessionStorage.setItem('introSeen', '1');
        document.body.style.overflow = '';
        setShow(false);
      }}
    />
  );
}
