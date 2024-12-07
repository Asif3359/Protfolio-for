'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function PersonalInfoPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        bio: '',
        aboutYourself: '',
        background: '',
        contact: {
            email: '',
            phone: '',
            location: ''
        }
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.user) {
                setFormData({
                    name: data.user.name || '',
                    role: data.user.role || '',
                    bio: data.user.bio || '',
                    aboutYourself: data.user.aboutYourself || '',
                    background: data.user.background || '',
                    contact: {
                        email: data.user.contact?.email || '',
                        phone: data.user.contact?.phone || '',
                        location: data.user.contact?.location || ''
                    }
                });
                if (data.user.image) {
                    setImagePreview(data.user.image);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('contact.')) {
            const contactField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                contact: {
                    ...prev.contact,
                    [contactField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            let imageUrl = imagePreview;

            if (selectedImage) {
                const imageFormData = new FormData();
                imageFormData.append('file', selectedImage);

                const uploadResponse = await fetch('/api/upload', {
                    method: 'POST',
                    body: imageFormData
                });

                if (!uploadResponse.ok) {
                    const errorData = await uploadResponse.json();
                    throw new Error(errorData.error || 'Failed to upload image');
                }

                const uploadData = await uploadResponse.json();
                imageUrl = uploadData.url;
            }

            const updateData = {
                ...formData,
                image: imageUrl
            };

            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    update: updateData
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update personal info');
            }

            alert('Personal information updated successfully!');
        } catch (error) {
            console.error('Error updating personal info:', error);
            alert(error.message || 'Failed to update personal information. Please try again.');
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
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Personal Information</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Profile Image Upload */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Profile Image</span>
                            </label>
                            <div className="flex flex-col items-center gap-4">
                                {imagePreview ? (
                                    <div className="avatar">
                                        <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <Image
                                                src={imagePreview}
                                                alt="Profile preview"
                                                width={96}
                                                height={96}
                                                className="rounded-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="avatar placeholder">
                                        <div className="bg-neutral text-neutral-content rounded-full w-24">
                                            <span className="text-3xl">{formData.name?.charAt(0) || '?'}</span>
                                        </div>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="file-input file-input-bordered w-full max-w-xs"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Role/Title</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                                placeholder="e.g., Full Stack Developer"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">About Yourself</span>
                                <span className="label-text-alt text-xs opacity-50">Brief introduction about yourself</span>
                            </label>
                            <textarea
                                name="aboutYourself"
                                value={formData.aboutYourself}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered h-24"
                                required
                                placeholder="A passionate developer dedicated to crafting exceptional digital experiences through clean code and innovative solutions."
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Background</span>
                                <span className="label-text-alt text-xs opacity-50">Your experience and journey</span>
                            </label>
                            <textarea
                                name="background"
                                value={formData.background}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered h-24"
                                required
                                placeholder="With over [X] years of experience in web development..."
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Short Bio</span>
                                <span className="label-text-alt text-xs opacity-50">Will be shown in hero section</span>
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="textarea textarea-bordered h-24"
                                required
                            />
                        </div>

                        <div className="divider">Contact Information</div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input
                                type="email"
                                name="contact.email"
                                value={formData.contact.email}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Phone</span>
                            </label>
                            <input
                                type="tel"
                                name="contact.phone"
                                value={formData.contact.phone}
                                onChange={handleInputChange}
                                className="input input-bordered"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input
                                type="text"
                                name="contact.location"
                                value={formData.contact.location}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="e.g., New York, USA"
                            />
                        </div>

                        <div className="card-actions justify-end">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 