'use client';

import { useState, useEffect } from 'react';

export default function SocialLinksPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        github: '',
        linkedin: '',
        facebook: '',
        website: ''
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();
            if (data.user?.socialLinks) {
                setFormData({
                    github: data.user.socialLinks.github?.replace('https://github.com/', '') || '',
                    linkedin: data.user.socialLinks.linkedin?.replace('https://linkedin.com/in/', '') || '',
                    facebook: data.user.socialLinks.facebook?.replace('https://facebook.com/', '') || '',
                    website: data.user.socialLinks.website || ''
                });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let finalValue = value;

        // Remove base URLs and clean up the input
        if (name === 'github') {
            finalValue = value
                .replace(/https?:\/\/(www\.)?github\.com\//g, '')
                .replace(/^@/, '');
        } else if (name === 'linkedin') {
            finalValue = value
                .replace(/https?:\/\/(www\.)?linkedin\.com\/in\//g, '')
                .replace(/^@/, '');
        } else if (name === 'facebook') {
            finalValue = value
                .replace(/https?:\/\/(www\.)?facebook\.com\//g, '')
                .replace(/^@/, '');
        }

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Prepare the data with properly formatted URLs
            const socialLinksData = {
                github: formData.github ? `https://github.com/${formData.github.trim()}` : '',
                linkedin: formData.linkedin ? `https://linkedin.com/in/${formData.linkedin.trim()}` : '',
                facebook: formData.facebook ? `https://facebook.com/${formData.facebook.trim()}` : '',
                website: formData.website?.trim() || ''
            };

            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    update: {
                        socialLinks: socialLinksData
                    }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update social links');
            }

            alert('Social links updated successfully!');
        } catch (error) {
            console.error('Error updating social links:', error);
            alert(error.message || 'Failed to update social links. Please try again.');
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
        <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title mb-4">Manage Your Social Links</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">GitHub Profile</span>
                            </label>
                            <div className="input-group">
                                <span className="bg-base-300 px-4 py-2">github.com/</span>
                                <input
                                    type="text"
                                    name="github"
                                    value={formData.github}
                                    onChange={handleInputChange}
                                    className="input input-bordered flex-1"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">LinkedIn Profile</span>
                            </label>
                            <div className="input-group">
                                <span className="bg-base-300 px-4 py-2">linkedin.com/in/</span>
                                <input
                                    type="text"
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleInputChange}
                                    className="input input-bordered flex-1"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Facebook Profile</span>
                            </label>
                            <div className="input-group">
                                <span className="bg-base-300 px-4 py-2">facebook.com/</span>
                                <input
                                    type="text"
                                    name="facebook"
                                    value={formData.facebook}
                                    onChange={handleInputChange}
                                    className="input input-bordered flex-1"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Personal Website</span>
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={formData.website}
                                onChange={handleInputChange}
                                className="input input-bordered"
                                placeholder="https://your-website.com"
                            />
                        </div>

                        <div className="card-actions justify-end mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary ${saving ? 'loading' : ''}`}
                                disabled={saving}
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>

                    {/* Preview */}
                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                        <div className="flex flex-wrap gap-4">
                            {formData.github && (
                                <a
                                    href={`https://github.com/${formData.github}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                    GitHub
                                </a>
                            )}
                            {formData.linkedin && (
                                <a
                                    href={`https://linkedin.com/in/${formData.linkedin}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                    LinkedIn
                                </a>
                            )}
                            {formData.facebook && (
                                <a
                                    href={`https://facebook.com/${formData.facebook}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                    Facebook
                                </a>
                            )}
                            {formData.website && (
                                <a
                                    href={formData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline btn-sm gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="2" y1="12" x2="22" y2="12"></line>
                                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                                    </svg>
                                    Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}