'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ExperiencePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [experiences, setExperiences] = useState([]);
    const [newExperience, setNewExperience] = useState({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
        current: false,
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.user?.experience) {
                setExperiences(data.user.experience);
            }
        } catch (error) {
            console.error('Failed to fetch experience:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddExperience = async (e) => {
        e.preventDefault();
        if (!newExperience.title || !newExperience.company) return;

        setSaving(true);
        try {
            const formattedExperience = {
                ...newExperience,
                startDate: new Date(newExperience.startDate),
                endDate: newExperience.current ? null : new Date(newExperience.endDate),
            };

            const updatedExperiences = [...experiences, formattedExperience];
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ experience: updatedExperiences }),
            });

            if (response.ok) {
                setExperiences(updatedExperiences);
                setNewExperience({
                    title: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                    current: false,
                });
            }
        } catch (error) {
            console.error('Failed to add experience:', error);
            alert('Failed to add experience. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteExperience = async (index) => {
        try {
            const updatedExperiences = experiences.filter((_, i) => i !== index);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ experience: updatedExperiences }),
            });

            if (response.ok) {
                setExperiences(updatedExperiences);
            }
        } catch (error) {
            console.error('Failed to delete experience:', error);
            alert('Failed to delete experience. Please try again.');
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
                <h1 className="text-2xl font-bold">Experience Management</h1>
            </div>

            {/* Add New Experience Form */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title mb-4">Add New Experience</h2>
                    <form onSubmit={handleAddExperience} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Job Title</span>
                                </label>
                                <input
                                    type="text"
                                    value={newExperience.title}
                                    onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Company</span>
                                </label>
                                <input
                                    type="text"
                                    value={newExperience.company}
                                    onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
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
                                    value={newExperience.startDate}
                                    onChange={(e) => setNewExperience({ ...newExperience, startDate: e.target.value })}
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
                                    value={newExperience.endDate}
                                    onChange={(e) => setNewExperience({ ...newExperience, endDate: e.target.value })}
                                    className="input input-bordered"
                                    disabled={newExperience.current}
                                    required={!newExperience.current}
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">I currently work here</span>
                                <input
                                    type="checkbox"
                                    checked={newExperience.current}
                                    onChange={(e) => setNewExperience({ ...newExperience, current: e.target.checked })}
                                    className="checkbox"
                                />
                            </label>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                value={newExperience.description}
                                onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                                className="textarea textarea-bordered h-24"
                                required
                            />
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                Add Experience
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Experience List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Experience</h2>
                    <div className="space-y-6">
                        {experiences.map((exp, index) => (
                            <div key={index} className="border-b pb-6 last:border-0">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold">{exp.title}</h3>
                                        <p className="text-base-content/60">{exp.company}</p>
                                        <p className="text-sm text-base-content/60">
                                            {new Date(exp.startDate).toLocaleDateString()} - 
                                            {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteExperience(index)}
                                        className="btn btn-ghost btn-sm text-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <p className="mt-2 text-base-content/80">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
} 