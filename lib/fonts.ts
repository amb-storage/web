import localFont from "next/font/local";

// Bộ font giống web gốc amb-storage.com: Poppins (body/label), League Spartan (title), Stencil Gothic (headline)
export const poppins = localFont({
    variable: "--font-poppins",
    display: "swap",
    src: [
        { path: "../assets/fonts/poppins/Poppins-Light.otf", weight: "300" },
        { path: "../assets/fonts/poppins/Poppins-Regular.otf", weight: "400" },
        { path: "../assets/fonts/poppins/Poppins-Medium.otf", weight: "500" },
        { path: "../assets/fonts/poppins/Poppins-SemiBold.otf", weight: "600" },
        { path: "../assets/fonts/poppins/Poppins-Bold.otf", weight: "700" },
    ],
});

export const leagueSpartan = localFont({
    variable: "--font-league-spartan",
    display: "swap",
    src: [
        {
            path: "../assets/fonts/league-spartan/LeagueSpartan-Bold.otf",
            weight: "700",
        },
    ],
});

export const stencilGothic = localFont({
    variable: "--font-stencil-gothic",
    display: "swap",
    src: [
        {
            path: "../assets/fonts/stencil-gothic/StencilGothic.ttf",
            weight: "700",
        },
    ],
});
