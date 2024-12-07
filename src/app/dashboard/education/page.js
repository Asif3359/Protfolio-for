'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EducationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [education, setEducation] = useState([]);
    const [newEducation, setNewEducation] = useState({
        school: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        description: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.user?.education) {
                setEducation(data.user.education);
            }
        } catch (error) {
            console.error('Failed to fetch education:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddEducation = async (e) => {
        e.preventDefault();
        if (!newEducation.school || !newEducation.degree) return;

        setSaving(true);
        try {
            const formattedEducation = {
                ...newEducation,
                startDate: new Date(newEducation.startDate),
                endDate: new Date(newEducation.endDate),
            };

            const updatedEducation = [...education, formattedEducation];
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ education: updatedEducation }),
            });

            if (response.ok) {
                setEducation(updatedEducation);
                setNewEducation({
                    school: '',
                    degree: '',
                    field: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                });
            }
        } catch (error) {
            console.error('Failed to add education:', error);
            alert('Failed to add education. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEducation = async (index) => {
        try {
            const updatedEducation = education.filter((_, i) => i !== index);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ education: updatedEducation }),
            });

            if (response.ok) {
                setEducation(updatedEducation);
            }
        } catch (error) {
            console.error('Failed to delete education:', error);
            alert('Failed to delete education. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Education Management</h1>
            </div>

            {/* Add New Education Form */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title mb-4">Add New Education</h2>
                    <form onSubmit={handleAddEducation} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">School/University</span>
                                </label>
                                <input
                                    type="text"
                                    value={newEducation.school}
                                    onChange={(e) => setNewEducation({ ...newEducation, school: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Degree</span>
                                </label>
                                <input
                                    type="text"
                                    value={newEducation.degree}
                                    onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Field of Study</span>
                                </label>
                                <input
                                    type="text"
                                    value={newEducation.field}
                                    onChange={(e) => setNewEducation({ ...newEducation, field: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Start Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={newEducation.startDate}
                                    onChange={(e) => setNewEducation({ ...newEducation, startDate: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">End Date</span>
                                </label>
                                <input
                                    type="date"
                                    value={newEducation.endDate}
                                    onChange={(e) => setNewEducation({ ...newEducation, endDate: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                value={newEducation.description}
                                onChange={(e) => setNewEducation({ ...newEducation, description: e.target.value })}
                                className="textarea textarea-bordered h-24"
                                placeholder="Notable achievements, activities, etc."
                            />
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                Add Education
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Education List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Education</h2>
                    <div className="space-y-6">
                        {education.map((edu, index) => (
                            <div key={index} className="border-b pb-6 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{edu.degree} in {edu.field}</h3>
                                        <p className="text-base-content/60">{edu.school}</p>
                                        <p className="text-sm text-base-content/60">
                                            {new Date(edu.startDate).toLocaleDateString()} - 
                                            {new Date(edu.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEducation(index)}
                                        className="btn btn-ghost btn-sm text-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {edu.description && (
                                    <p className="mt-2 text-base-content/80">{edu.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 