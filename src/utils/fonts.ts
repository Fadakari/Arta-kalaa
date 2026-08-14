import localFont from "next/font/local";

export const iranyekan = localFont({
    variable: "--font-iranyekan",
    src: [
        {
            path: "../../public/fonts/iranyekanweblight.woff2",
            weight: "100",
            style: "normal",
        },
        {
            path: "../../public/fonts/iranyekanwebregular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/iranyekanwebbold.woff2",
            weight: "700",
            style: "normal",
        },
        {
            path: "../../public/fonts/iranyekanwebbold.woff2",
            weight: "900",
            style: "normal",
        },
    ],
});


export const pelak = localFont({
    variable: "--font-pelak",
    src: [
        {
            path: "../../public/fonts/Pelak-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../../public/fonts/Pelak-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
});


export const noora = localFont({
    variable: "--font-noora",
    src: [
        {
            path: "../../public/fonts/Noora Fa-En 03 Regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});


export const dana = localFont({
    variable: "--font-dana",
    src: [
        {
            path: "../../public/fonts/dana-fanum-regular.woff2",
            weight: "400",
            style: "normal",
        },
    ],
});