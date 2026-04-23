// app/page.tsx
"use client";

import React from "react";
import dynamic from 'next/dynamic';

const Experience = dynamic(() => import('../src/components/Experience'), { 
  ssr: false 
});

export default function Page() {
  return <Experience />;
}