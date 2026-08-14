import Image from "next/image";
import Link from "next/link";

function NotFound({
  link,
  linkText,
  text,
}: {
  link?: string;
  linkText?: string;
  text?: string;
}) {
  return (
    <div className="w-full flex flex-col gap-3 items-center justify-center text-center mt-10">
      <p className="font-bold text-xl my-4">
        {text ||
          "صفحه ای که دنبال آن بودید پیدا نشد! ممکن است آدرس اشتباه وارد شده باشد یا صفحه پاک شده باشد."}
      </p>
      <Link href={link || "/"} className="bg-primary text-white px-5 py-2 btn">
        {linkText || "بازگشت به صفحه اصلی"}
      </Link>
      <Image src={"/404.svg"} alt="404 Not Found" width={500} height={500} />
    </div>
  );
}

export default NotFound;
