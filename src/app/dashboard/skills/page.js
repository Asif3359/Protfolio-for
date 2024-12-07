'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SkillsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState({
        name: '',
        proficiency: 0,
        category: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    async function fetchUserData() {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.user?.skills) {
                setSkills(data.user.skills);
            }
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.name || !newSkill.category) {
            alert('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const updatedSkills = [...skills, {
                ...newSkill,
                proficiency: Number(newSkill.proficiency) || 0
            }];

            const response = await fetch('/api/user/current', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skills: updatedSkills }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add skill');
            }

            setSkills(updatedSkills);
            setNewSkill({
                name: '',
                proficiency: 0,
                category: ''
            });
            alert('Skill added successfully!');
        } catch (error) {
            console.error('Failed to add skill:', error);
            alert(error.message || 'Failed to add skill. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (index) => {
        try {
            const updatedSkills = skills.filter((_, i) => i !== index);
            const response = await fetch('/api/user/current', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skills: updatedSkills }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete skill');
            }

            setSkills(updatedSkills);
            alert('Skill deleted successfully!');
        } catch (error) {
            console.error('Failed to delete skill:', error);
            alert(error.message || 'Failed to delete skill. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Skills Management</h1>
                <p className="text-base-content/60">Add and manage your professional skills.</p>
            </div>

            {/* Add New Skill Form */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Add New Skill</h2>
                    <form onSubmit={handleAddSkill} className="space-y-4 sm:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Skill Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="input input-bordered input-sm sm:input-md"
                                    required
                                    placeholder="e.g., React.js"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Category</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSkill.category}
                                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                    className="input input-bordered input-sm sm:input-md"
                                    required
                                    placeholder="e.g., Frontend, Backend, Database"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-medium">Proficiency (%)</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newSkill.proficiency}
                                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                                    className="input input-bordered input-sm sm:input-md"
                                    required
                                />
                            </div>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary btn-sm sm:btn-md ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                Add Skill
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Skills List */}
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-bold mb-4">Your Skills</h2>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <table className="table table-sm sm:table-md">
                            <thead>
                                <tr>
                                    <th className="text-sm sm:text-base">Skill</th>
                                    <th className="text-sm sm:text-base">Category</th>
                                    <th className="text-sm sm:text-base">Proficiency</th>
                                    <th className="text-sm sm:text-base">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill, index) => (
                                    <tr key={index}>
                                        <td className="text-sm sm:text-base font-medium">{skill.name}</td>
                                        <td className="text-sm sm:text-base">{skill.category}</td>
                                        <td className="min-w-[150px] sm:min-w-[200px]">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-base-300 rounded-full h-1.5 sm:h-2">
                                                    <div
                                                        className="bg-primary h-1.5 sm:h-2 rounded-full"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs sm:text-sm whitespace-nowrap">{skill.proficiency}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteSkill(index)}
                                                className="btn btn-ghost btn-xs sm:btn-sm text-error"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {skills.length === 0 && (
                                    <tr>
                                        <td colSpan="4" className="text-center py-4 text-base-content/60">
                                            No skills added yet. Add your first skill above!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 