'use client'; // ① client component

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Route protection wrapper component
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if the current route is dashboard or starts with dashboard/
  const isDashboardRoute = pathname === '/dashBoard' || pathname.startsWith('/dashBoard/');

  // When auth state is loaded, redirect unauthenticated users away from dashboard
  React.useEffect(() => {
    if (isLoaded && !isSignedIn && isDashboardRoute) {
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, isDashboardRoute, router]);

  // Show loading while authentication state is being determined
  if (!isLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Dashboard routes: show children only when signed in, otherwise redirect
  if (isDashboardRoute && !isSignedIn) {
    // We already triggered the redirect, show a loading state in the meantime
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>;
  }

  // For all other cases, show the children
  return <>{children}</>;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNav = ['/sign-in', '/sign-up', '/sign-in/factor-one'].includes(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          {/* only render when NOT on sign-in or sign-up */}
          {!hideNav && (
            <div className="border-b-2 ">
              <header className="section-width mx-auto flex items-center justify-between p-4 h-20 ">
                {/* Logo */}
                <Link href="/">
                  <Image
                    src="/images/home/logo.svg"
                    width={100}
                    height={100}
                    alt="logo"
                  />
                </Link>
                
                {/* Hamburger (mobile) */}
                <button
                  aria-label="Toggle menu"
                  className="md:hidden p-2 focus:outline-none"
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {/* simple hamburger icon */}
                  <div className="space-y-1">
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                    <span className="block w-6 h-0.5 bg-gray-800"></span>
                  </div>
                </button>

                {/* Navigation links */}
                <nav
                  className={`
                    absolute top-20 left-0 w-full bg-white px-4 py-4 md:static md:flex md:w-auto md:py-0 md:px-0
                    ${menuOpen ? 'flex flex-col gap-4' : 'hidden'}
                    md:flex md:flex-row md:items-center md:gap-5
                  `}
                >
                  {/* Dashboard button - only visible when signed in */}
                  <SignedIn>
                    <Link
                      href="/dashBoard"
                      className="block px-4 py-2 text-gray-800 font-medium hover:text-[#4D2E82]"
                    >
                      Dashboard
                    </Link>
                  </SignedIn>

                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="block px-4 py-2 bg-[#4D2E82] text-white font-medium rounded-lg text-center shadow-inner shadow-[#2a1d5c] hover:bg-[#5f3791]"
                    >
                      Login
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block p-2 bg-white border border-gray-300 font-medium text-black rounded-lg text-center shadow-inner shadow-[#d1d5db] hover:bg-[#f0f0f0]"
                    >
                      Book a free session
                    </Link>
                  </SignedOut>

                  <SignedIn>
                    <div className="flex justify-center md:block">
                      <UserButton />
                    </div>
                  </SignedIn>
                </nav>
              </header>
            </div>
          )}

          <AuthWrapper>{children}</AuthWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}