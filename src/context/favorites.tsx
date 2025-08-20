"use client";
import { API } from "@/lib/api";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { toast } from "sonner";

interface FavoritesContextType {
    favoriteIds: Set<number>;
    toggleFavorite: (tourId: number) => Promise<void>;
    isFavorite: (tourId: number) => boolean;
    loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
    const [tourIdToFavoriteId, setTourIdToFavoriteId] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);

    // Load favorites khi user đăng nhập
    useEffect(() => {
        if (user) {
            loadFavorites();
        } else {
            setFavoriteIds(new Set());
            setTourIdToFavoriteId({});
        }
    }, [user]);

    const loadFavorites = async () => {
        try {
            const response = await API.get("/favorites/my-favorites");
            const list = response?.data?.data?.data || response?.data?.data || [];
            const ids = new Set<number>();
            const map: Record<number, number> = {};
            for (const item of list) {
                const tourId = item?.tour?.tour_id ?? item?.tour_id;
                const favoriteId = item?.favorite_id ?? item?.id ?? item?.favorite?.favorite_id;
                if (tourId) {
                    ids.add(Number(tourId));
                    if (favoriteId) {
                        map[Number(tourId)] = Number(favoriteId);
                    }
                }
            }
            setFavoriteIds(ids);
            setTourIdToFavoriteId(map);
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    };

    const toggleFavorite = async (tourId: number) => {
        if (!user) {
            toast.error("Vui lòng đăng nhập để thêm yêu thích");
            return;
        }

        setLoading(true);
        try {
            if (favoriteIds.has(tourId)) {
                const favoriteId = tourIdToFavoriteId[tourId];
                if (!favoriteId) {
                    // fallback: reload list to get id
                    await loadFavorites();
                }
                const idToDelete = favoriteId || tourIdToFavoriteId[tourId];
                if (idToDelete) {
                    await API.delete(`/favorites/${idToDelete}`);
                    setFavoriteIds(prev => {
                        const s = new Set(prev);
                        s.delete(tourId);
                        return s;
                    });
                    setTourIdToFavoriteId(prev => {
                        const n = { ...prev };
                        delete n[tourId];
                        return n;
                    });
                    toast.success("Đã xóa khỏi yêu thích");
                }
            } else {
                const res = await API.post("/favorites", { tour_id: tourId });
                const favorite = res?.data?.data;
                const favoriteId = favorite?.favorite_id;
                setFavoriteIds(prev => new Set(prev).add(tourId));
                if (favoriteId) {
                    setTourIdToFavoriteId(prev => ({ ...prev, [tourId]: Number(favoriteId) }));
                }
                toast.success("Đã thêm vào yêu thích");
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    const isFavorite = (tourId: number) => favoriteIds.has(tourId);

    return (
        <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, loading }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error("useFavorites must be used within FavoritesProvider");
    }
    return context;
};