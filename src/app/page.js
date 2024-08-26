"use client";
import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    console.log('Redirecting to /login');
    router.push('/login');
  }, [router]);


}