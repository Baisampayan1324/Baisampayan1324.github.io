"use client";

import { useEffect, useState } from "react";
import {
  ref,
  push,
  set,
  remove,
  onValue,
  onDisconnect,
  serverTimestamp,
} from "firebase/database";
import { getDb, firebaseEnabled } from "@/lib/firebase";

/**
 * Live "people online now" badge (top-right). Uses Firebase Realtime Database
 * presence: each open tab writes a unique node under /presence and removes it
 * on disconnect (tab close, refresh, network drop) via onDisconnect. The count
 * is the number of live nodes.
 *
 * Renders nothing until Firebase is configured (see src/lib/firebase.ts) and a
 * count is known — so it never flashes a bogus "0" or breaks the build.
 */
export default function LiveCounter() {
  // Start optimistically at 1 (this visitor) so the badge paints instantly on
  // load instead of waiting for the Firebase round-trip — the real count snaps
  // in a moment later via onValue.
  const [count, setCount] = useState<number>(1);

  useEffect(() => {
    if (!firebaseEnabled) return;
    const db = getDb();
    if (!db) return;

    const presenceRef = ref(db, "presence");
    const myRef = push(presenceRef); // unique key for this tab

    set(myRef, { online: true, ts: serverTimestamp() });
    onDisconnect(myRef).remove();

    const unsub = onValue(presenceRef, (snap) => {
      // onValue fires before our set() completes → snap.size can be 0.
      // We know at least 1 visitor (us), so clamp to minimum 1.
      setCount(Math.max(snap.size ?? 0, 1));
    });

    const cleanup = () => remove(myRef);
    window.addEventListener("beforeunload", cleanup);

    return () => {
      remove(myRef);
      unsub();
      window.removeEventListener("beforeunload", cleanup);
    };
  }, []);

  if (!firebaseEnabled) return null;

  return (
    <div
      className="group fixed top-4 right-4 z-[200] flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-black/55 shadow-[0_8px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300 hover:border-white/30 hover:bg-black/70"
      aria-live="polite"
      title={`${count} ${count === 1 ? "person" : "people"} viewing this portfolio right now`}
    >
      {/* users (two-people) icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>

      {/* red count badge — top-right corner */}
      <span
        className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-background bg-red-500 px-1 text-[10px] font-bold leading-none text-white tabular-nums"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {count}
      </span>
    </div>
  );
}
