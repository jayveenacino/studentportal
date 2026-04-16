import useSWR from "swr";
import axios from "axios";

const fetcher = (url) => axios.get(url).then((res) => res.data);

export function useStudentData(identifier, type) {
    const url = identifier 
        ? `${import.meta.env.VITE_API_URL}/${type === 'email' ? 'student/by-domain' : 'student/by-number'}/${identifier}`
        : null;

    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        shouldRetryOnError: false,
    });

    return {
        studentData: data,
        isLoading,
        error: error?.message,
    };
}

export function useSettings() {
    const url = `${import.meta.env.VITE_API_URL}/settings/`;
    
    const { data, error, isLoading } = useSWR(url, fetcher, {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        dedupingInterval: 60000,
        shouldRetryOnError: false,
    });

    const settingsArray = Array.isArray(data) ? data : data ? [data] : [];

    return {
        settings: settingsArray,
        isLoading,
        error: error?.message,
    };
}