"use client";

import Link from "next/link";
import React from "react";
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { TbClockHour4 } from "react-icons/tb";

const footerData = {
  contact: {
    phone: "۰۳۵-۳۶۲۶۴۲۶۴",
    mobile: "۰۹۱۳۰۱۷۶۵۷۴",
    address: "یزد، خیابان شهید رجایی، نبش کوچه ۳۰، آرتاکالا",
    email: "info@artakala.ir",
    workingHours: "روزهای کاری ۱۰ تا ۲۰",
  },
  quickLinks: [
    { href: "/products/offers", label: "تخفیف‌ها" },
    { href: "/products?featured=true", label: "پرفروش‌ها" },
    { href: "/articles", label: "مقالات" },
    { href: "/about-us", label: "درباره ما" },
    { href: "/contact-info", label: "تماس با ما" },
  ],
  importantLinks: [
    { href: "/", label: "صفحه اصلی" },
    { href: "/products", label: "فروشگاه" },
    { href: "/about-us", label: "درباره ما" },
    { href: "/contact-info", label: "تماس با ما" },
  ],
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white mt-20">
      
      {/* موج بالایی */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] -mt-1">
        <svg
          className="relative block w-full h-[50px] sm:h-[70px] md:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            fill="#1e3a8a"
            className="fill-blue-900"
            opacity="0.6"
          />
          <path
            d="M0,48.93c37.43,17.25,77.55,32.75,119.39,42.54,69.29,16.23,140.86,19.09,210.17,7.14,58.13-10,114.16-29.7,172-41.77,82.39-17.16,168.19-18.17,250.45-.8,70.05,14.73,146.53,39.53,214.34,19.59V0H0V48.93Z"
            fill="#1e40af"
            className="fill-blue-800"
            opacity="0.8"
          />
          <path
            d="M0,63.67c35.38,12.67,73.19,23.51,111.51,29.23,66.77,10,134.74,6.58,201-3.41,56.9-8.57,113.14-22.4,169.52-34.76,82.38-18.08,168.19-19.78,250.45-2.19,70.05,14.94,146.53,40.36,214.34,20.52V0H0V63.67Z"
            fill="#2563eb"
            className="fill-blue-600"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 lg:pt-20 lg:pb-16">
        
        {/* لوگو و توضیحات */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-block mb-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              آرتا<span className="text-sky-400">کالا</span>
            </h2>
          </Link>
          <p className="max-w-2xl mx-auto text-blue-200 text-sm leading-relaxed">
            فروشگاه تخصصی ابزار با بهترین قیمت، تضمین کیفیت و ارسال سریع
          </p>
        </div>

        {/* لینک‌های اصلی - ۳ ستون */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {/* دسترسی سریع */}
          <div>
            <h3 className="text-sky-400 font-semibold text-base mb-4 border-r-2 border-sky-400 pr-3">
              دسترسی سریع
            </h3>
            <ul className="space-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-sky-400 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* لینک های مهم */}
          <div>
            <h3 className="text-sky-400 font-semibold text-base mb-4 border-r-2 border-sky-400 pr-3">
              لینک های مهم
            </h3>
            <ul className="space-y-2">
              {footerData.importantLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-blue-200 hover:text-sky-400 text-sm transition-colors duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h3 className="text-sky-400 font-semibold text-base mb-4 border-r-2 border-sky-400 pr-3">
              تماس با ما
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-blue-200 text-sm">
                <FaMapMarkerAlt className="text-sky-400 mt-0.5 flex-shrink-0" />
                <span>{footerData.contact.address}</span>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <FaPhoneAlt className="text-sky-400 flex-shrink-0" />
                <div className="flex flex-col">
                  <span>{footerData.contact.phone}</span>
                  <span>{footerData.contact.mobile}</span>
                </div>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <HiOutlineMail className="text-sky-400 text-lg flex-shrink-0" />
                <a href={`mailto:${footerData.contact.email}`} className="hover:text-sky-400 transition-colors">
                  {footerData.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-blue-200 text-sm">
                <TbClockHour4 className="text-sky-400 text-lg flex-shrink-0" />
                <span>{footerData.contact.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* نمادهای اعتماد */}
        <div className="flex justify-center items-center gap-6 mb-8 flex-wrap">
          <a
            referrerPolicy="origin"
            target="_blank"
            rel="noopener noreferrer"
            href="https://trustseal.enamad.ir/?id=369698&Code=I6YLcWz8xiSgXqO0fwksAnbpTDwBmbZA"
            className="inline-block transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            <img
              referrerPolicy="origin"
              src="https://trustseal.enamad.ir/logo.aspx?id=369698&Code=I6YLcWz8xiSgXqO0fwksAnbpTDwBmbZA"
              alt="نماد اعتماد الکترونیکی"
              className="h-16 md:h-20 w-auto bg-white/10 rounded-lg p-1"
            />
          </a>
        </div>
      </div>

      {/* کپی‌رایت */}
      <div className="border-t border-blue-700/50 bg-blue-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-blue-300">
            <div className="flex flex-col items-center gap-2 text-center">
              <p>© {currentYear} تمام حقوق نزد <span className="text-sky-400">آرتاکالا</span> محفوظ است.</p>
              
              {/* طراحی توسط پترن */}
              <div className="mt-2 flex flex-col items-center gap-1.5">
                <span className="text-[10px] text-blue-400/40">طراحی و توسعه توسط</span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)] tracking-wide">
                  پترن
                </h2>
                
                {/* فرانت توسط امیرحسین خدادادیان - حالت محو شدگی */}
                <span className="text-[10px] text-blue-400/20 mt-0.5 opacity-60 hover:opacity-100 transition-opacity duration-300">
                  فرانت اند توسط امیرحسین خدادادیان
                </span>
              </div>
            </div>
            <div className="flex gap-5">
              <a href="#" className="hover:text-sky-400 transition-colors">حریم خصوصی</a>
              <a href="#" className="hover:text-sky-400 transition-colors">قوانین و مقررات</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;