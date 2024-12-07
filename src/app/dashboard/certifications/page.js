'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function CertificationsManagementPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [certifications, setCertifications] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        image: '',
        link: ''
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetchCertifications();
    }, []);

    // Clear file preview when editing changes
    useEffect(() => {
        if (!editingId) {
            setSelectedFile(null);
            setPreviewUrl('');
        }
    }, [editingId]);

    const fetchCertifications = async () => {
        try {
            setError(null);
            const response = await fetch('/api/certifications');
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch certifications');
            }
            
            setCertifications(data.certifications || []);
        } catch (error) {
            console.error('Error fetching certifications:', error);
            setError('Failed to load certifications. Please try refreshing the page.');
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
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleEdit = (cert) => {
        setEditingId(cert._id);
        setFormData({
            title: cert.title || '',
            issuer: cert.issuer || '',
            date: cert.date || '',
            image: cert.image || '',
            link: cert.link || ''
        });
        setPreviewUrl(cert.image || '');
    };

    const resetForm = () => {
        setEditingId(null);
        setFormData({
            title: '',
            issuer: '',
            date: '',
            image: '',
            link: ''
        });
        setSelectedFile(null);
        setPreviewUrl('');
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDelete = async (certId) => {
        if (!confirm('Are you sure you want to delete this certification?')) return;

        try {
            setError(null);
            const response = await fetch(`/api/certifications?id=${certId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete certification');
            }

            setCertifications(certifications.filter(c => c._id !== certId));
            alert('Certification deleted successfully!');
        } catch (error) {
            console.error('Error deleting certification:', error);
            setError('Failed to delete certification. Please try again.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('issuer', formData.issuer);
            formDataToSend.append('date', formData.date);
            formDataToSend.append('link', formData.link);

            if (selectedFile) {
                formDataToSend.append('image', selectedFile);
            } else if (formData.image) {
                formDataToSend.append('imageUrl', formData.image);
            }

            if (editingId) {
                formDataToSend.append('certificationId', editingId);
            }

            const url = '/api/certifications';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to save certification');
            }

            await fetchCertifications();
            resetForm();
            alert(editingId ? 'Certification updated successfully!' : 'Certification added successfully!');
        } catch (error) {
            console.error('Error saving certification:', error);
            setError(error.message || 'Failed to save certification. Please try again.');
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
        <div className="container mx-auto p-4 max-w-7xl">
            {error && (
                <div className="alert alert-error mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            {/* Certification Form */}
            <div className="card bg-base-100 shadow-xl mb-8">
                <div className="card-body p-4 sm:p-6">
                    <h2 className="card-title mb-4 text-xl sm:text-2xl">
                        {editingId ? 'Edit Certification' : 'Add New Certification'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Title</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Issuer</span>
                                </label>
                                <input
                                    type="text"
                                    name="issuer"
                                    value={formData.issuer}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Date</span>
                                </label>
                                <input
                                    type="text"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="e.g., 2023"
                                    required
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Certificate Link</span>
                                </label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="https://example.com/certificate"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Image</span>
                            </label>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full"
                                />
                                <div className="text-sm text-foreground/60">
                                    Or provide an image URL:
                                </div>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full"
                                    placeholder="https://example.com/image.png"
                                />
                                {previewUrl && (
                                    <div className="relative w-full max-w-xs mx-auto">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="object-contain w-full h-48 rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-4">
                            <button 
                                type="submit" 
                                className={`btn btn-primary flex-1 sm:flex-none ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : (editingId ? 'Update Certification' : 'Add Certification')}
                            </button>
                            {editingId && (
                                <button 
                                    type="button" 
                                    onClick={resetForm} 
                                    className="btn btn-ghost flex-1 sm:flex-none"
                                    disabled={saving}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Certifications List */}
            <div className="space-y-6">
                {certifications.length === 0 ? (
                    <div className="text-center py-10">
                        <h3 className="text-lg font-semibold mb-2">No Certifications Yet</h3>
                        <p className="text-gray-600">Add your first certification using the form above.</p>
                    </div>
                ) : (
                    certifications.map((cert) => (
                        <div key={cert._id} className="card bg-base-100 shadow-xl">
                            <div className="card-body p-4 sm:p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        {cert.image && (
                                            <div className="w-full sm:w-[200px] lg:w-[300px] h-[200px] flex-shrink-0">
                                                <img 
                                                    src={cert.image} 
                                                    alt={cert.title}
                                                    className="w-full h-full object-contain rounded-lg border"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-grow">
                                            <h3 className="card-title text-lg sm:text-xl mb-2">{cert.title}</h3>
                                            <p className="text-sm opacity-70 mb-1">{cert.issuer}</p>
                                            <p className="text-sm opacity-70 mb-2">{cert.date}</p>
                                            {cert.link && (
                                                <a 
                                                    href={cert.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline inline-block"
                                                >
                                                    View Certificate
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={() => handleEdit(cert)}
                                            className="btn btn-primary flex-1 sm:flex-none"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(cert._id)}
                                            className="btn btn-error flex-1 sm:flex-none"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 