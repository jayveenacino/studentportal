import axios from 'axios';

export const logAction = async (action, type, details = "", portal = "") => {
    const user = JSON.parse(sessionStorage.getItem("Admin")) ||
        JSON.parse(sessionStorage.getItem("User")) ||
        { username: "Unknown", email: "Unknown" };

    try {
        await axios.post(import.meta.env.VITE_API_URL + "/api/logs", {
            user: user.username || user.email || "Unknown",
            userId: user._id || user.id,
            action: action,
            type: type,
            details: details,
            portal: portal
        });
    } catch (err) {
        console.error("Failed to log action:", err);
    }
};