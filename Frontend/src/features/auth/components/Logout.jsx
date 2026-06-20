import { useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Logout() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { logout } = useAuth();
    async function handleLogout() {
        try {
            setIsLoading(true);
            setError(null);
            logout();
            navigate('/login', { replace: true });
        } catch (err) {
            setError('Logout failed. Please try again.');
            console.error('Logout error:', err);
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <div className="logout-container">
            <Button 
                onClick={handleLogout} 
                disabled={isLoading}
                variant="secondary"
            >
                {isLoading ? 'Logging out...' : 'Logout'}
            </Button>
            {error && <p className="error-message">{error}</p>}
        </div>
    );
}
