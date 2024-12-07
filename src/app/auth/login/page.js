'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let userCredential;
            if (isLogin) {
                console.log('Attempting login with:', { email });
                userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log('Login successful');
            } else {
                console.log('Attempting signup with:', { email, name });
                // Create Firebase user
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                console.log('Firebase user created:', userCredential.user.uid);
                
                // Create user document in MongoDB
                console.log('Creating MongoDB user document...');
                const response = await fetch('/api/user/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        firebaseUid: userCredential.user.uid,
                    }),
                });

                const data = await response.json();
                console.log('MongoDB response:', data);

                if (!response.ok) {
                    console.error('Failed to create MongoDB user:', data);
                    // If user creation in MongoDB fails, delete the Firebase user
                    console.log('Deleting Firebase user due to MongoDB creation failure');
                    await userCredential.user.delete();
                    throw new Error(data.error || data.details || 'Failed to create user profile');
                }

                console.log('User created successfully:', data);
            }

            // Get the ID token
            console.log('Getting ID token...');
            const idToken = await userCredential.user.getIdToken();
            console.log('Got ID token, creating session...');

            // Create session cookie
            const sessionResponse = await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idToken }),
            });

            const sessionData = await sessionResponse.json();
            console.log('Session response:', sessionData);

            if (!sessionResponse.ok) {
                console.error('Session creation failed:', sessionData);
                throw new Error(sessionData.details || sessionData.error || 'Failed to create session');
            }

            console.log('Session created successfully, redirecting...');
            router.push(redirect);
        } catch (error) {
            console.error('Auth error:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            
            let errorMessage = error.message;

            // Format Firebase error messages to be more user-friendly
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'This email is already registered. Please try logging in instead.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please sign up.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password should be at least 6 characters long.';
            } else if (error.message.includes('Failed to create user profile')) {
                errorMessage = 'Failed to create user profile. Please try again.';
            } else if (error.message.includes('Failed to create session')) {
                errorMessage = 'Failed to create session. Please try logging in again.';
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
            <div className="max-w-md w-full">
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold mb-6">
                            {isLogin ? 'Login to Dashboard' : 'Create Account'}
                        </h2>

                        {error && (
                            <div className="alert alert-error mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Full Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="input input-bordered"
                                        required={!isLogin}
                                        minLength={2}
                                        placeholder="John Doe"
                                    />
                                </div>
                            )}

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input input-bordered"
                                    required
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input input-bordered"
                                    minLength={6}
                                    required
                                    placeholder="••••••"
                                />
                                <label className="label">
                                    <span className="label-text-alt">Password must be at least 6 characters</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                                disabled={loading || (!isLogin && !name)}
                            >
                                {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                            </button>
                        </form>

                        <div className="divider">OR</div>

                        <button
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError('');
                                setName('');
                                setEmail('');
                                setPassword('');
                            }}
                            className="btn btn-outline btn-sm"
                        >
                            {isLogin ? 'Create New Account' : 'Login with Existing Account'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 