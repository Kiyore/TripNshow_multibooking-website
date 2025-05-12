// frontend/js/auth.js
export function requireAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        return false; // Return false if no token, no redirect here
    }

    try {
        // Split token and validate JWT structure
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
            throw new Error('Invalid token format');
        }

        // Decode and parse payload
        const decodedPayload = JSON.parse(atob(payload));
        if (!decodedPayload || !decodedPayload.userId) {
            throw new Error('Invalid token payload');
        }

        // Check token expiry if included in payload
        if (decodedPayload.exp && Date.now() >= decodedPayload.exp * 1000) {
            throw new Error('Token expired');
        }

        return true; // Return true if token is valid
    } catch (error) {
        console.error('Authentication error:', error.message);
        alert('Session expired or invalid. Please log in again.');
        localStorage.removeItem('token');
        return false;
    }
}

export function saveToken(token) {
    localStorage.setItem('token', token);
}

export function logout() {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    window.location.href = '/login.html';
}