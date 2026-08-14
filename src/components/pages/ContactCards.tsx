import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaWhatsapp,
  FaInstagram,
} from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { TbClockHour4 } from "react-icons/tb";

export interface ContactInfo {
  id: number;
  phone_number: string | null;
  address: string | null;
}

const fallbackContact = {
  phone: "۰۳۵-۳۶۲۶۴۲۶۴",
  mobile: "۰۹۱۳۰۱۷۶۵۷۴",
  address: "یزد، خیابان شهید رجایی، نبش کوچه ۳۰، آرتاکالا",
  email: "info@artakala.ir",
  workingHours: "روزهای کاری ۱۰ تا ۲۰",
};

function toTelLink(number: string) {
  const digits = number.replace(/[^\d+]/g, "");
  if (digits.startsWith("0")) return `tel:${digits}`;
  return `tel:${digits}`;
}

interface ContactCardsProps {
  contacts: ContactInfo[];
}

export default function ContactCards({ contacts }: ContactCardsProps) {
  const primary = contacts[0];
  const phone = primary?.phone_number || fallbackContact.phone;
  const address = primary?.address || fallbackContact.address;
  const mapQuery = encodeURIComponent(address);

  const cards = [
    {
      icon: FaPhoneAlt,
      title: "تماس تلفنی",
      value: phone,
      hint: "پاسخگویی در ساعات اداری",
      href: toTelLink(phone),
      color: "from-blue-500 to-primary",
    },
    {
      icon: FaWhatsapp,
      title: "واتساپ",
      value: fallbackContact.mobile,
      hint: "مشاوره و پاسخ سریع",
      href: "https://wa.me/9891330176574",
      color: "from-green-500 to-emerald-600",
      external: true,
    },
    {
      icon: HiOutlineMail,
      title: "ایمیل",
      value: fallbackContact.email,
      hint: "پاسخ در کمتر از ۲۴ ساعت",
      href: `mailto:${fallbackContact.email}`,
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: TbClockHour4,
      title: "ساعات کاری",
      value: fallbackContact.workingHours,
      hint: "شنبه تا پنج‌شنبه",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: FaMapMarkerAlt,
      title: "آدرس فروشگاه",
      value: address,
      hint: "مراجعه حضوری با هماهنگی",
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      color: "from-rose-500 to-pink-600",
      external: true,
    },
    {
      icon: FaInstagram,
      title: "اینستاگرام",
      value: "@arta_kalaa",
      hint: "جدیدترین محصولات و تخفیف‌ها",
      href: "https://www.instagram.com/arta_kalaa",
      color: "from-pink-500 to-rose-600",
      external: true,
    },
  ];

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const content = (
          <div className="group relative h-full overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div
              className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${card.color}`}
            />
            <div
              className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white shadow-lg`}
            >
              <card.icon className="size-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-gray-700">{card.value}</p>
            <p className="mt-3 text-xs text-gray-400">{card.hint}</p>
            {card.href && (
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary transition-colors group-hover:text-primary-700">
                {card.external ? "مشاهده" : "تماس بگیرید"}
                <span className="mr-1 transition-transform group-hover:-translate-x-1">
                  ←
                </span>
              </span>
            )}
          </div>
        );

        if (card.href) {
          const Wrapper = card.external ? "a" : "a";
          const linkProps = card.external
            ? {
                href: card.href,
                target: "_blank" as const,
                rel: "noopener noreferrer",
              }
            : { href: card.href };

          return (
            <Wrapper
              key={card.title}
              {...linkProps}
              className="block h-full"
            >
              {content}
            </Wrapper>
          );
        }

        return <div key={card.title}>{content}</div>;
      })}
    </div>
  );
}
