'use client';

import { useState, useEffect } from 'react';

export default function BlogManagementPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [posts, setPosts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        slug: '',
        tags: '',
        published: true
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/blog');
            const data = await response.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (post) => {
        setEditingId(post._id);
        setFormData({
            title: post.title,
            content: post.content,
            excerpt: post.excerpt,
            slug: post.slug,
            tags: post.tags?.join(', ') || '',
            published: post.published
        });
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            content: '',
            excerpt: '',
            slug: '',
            tags: '',
            published: true
        });
    };

    const handleDelete = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/blog?id=${postId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setPosts(posts.filter(p => p._id !== postId));
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const processedData = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
            };

            const url = '/api/blog';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId 
                ? JSON.stringify({ postId: editingId, ...processedData })
                : JSON.stringify(processedData);

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save post');
            }

            await fetchPosts();
            resetForm();
            alert(editingId ? 'Post updated successfully!' : 'Post added successfully!');
        } catch (error) {
            console.error('Error saving post:', error);
            alert(error.message || 'Failed to save post. Please try again.');
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
        <div className="container mx-auto p-4">
            {/* Blog Post Form */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body">
                    <h2 className="card-title mb-4">{editingId ? 'Edit Blog Post' : 'Add New Blog Post'}</h2>
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
                                <span className="label-text">Slug</span>
                            </label>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="leave-empty-to-generate-from-title"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Content</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered h-32"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Excerpt</span>
                            </label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Tags (comma-separated)</span>
                            </label>
                            <input
                                type="text"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="nextjs, react, web-development"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label cursor-pointer">
                                <span className="label-text">Published</span>
                                <input
                                    type="checkbox"
                                    name="published"
                                    checked={formData.published}
                                    onChange={handleInputChange}
                                    className="checkbox"
                                />
                            </label>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                type="submit" 
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : (editingId ? 'Update Post' : 'Add Post')}
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

            {/* Blog Posts List */}
            <div className="space-y-6">
                {posts.map((post) => (
                    <div key={post._id} className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="card-title">{post.title}</h3>
                                    <p className="text-sm opacity-70">
                                        {new Date(post.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="btn btn-sm btn-primary"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="btn btn-sm btn-error"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm opacity-70 mt-2">{post.excerpt}</p>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="badge badge-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className={`badge ${post.published ? 'badge-success' : 'badge-warning'}`}>
                                    {post.published ? 'Published' : 'Draft'}
                                </span>
                                <span className="text-sm opacity-70">
                                    Slug: {post.slug}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 