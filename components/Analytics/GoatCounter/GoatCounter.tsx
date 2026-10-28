"use client";

import Script from "next/script";
import { flushAnalyticsQueue, GOATCOUNTER_ENDPOINT, GOATCOUNTER_SCRIPT } from "@/lib/analytics";
import { useGoatCounterPageviews } from "./useGoatCounterPageviews";

// Tương đương <script data-goatcounter="https://amb-storage.goatcounter.com/count" async src="//gc.zgo.at/count.js">
export default function GoatCounter() {
    useGoatCounterPageviews();
    return (
        <Script
            id="goatcounter"
            src={GOATCOUNTER_SCRIPT}
            data-goatcounter={GOATCOUNTER_ENDPOINT}
            strategy="afterInteractive"
            onLoad={flushAnalyticsQueue}
        />
    );
}
