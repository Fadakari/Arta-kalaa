// constants/home.ts

import { Brand, Feature } from "@/types";

export const FEATURES: Feature[] = [
  {
    img: "/assets/history.png",
    title: "ضمانت بازگشت وجه",
    desc: "در صورت عدم رضایت از کالا، تا ۷ روز امکان بازگشت وجه دارید. بدون قید و شرط و با ضمانت کامل",
  },
  {
    img: "/assets/credit-card.png",
    title: "تضمین قیمت",
    desc: "کمترین قیمت بازار را تضمین می‌کنیم. اگر جای دیگر ارزان‌تر دیدید، تفاوت قیمت را به شما برگشت می‌دهیم",
  },
  {
    img: "/assets/fast.png",
    title: "ارسال سریع",
    desc: "ارسال امن و مطمئن در کوتاه‌ترین زمان ممکن. تحویل اکسپرس در تهران کمتر از ۲۴ ساعت",
  },
  {
    img: "/assets/headphone.png",
    title: "پشتیبانی عالی",
    desc: "پشتیبانی ۲۴ ساعته شبانه روز حتی در ایام تعطیل. تیم حرفه‌ای آماده پاسخگویی به سوالات شما",
  },
  {
    img: "/assets/badge.png",
    title: "اصالت کالا",
    desc: "تضمین اصالت کالا با گارانتی معتبر. تمام محصولات اصل و با ضمانت بازگشت وجه",
  },
  {
    img: "/assets/history.png",
    title: "مشاوره رایگان",
    desc: "مشاوره تخصصی قبل از خرید توسط کارشناسان مجرب. راهنمایی در انتخاب بهترین محصول متناسب با نیاز شما",
  },
];

// طبق تایپ Brand در types که فقط name و image دارد (بدون link)
export const BRANDS: Brand[] = [
  {
    name: "بوش (BOSCH)",
    image: "/brands/d292c0fe-5ba9-4725-b6e5-1a80cf3f1c8aLogo_Bosch_Sicherheitssysteme_GmbH.png",
  },
  {
    name: "فیلیپس (PHILIPS)",
    image: "/brands/1687378b-4dce-4c5f-88b0-eaf175e96ec01820px-Philips-Crest-Logo.png",
  },
  {
    name: "تفال (TEFAL)",
    image: "/brands/1c6e27a7-0cb1-413e-87c9-3cb030c7b173410_tefal.jpg",
  },
  {
    name: "پاناسونیک (PANASONIC)",
    image: "/brands/d0eecc7a-e030-4dfa-b7d0-7380eba86b06Brand__Panasonic.jpg",
  },
  {
    name: "براون (BRAUN)",
    image: "/brands/b2eeba94-f502-4c0c-add8-3adacaa9e2d6original-braun-logo.jpg",
  },
  {
    name: "مولینکس (Moulinex)",
    image: "/brands/1254ca41-da94-4e80-9a5e-16a6bf746603135124971_uvXGhYOh0GEHIuVMB1z7dU5JK2ovACFcHB5eotxZ_28.jpg",
  },
  {
    name: "کلیکون (Clicon)",
    image: "/brands/5aa09b13-9922-485d-a75d-af9240151891images1.jpg",
  },
  {
    name: "دلونگی (DeLonghi)",
    image: "/brands/0dbecab9-c3da-49bc-bfdb-872db972ec81تعمیرات-دلونگی.jpeg",
  },
  {
    name: "بابلیس (Babyliss)",
    image: "/brands/dc5afe24-8ca2-47e2-8a35-1776d6db8f46IMG_8799.png",
  },
];

export const METADATA_CONFIG = {
  title: "آرتا کالا | فروشگاه تخصصی ابزار",
  description: "آرتا کالا، فروشگاه تخصصی با بهترین قیمت و تضمین کیفیت. ارسال سریع، تخفیف‌های ویژه، و مقالات آموزشی تخصصی.",
  keywords: [
    "آرتا کالا",
    "فروشگاه آنلاین",
    "خرید آنلاین",
    "قیمت مناسب",
    "تضمین کیفیت",
    "تخفیف ویژه",
    "ابزار",
    "ابزارآلات",
  ],
};