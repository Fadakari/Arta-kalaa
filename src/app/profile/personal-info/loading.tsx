import React from "react";
const fields = [
  "نام",
  "نام خانوادگی",
  "شماره تلفن",
  "کد ملی",
  "ایمیل",
  "شغل",
  "تاریخ تولد",
  "استان",
  "شهر",
  "آدرس",
  "کد پستی",
  "کد معرف",
];
function Loading() {
  return (
    <div className="relative flex flex-col">
      <div className="flex flex-col sm:grid grid-cols-1 md:grid-cols-2 gap-5 mt-2 animate-pulse">
        {fields.map((label, index) => (
          <div
            key={index}
            className="bg-zinc-50 border p-4 border-zinc-200 rounded flex flex-col gap-2"
          >
            <div className="h-4 w-24 bg-zinc-300 rounded"></div>
            <div className="h-10 bg-zinc-200 rounded-xl"></div>
          </div>
        ))}

        <div className="w-full flex justify-end col-span-2">
          <div className="w-36 h-10 bg-zinc-300 rounded-lg"></div>
        </div>

      </div>
    </div>
  );
}

export default Loading;
