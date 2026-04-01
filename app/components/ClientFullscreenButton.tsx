'use client';

import dynamic from 'next/dynamic';

const FullscreenButton = dynamic(() => import('./FullscreenButton'), {
  ssr: false,
});

export default function ClientFullscreenButton() {
  return <FullscreenButton />;
}
