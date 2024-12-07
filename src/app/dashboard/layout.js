'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sidebarItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Personal Info', path: '/dashboard/personal' },
    { name: 'Skills', path: '/dashboard/skills' },
    { name: 'Experience', path: '/dashboard/experience' },
    { name: 'Education', path: '/dashboard/education' },
    { name: 'Social Links', path: '/dashboard/social' },
    { name: 'Projects', path: '/dashboard/projects' },
    { name: 'Blog Posts', path: '/dashboard/blog' },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-base-200">
            <div className="drawer lg:drawer-open">
                <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
                
                <div className="drawer-content">
                    {/* Navbar */}
                    <div className="navbar bg-base-100 lg:hidden">
                        <div className="flex-none">
                            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">Dashboard</h1>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="p-6">
                        {children}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="drawer-side">
                    <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                    <div className="menu p-4 w-80 min-h-full bg-base-100">
                        <div className="mb-8">
                            <h2 className="text-xl font-bold px-4 py-4">Portfolio Dashboard</h2>
                        </div>
                        <ul className="space-y-2">
                            {sidebarItems.map((item) => (
                                <li key={item.path}>
                                    <Link
                                        href={item.path}
                                        className={`flex items-center p-2 rounded-lg hover:bg-base-200 ${
                                            pathname === item.path ? 'bg-primary text-primary-content' : ''
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
} 