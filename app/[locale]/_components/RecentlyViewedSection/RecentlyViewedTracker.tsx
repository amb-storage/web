"use client";

import { useEffect } from "react";

export const RECENTLY_VIEWED_STORAGE_KEY = "amb-storage-recently-viewed";
export const RECENTLY_VIEWED_EVENT = "amb-storage:recently-viewed";

export function readRecentlyViewedIds() {
    try {
        const value = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
        const ids = value ? JSON.parse(value) : [];
        return Array.isArray(ids)
            ? ids.filter((id): id is string => typeof id === "string")
            : [];
    } catch {
        return [];
    }
}

export function RecentlyViewedTracker({ productId }: { productId: string }) {
    useEffect(() => {
        const ids = readRecentlyViewedIds().filter((id) => id !== productId);
        window.localStorage.setItem(
            RECENTLY_VIEWED_STORAGE_KEY,
            JSON.stringify([productId, ...ids].slice(0, 12)),
        );
        window.dispatchEvent(new Event(RECENTLY_VIEWED_EVENT));
    }, [productId]);

    return null;
}
