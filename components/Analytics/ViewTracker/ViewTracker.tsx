"use client";

import { useViewTracker } from "./useViewTracker";

// Đếm lượt xem first-party (hiện ở Dashboard admin, không phụ thuộc GoatCounter)
export default function ViewTracker() {
    useViewTracker();
    return null;
}
