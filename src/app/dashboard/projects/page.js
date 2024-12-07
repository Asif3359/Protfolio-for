'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [newProject, setNewProject] = useState({
        title: '',
        description: '',
        image: '',
        demoUrl: '',
        githubUrl: '',
        technologies: '',
        featured: false
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/user/current');
            const data = await response.json();
            if (data.user?.projects) {
                setProjects(data.user.projects);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
            alert('Failed to fetch projects. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewProject(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewProject(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newProject.title || !newProject.description) {
            alert('Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const updatedProjects = [...projects, newProject];
            const response = await fetch('/api/user/current', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects: updatedProjects }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add project');
            }

            setProjects(updatedProjects);
            setNewProject({
                title: '',
                description: '',
                image: '',
                demoUrl: '',
                githubUrl: '',
                technologies: '',
                featured: false
            });
            setImagePreview(null);
            alert('Project added successfully!');
        } catch (error) {
            console.error('Failed to add project:', error);
            alert(error.message || 'Failed to add project. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (index) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const updatedProjects = projects.filter((_, i) => i !== index);
            const response = await fetch('/api/user/current', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projects: updatedProjects }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete project');
            }

            setProjects(updatedProjects);
            alert('Project deleted successfully!');
        } catch (error) {
            console.error('Failed to delete project:', error);
            alert(error.message || 'Failed to delete project. Please try again.');
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
        <div className="max-w-4xl mx-auto p-4">
            {/* Add New Project Form */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title mb-4">Add New Project</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Project Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                            />
                        </div>

                        {/* Image Preview */}
                        {imagePreview && (
                            <div className="relative w-full h-48">
                                <Image
                                    src={imagePreview}
                                    alt="Project preview"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {/* Title */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={newProject.title}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={newProject.description}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered h-24"
                                required
                            />
                        </div>

                        {/* Technologies */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Technologies</span>
                            </label>
                            <input
                                type="text"
                                name="technologies"
                                value={newProject.technologies}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="e.g., React, Node.js, MongoDB"
                            />
                        </div>

                        {/* URLs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Demo URL</span>
                                </label>
                                <input
                                    type="url"
                                    name="demoUrl"
                                    value={newProject.demoUrl}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    placeholder="https://"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">GitHub URL</span>
                                </label>
                                <input
                                    type="url"
                                    name="githubUrl"
                                    value={newProject.githubUrl}
                                    onChange={handleInputChange}
                                    className="input input-bordered"
                                    placeholder="https://"
                                />
                            </div>
                        </div>

                        {/* Featured Checkbox */}
                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Featured Project</span>
                                <input
                                    type="checkbox"
                                    name="featured"
                                    checked={newProject.featured}
                                    onChange={handleInputChange}
                                    className="checkbox"
                                />
                            </label>
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Adding...' : 'Add Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div key={index} className="card bg-base-100 shadow-xl">
                        {project.image && (
                            <figure className="relative h-48">
                                <Image
                                    src={project.image}
                                    alt={`${project.title} project screenshot`}
                                    fill
                                    className="object-cover"
                                />
                            </figure>
                        )}
                        <div className="card-body">
                            <h3 className="card-title">
                                {project.title}
                                {project.featured && (
                                    <div className="badge badge-secondary">Featured</div>
                                )}
                            </h3>
                            <p className="text-sm opacity-70">
                                {project.description ? 
                                    (project.description.length > 200 ? 
                                        project.description.slice(0, 200) + '...' 
                                        : project.description
                                    ) 
                                    : 'No description available'
                                }
                            </p>
                            {project.technologies && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.technologies.split(',').map((tech, i) => (
                                        <div key={i} className="badge badge-outline">
                                            {tech.trim()}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="card-actions justify-between items-center mt-4">
                                <div className="space-x-2">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline"
                                        >
                                            Demo
                                        </a>
                                    )}
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleDelete(index)}
                                    className="btn btn-sm btn-error btn-outline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 