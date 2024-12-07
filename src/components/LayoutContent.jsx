'use client';

import Navigation from "@/components/Navigation";
import { usePathname } from 'next/navigation';

export default function LayoutContent({ children }) {
    const pathname = usePathname();
    const isDashboard = pathname?.startsWith('/dashboard');

    return (
        <>
            {!isDashboard && <Navigation />}
            {children}
        </>
    );
} 