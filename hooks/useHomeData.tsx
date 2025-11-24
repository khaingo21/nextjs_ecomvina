"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchHomePage, HomePageResponse } from "@/lib/api";

interface HomeDataContextType {
    data: HomePageResponse | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

const HomeDataContext = createContext<HomeDataContextType | undefined>(undefined);

export function HomeDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<HomePageResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            // Lấy dữ liệu mặc định từ API server (không dùng per_page)
            const result = await fetchHomePage();
            console.log('🏠 HomeDataProvider - Raw API result:', result);
            console.log('🏠 HomeDataProvider - result.data:', result.data);
            console.log('🏠 HomeDataProvider - hot_sales:', result.data?.hot_sales?.length, 'items');
            console.log('🏠 HomeDataProvider - new_launch:', result.data?.new_launch?.length, 'items');
            console.log('🏠 HomeDataProvider - most_watched:', result.data?.most_watched?.length, 'items');
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch home data"));
            console.error("Home data fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch once on mount
        fetchData();
    }, []);

    return (
        <HomeDataContext.Provider value={{ data, loading, error, refetch: fetchData }}>
            {children}
        </HomeDataContext.Provider>
    );
}

export function useHomeData() {
    const context = useContext(HomeDataContext);
    if (context === undefined) {
        throw new Error("useHomeData must be used within a HomeDataProvider");
    }
    return context;
}
