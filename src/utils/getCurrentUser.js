import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        }, reject);
    });
};

export const getCurrentUserData = async () => {
    try {
        const user = await getCurrentUser();
        
        if (!user) {
            return null;
        }

        const response = await fetch('/api/user/current');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error getting current user data:', error);
        return null;
    }
}; 