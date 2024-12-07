'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProjectsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [projects, setProjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        demoUrl: '',
        githubUrl: '',
        image: ''
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('/api/projects');
            const data = await response.json();
            if (data.projects) {
                setProjects(data.projects);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setFormData({
            title: project.title,
            description: project.description,
            technologies: project.technologies,
            demoUrl: project.demoUrl || '',
            githubUrl: project.githubUrl || '',
            image: project.image
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setSelectedImage(null);
        setFormData({
            title: '',
            description: '',
            technologies: '',
            demoUrl: '',
            githubUrl: '',
            image: ''
        });
    };

    const handleDelete = async (projectId) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const response = await fetch(`/api/projects?id=${projectId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setProjects(projects.filter(p => p._id !== projectId));
            } else {
                throw new Error('Failed to delete project');
            }
        } catch (error) {
            console.error('Error deleting project:', error);
            alert('Failed to delete project. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = formData.image;

            if (selectedImage) {
                const imageFormData = new FormData();
                imageFormData.append('file', selectedImage);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });

                if (!uploadResponse.ok) {
                    throw new Error('Failed to upload image');
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.url;
            }

            const projectData = {
                ...formData,
                image: imageUrl
            };

            const url = editingId ? '/api/projects' : '/api/projects';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId 
                ? JSON.stringify({ projectId: editingId, ...projectData })
                : JSON.stringify(projectData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            });

            if (!response.ok) {
                throw new Error('Failed to save project');
            }

            await fetchProjects();
            resetForm();
            alert(editingId ? 'Project updated successfully!' : 'Project added successfully!');
        } catch (error) {
            console.error('Error saving project:', error);
            alert(error.message || 'Failed to save project. Please try again.');
        } finally {
            setSaving(false);
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
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Project Form */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title mb-4">{editingId ? 'Edit Project' : 'Add New Project'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Title</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Description</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Technologies</span>
                            </label>
                            <input
                                type="text"
                                name="technologies"
                                value={formData.technologies}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                                placeholder="e.g., React, Node.js, MongoDB"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Project Image</span>
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="file-input file-input-bordered w-full"
                                accept="image/*"
                                required={!editingId}
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Demo URL</span>
                            </label>
                            <input
                                type="url"
                                name="demoUrl"
                                value={formData.demoUrl}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GitHub URL</span>
                            </label>
                            <input
                                type="url"
                                name="githubUrl"
                                value={formData.githubUrl}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="https://github.com/..."
                            />
                        </div>

                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Add Project')}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="btn btn-ghost"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                    <div key={project._id} className="card bg-base-100 shadow-xl">
                        <figure className="aspect-video relative">
                            <Image
                                src={project.image || '/placeholder-project.jpg'}
                                alt={project.title}
                                fill
                                className="object-cover"
                            />
                        </figure>
                        <div className="card-body">
                            <h3 className="card-title">{project.title}</h3>
                            <p className="text-sm opacity-70">{project.description.slice(0, 200) + '...'}</p>
                            {project.technologies && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {project.technologies.split(',').map((tech, index) => (
                                        <span key={index} className="badge badge-sm">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="card-actions justify-end mt-4">
                                <button
                                    onClick={() => handleEdit(project)}
                                    className="btn btn-sm btn-primary"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project._id)}
                                    className="btn btn-sm btn-error"
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