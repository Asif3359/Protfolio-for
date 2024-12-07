'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const sidebarItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Personal Info', path: '/dashboard/personal' },
    { name: 'Skills', path: '/dashboard/skills' },
    { name: 'Experience', path: '/dashboard/experience' },
    { name: 'Education', path: '/dashboard/education' },
    { name: 'Certifications', path: '/dashboard/certifications' },
    { name: 'Social Links', path: '/dashboard/social' },
    { name: 'Projects', path: '/dashboard/projects' },
    { name: 'Blog Posts', path: '/dashboard/blog' },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                if (data.user) {
                    setUserData(data.user);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }
        fetchUserData();
    }, []);

    // Close drawer on route change in mobile
    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await signOut(auth);
            
            // Clear the session cookie
            await fetch('/api/auth/logout', {
                method: 'POST',
            });

            router.push('/auth/login');
        } catch (error) {
            console.error('Error logging out:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input 
                    id="dashboard-drawer" 
                    type="checkbox" 
                    className="drawer-toggle" 
                    checked={isDrawerOpen}
                    onChange={(e) => setIsDrawerOpen(e.target.checked)}
                />

                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="sticky top-0 z-20 navbar bg-base-100 lg:hidden shadow-md">
                        <div className="flex-none">
                            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost drawer-button">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1 px-4">
                            <h1 className="text-lg font-semibold">
                                {sidebarItems.find(item => item.path === pathname)?.name || 'Dashboard'}
                            </h1>
                        </div>
                        <div className="flex-none lg:hidden">
                            <div className="avatar placeholder">
                                <div className="w-8 h-8 rounded-full bg-neutral text-neutral-content">
                                    <span className="text-sm">{userData?.name?.charAt(0) || '?'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-4 md:p-6 overflow-x-hidden">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="drawer-side z-30">
                    <label 
                        htmlFor="dashboard-drawer" 
                        className="drawer-overlay"
                        onClick={() => setIsDrawerOpen(false)}
                    ></label>
                    <div className="menu p-4 w-[280px] sm:w-80 min-h-full bg-base-100 text-base-content flex flex-col">
                        {/* Profile Section */}
                        <div className="mb-8">
                            <div className="px-2 py-4 space-y-4">
                                <Link 
                                    href="/" 
                                    className="flex items-center gap-4 p-2 rounded-lg hover:bg-base-200 transition-colors"
                                >
                                    {userData?.image ? (
                                        <div className="avatar">
                                            <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                                <Image
                                                    src={userData.image}
                                                    alt={userData.name || 'Profile'}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full object-cover"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-12 sm:w-16 h-12 sm:h-16">
                                                <span className="text-xl sm:text-2xl">{userData?.name?.charAt(0) || '?'}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h2 className="text-lg sm:text-xl font-bold truncate">{userData?.name || 'Your Name'}</h2>
                                        <p className="text-sm sm:text-base text-base-content/60 truncate">{userData?.jobTitle || 'Your Role'}</p>
                                    </div>
                                </Link>
                                <div className="divider my-2"></div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <ul className="space-y-1.5 flex-1">
                            {sidebarItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`flex items-center p-2 rounded-lg transition-colors hover:bg-base-200 active:bg-base-300 ${
                                            pathname === item.path 
                                                ? 'bg-primary text-primary-content hover:bg-primary/90' 
                                                : ''
                                        }`}
                                        onClick={() => setIsDrawerOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Logout Button */}
                        <div className="mt-auto pt-4 border-t border-base-300">
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className={`btn btn-outline btn-error w-full ${isLoggingOut ? 'loading' : ''}`}
                            >
                                {isLoggingOut ? 'Logging out...' : 'Log Out'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 