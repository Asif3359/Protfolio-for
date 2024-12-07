export async function getUserData() {
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        return data.user;
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
} 