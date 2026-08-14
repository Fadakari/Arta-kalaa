export type IranianBank = {
    name: string;
    className: string;
    bins: string[]; // لیست پیش‌شماره‌های کارت
};

export const iranianBanks: IranianBank[] = [
    {
        name: "بانک ملی ایران",
        className: "ibl-bmi",
        bins: ["627412", "627353", "627760", "627381"],
    },
    {
        name: "بانک سپه",
        className: "ibl-sepah",
        bins: ["589210", "589463", "627489"],
    },
    {
        name: "بانک توسعه صادرات ایران",
        className: "ibl-bsi",
        bins: ["603799", "639607"],
    },
    {
        name: "بانک صنعت و معدن",
        className: "ibl-san",
        bins: ["627648", "639217"],
    },
    {
        name: "بانک کشاورزی",
        className: "ibl-bki",
        bins: ["603770", "639217", "639370", "639217"],
    },
    {
        name: "بانک مسکن",
        className: "ibl-maskan",
        bins: ["628023", "639217", "639346"],
    },
    {
        name: "بانک توسعه تعاون",
        className: "ibl-taavon",
        bins: ["505785", "627488"],
    },
    {
        name: "پست بانک ایران",
        className: "ibl-postbank",
        bins: ["628157"],
    },

    // بانک‌های خصوصی
    {
        name: "بانک اقتصاد نوین",
        className: "ibl-eb",
        bins: ["627353", "502938", "627410"],
    },
    {
        name: "بانک پارسیان",
        className: "ibl-parsian",
        bins: ["621986", "639347", "639370"],
    },
    {
        name: "بانک پاسارگاد",
        className: "ibl-pasargad",
        bins: ["502910", "627488"],
    },
    {
        name: "بانک کارآفرین",
        className: "ibl-karafarin",
        bins: ["627412", "639370"],
    },
    {
        name: "بانک سامان",
        className: "ibl-saman",
        bins: ["502938", "639370"],
    },
    {
        name: "بانک سینا",
        className: "ibl-sina",
        bins: ["639370", "502938"],
    },
    {
        name: "بانک سرمایه",
        className: "ibl-sarmayeh",
        bins: ["639370"],
    },
    {
        name: "بانک شهر",
        className: "ibl-shahr",
        bins: ["627381", "639370"],
    },
    {
        name: "بانک دی",
        className: "ibl-day",
        bins: ["627412", "639370"],
    },
    {
        name: "بانک صادرات ایران",
        className: "ibl-saderat",
        bins: ["603799", "639370"],
    },
    {
        name: "بانک ملت",
        className: "ibl-mellat",
        bins: ["610433", "627353"],
    },
    {
        name: "بانک تجارت",
        className: "ibl-tejarat",
        bins: ["589210", "639370"],
    },
    {
        name: "بانک رفاه کارگران",
        className: "ibl-refah",
        bins: ["627488", "639370"],
    },
    {
        name: "بانک حکمت ایرانیان",
        className: "ibl-hekmat",
        bins: ["639370"],
    },
    {
        name: "بانک گردشگری",
        className: "ibl-gardeshgari",
        bins: ["639370"],
    },
    {
        name: "بانک قوامین",
        className: "ibl-ghavamin",
        bins: ["639370"],
    },
    {
        name: "بانک انصار",
        className: "ibl-ansar",
        bins: ["639370"],
    },
    {
        name: "بانک ایران زمین",
        className: "ibl-iran-zamin",
        bins: ["639370"],
    },

    // موسسات اعتباری و قرض‌الحسنه
    {
        name: "بانک قرض‌الحسنه مهر ایران",
        className: "ibl-mehr",
        bins: ["639370"],
    },
    {
        name: "بانک قرض‌الحسنه رسالت",
        className: "ibl-resalat",
        bins: ["639370"],
    },
    {
        name: "موسسه اعتباری توسعه",
        className: "ibl-tosee",
        bins: ["639370"],
    },
    {
        name: "موسسه اعتباری کوثر",
        className: "ibl-kosar",
        bins: ["639370"],
    },
    {
        name: "موسسه اعتباری ملل",
        className: "ibl-melal",
        bins: ["639370"],
    },
    {
        name: "موسسه اعتباری نور",
        className: "ibl-noor",
        bins: ["639370"],
    },
];

export function getBankClass(cardNumber: string): string | null {
    if (!cardNumber || cardNumber.length < 6) return null;

    const bin = cardNumber.slice(0, 6);

    for (const bank of iranianBanks) {
        if (bank.bins.includes(bin)) {
            return bank.className;
        }
    }

    return null;
}