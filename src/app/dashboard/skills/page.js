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
        category: 'Frontend'
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
        if (!newSkill.name || !newSkill.category) return;

        setSaving(true);
        try {
            const updatedSkills = [...skills, newSkill];
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skills: updatedSkills }),
            });

            if (response.ok) {
                setSkills(updatedSkills);
                setNewSkill({
                    name: '',
                    proficiency: 0,
                    category: 'Frontend'
                });
            }
        } catch (error) {
            console.error('Failed to add skill:', error);
            alert('Failed to add skill. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteSkill = async (index) => {
        try {
            const updatedSkills = skills.filter((_, i) => i !== index);
            const response = await fetch('/api/user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ skills: updatedSkills }),
            });

            if (response.ok) {
                setSkills(updatedSkills);
            }
        } catch (error) {
            console.error('Failed to delete skill:', error);
            alert('Failed to delete skill. Please try again.');
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
                <h1 className="text-2xl font-bold">Skills Management</h1>
            </div>

            {/* Add New Skill Form */}
            <div className="card bg-base-100 shadow-xl mb-6">
                <div className="card-body">
                    <h2 className="card-title mb-4">Add New Skill</h2>
                    <form onSubmit={handleAddSkill} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Skill Name</span>
                                </label>
                                <input
                                    type="text"
                                    value={newSkill.name}
                                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Category</span>
                                </label>
                                <select
                                    value={newSkill.category}
                                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                                    className="select select-bordered"
                                    required
                                >
                                    <option value="Frontend">Frontend</option>
                                    <option value="Backend">Backend</option>
                                    <option value="Database">Database</option>
                                    <option value="DevOps">DevOps</option>
                                    <option value="Tools">Tools</option>
                                </select>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Proficiency (%)</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={newSkill.proficiency}
                                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: parseInt(e.target.value) })}
                                    className="input input-bordered"
                                    required
                                />
                            </div>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
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
                <div className="card-body">
                    <h2 className="card-title mb-4">Your Skills</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Skill</th>
                                    <th>Category</th>
                                    <th>Proficiency</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {skills.map((skill, index) => (
                                    <tr key={index}>
                                        <td>{skill.name}</td>
                                        <td>{skill.category}</td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <div className="w-full bg-base-300 rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm">{skill.proficiency}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDeleteSkill(index)}
                                                className="btn btn-ghost btn-sm text-error"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
} 