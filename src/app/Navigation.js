'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navigation({ userData }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState(null);
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: 'Blog', path: '/blog' },
        { name: 'Certifications', path: '/certifications' },
        { name: 'About', path: '/about' },
    ];

    // Add dashboard conditionally
    if (user) {
        navItems.push({ name: 'Dashboard', path: '/dashboard' });
    }

    const handleDashboardClick = (e) => {
        if (!user) {
            e.preventDefault();
            window.location.href = '/auth/login';
        }
    };

    return (
        <div className="navbar bg-base-100/80 backdrop-blur-sm fixed top-0 z-50 border-b border-base-300">
            <div className="max-w-6xl mx-auto px-8 w-full">
                <div className="flex justify-between w-full">
                    <div className="flex items-center">
                        <div className="dropdown">
                            <label tabIndex={0} className="btn btn-ghost lg:hidden">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                {navItems.map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            href={item.path}
                                            className={pathname === item.path ? 'active' : ''}
                                            onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link href="/" className="btn btn-ghost normal-case text-xl">{userData?.name || 'Your Name'}</Link>
                    </div>
                    <div className="hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link 
                                        href={item.path} 
                                        className={`btn btn-ghost ${pathname === item.path ? 'btn-active' : ''}`}
                                        onClick={item.name === 'Dashboard' ? handleDashboardClick : undefined}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            {!user && (
                                <li>
                                    <Link 
                                        href="/auth/login"
                                        className="btn btn-primary"
                                    >
                                        Login
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 