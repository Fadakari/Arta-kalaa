import { toGregorian } from "jalaali-js";
import { format as timeagoFormat, register } from "timeago.js";
import dayjs from "dayjs";

register("fa", function (number: number, index: number) {
  const strings: [string, string][] = [
    ["لحظاتی پیش", "هم‌اکنون"],
    ["%s ثانیه پیش", "در %s ثانیه"],
    ["1 دقیقه پیش", "در 1 دقیقه"],
    ["%s دقیقه پیش", "در %s دقیقه"],
    ["1 ساعت پیش", "در 1 ساعت"],
    ["%s ساعت پیش", "در %s ساعت"],
    ["1 روز پیش", "در 1 روز"],
    ["%s روز پیش", "در %s روز"],
    ["1 هفته پیش", "در 1 هفته"],
    ["%s هفته پیش", "در %s هفته"],
    ["1 ماه پیش", "در 1 ماه"],
    ["%s ماه پیش", "در %s ماه"],
    ["1 سال پیش", "در 1 سال"],
    ["%s سال پیش", "در %s سال"],
  ];

  return strings[index];
});

export function formatToPersianTimeAgo(jalaliDate: string): string {
  const [datePart, timePart] = jalaliDate.split(" ");
  const [jy, jm, jd] = datePart.split("-").map(Number);
  const { gy, gm, gd } = toGregorian(jy, jm, jd);

  // ساخت رشته تاریخ میلادی با همان زمان
  const miladiStr = `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")} ${timePart}`;

  const miladi = dayjs(miladiStr, "YYYY-MM-DD HH:mm:ss").toDate();

  return timeagoFormat(miladi, "fa");
}
