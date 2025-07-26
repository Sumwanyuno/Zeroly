
// client/src/components/ScrollToTop.jsx

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    console.log("ScrollToTop: useEffect triggered.");
    console.log("ScrollToTop: Current pathname:", pathname);
    console.log("ScrollToTop: Current hash:", hash);

    // If there's no hash in the URL, scroll to the very top
    if (!hash) {
      console.log("ScrollToTop: No hash detected, scrolling to (0,0).");
      window.scrollTo(0, 0);
    } else {
      console.log("ScrollToTop: Hash detected, not forcing scroll to (0,0). HomePage useEffect should handle it.");
    }

  }, [pathname, hash]); // Re-run when pathname or hash changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;