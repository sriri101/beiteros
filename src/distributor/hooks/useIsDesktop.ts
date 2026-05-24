import { useState, useEffect } from 'react';

export function useIsDesktop(breakpoint = 1024) {
  const [v, setV] = useState(
    () => typeof window !== 'undefined' && window.innerWidth >= breakpoint,
  );
  useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    const h = (e: MediaQueryListEvent) => setV(e.matches);
    mql.addEventListener('change', h);
    setV(mql.matches);
    return () => mql.removeEventListener('change', h);
  }, [breakpoint]);
  return v;
}
