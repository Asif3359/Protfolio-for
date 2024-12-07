'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserData();

        // Set up an interval to refresh data every 5 seconds
        const interval = setInterval(fetchUserData, 5000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user', {
                cache: 'no-store',
                next: { revalidate: 0 }
            });
            const data = await response.json();
            if (data.user) {
                setUserData(data.user);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Profile Status */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Profile Status</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span>Personal Info</span>
                                <span className={`badge ${userData?.name ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.name ? 'Complete' : 'Incomplete'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Skills</span>
                                <span className={`badge ${userData?.skills?.length ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.skills?.length ? `${userData.skills.length} Added` : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Experience</span>
                                <span className={`badge ${userData?.experience?.length ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.experience?.length ? `${userData.experience.length} Added` : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Projects</span>
                                <span className={`badge ${userData?.projects?.length ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.projects?.length ? `${userData.projects.length}/6` : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Education</span>
                                <span className={`badge ${userData?.education?.length ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.education?.length ? `${userData.education.length} Added` : 'None'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Social Links</span>
                                <span className={`badge ${userData?.socialLinks?.github || userData?.socialLinks?.linkedin ? 'badge-success' : 'badge-error'}`}>
                                    {userData?.socialLinks?.github || userData?.socialLinks?.linkedin ? 'Added' : 'None'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Quick Actions</h2>
                        <div className="space-y-2">
                            <Link href="/dashboard/personal" className="btn btn-outline btn-sm w-full">
                                Update Personal Info
                            </Link>
                            <Link href="/dashboard/skills" className="btn btn-outline btn-sm w-full">
                                Add New Skill
                            </Link>
                            <Link href="/dashboard/experience" className="btn btn-outline btn-sm w-full">
                                Add Experience
                            </Link>
                            <Link href="/dashboard/projects" className="btn btn-outline btn-sm w-full">
                                Manage Projects
                            </Link>
                            <Link href="/dashboard/education" className="btn btn-outline btn-sm w-full">
                                Add Education
                            </Link>
                            <Link href="/dashboard/social" className="btn btn-outline btn-sm w-full">
                                Update Social Links
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Portfolio Preview */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">Portfolio Preview</h2>
                        <div className="space-y-4">
                            <div className="text-center">
                                {userData?.image ? (
                                    <div className="avatar">
                                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image
                                                src={userData.image}
                                                alt={userData.name || 'Profile picture'}
                                                width={96}
                                                height={96}
                                                className="rounded-full"
                                                priority
                                                unoptimized
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-24">
                                            <span className="text-3xl">{userData?.name?.charAt(0) || '?'}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-bold">{userData?.name || 'Your Name'}</h3>
                                <p className="text-base-content/70">{userData?.jobTitle || 'Your Role'}</p>
                                <p className="text-sm text-base-content/60">{userData?.contact?.email || 'Your Email'}</p>
                            </div>
                            <div className="flex gap-2 justify-center">
                                {userData?.socialLinks?.github && (
                                    <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer" 
                                       className="btn btn-circle btn-sm btn-ghost">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                                        </svg>
                                    </a>
                                )}
                                {userData?.socialLinks?.linkedin && (
                                    <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                                       className="btn btn-circle btn-sm btn-ghost">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                        </svg>
                                    </a>
                                )}
                            </div>
                            <div className="card-actions justify-center pt-2">
                                <Link href="/" className="btn btn-primary btn-sm">
                                    View Portfolio
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card bg-base-100 shadow-xl md:col-span-3">
                    <div className="card-body">
                        <h2 className="card-title">Recent Activity</h2>
                        <div className="overflow-x-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Section</th>
                                        <th>Status</th>
                                        <th>Last Updated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Personal Info</td>
                                        <td>
                                            <span className={`badge ${userData?.name ? 'badge-success' : 'badge-error'}`}>
                                                {userData?.name ? 'Complete' : 'Incomplete'}
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Skills</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {userData?.skills?.length || 0} Skills
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Experience</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {userData?.experience?.length || 0} Entries
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Projects</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {userData?.projects?.length || 0}/6 Projects
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Education</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {userData?.education?.length || 0} Entries
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td>Social Links</td>
                                        <td>
                                            <span className={`badge ${userData?.socialLinks?.github || userData?.socialLinks?.linkedin ? 'badge-success' : 'badge-error'}`}>
                                                {userData?.socialLinks?.github || userData?.socialLinks?.linkedin ? 'Added' : 'None'}
                                            </span>
                                        </td>
                                        <td>{new Date(userData?.updatedAt).toLocaleDateString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}