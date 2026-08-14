"use client";
import { useUser } from "@/context/UserContext";
import { convertNumberToPersian } from "@/utils/converNumbers";
import { FaRegEdit } from "react-icons/fa";
import provincesWithCities from "@/data/iran.json";
import { z } from "zod";
import { useState } from "react";
import { addToast } from "@heroui/toast";
import { changePassword, editInfo } from "@/services/usersActions";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { BsClipboard2 } from "react-icons/bs";
import { BsClipboard2Check } from "react-icons/bs";
import { Tooltip } from "@heroui/react";
import BirthDatePicker from "./BirthDatePicker";
import { PiHandCoinsDuotone } from "react-icons/pi";

const schema = z.object({
  first_name: z
    .string()
    .min(1, "نام الزامی است.")
    .regex(/^[\u0600-\u06FF\s]+$/, "فقط حروف فارسی مجاز است."),
  last_name: z.string().min(1, "نام خانوادگی الزامی است."),
  national_code: z.string().optional(),
  job: z.string().optional(),
  address: z.string().min(1, "آدرس الزامی است."),
  postal_code: z.string().min(1, "کد پستی الزامی است."),
  birth_date: z.string().optional(),
  province: z.string().min(1, "استان الزامی است."),
  city: z.string().min(1, "شهر الزامی است."),
  phone_number: z.string().optional(),
  referral_code: z.string().optional(),
  email: z.string().email("ایمیل معتبر نیست.").optional(),
});

const password_Schema = z
  .object({
    password: z
      .string()
      .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد.")
      .regex(/[A-Za-z]/, "رمز عبور باید حداقل شامل یک حرف باشد.")
      .regex(/[0-9]/, "رمز عبور باید حداقل شامل یک عدد باشد.")
      .optional()
      .or(z.literal("")),
    confirm_password: z.string().optional().or(z.literal("")),
  })
  .refine((data) => !data.password || data.password === data.confirm_password, {
    message: "رمز عبور و تکرار آن یکسان نیستند.",
    path: ["confirm_password"],
  });
type PasswordSchema = z.infer<typeof password_Schema>;
type FormSchema = z.infer<typeof schema>;
type FieldKey = keyof FormSchema;

const inputTypes: Partial<Record<FieldKey, string>> = {
  email: "email",
  birth_date: "date",
  phone_number: "tel",
  postal_code: "number",
  national_code: "number",
};

function PersonalInfoForm() {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const identity = user?.identity;
  const defaultValues: FormSchema = {
    first_name: identity?.first_name || "",
    last_name: identity?.last_name || "",
    phone_number: convertNumberToPersian(String(identity?.phone_number)) || "",
    national_code: identity?.national_code || "",
    email: identity?.email || "",
    job: identity?.job || "",
    birth_date: identity?.birth_date || "",
    province: identity?.province || "",
    city: identity?.city || "",
    address: identity?.address || "",
    postal_code: identity?.postal_code || "",
    referral_code: identity?.referral_code || "",
  };
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
    setError,
  } = useForm<FormSchema>({
    defaultValues,
    resolver: zodResolver(schema),
  });
  const {
    control: passwordControl,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors, isDirty: passwordIsDirty },
  } = useForm<PasswordSchema>({
    defaultValues: { password: "", confirm_password: "" },
    resolver: zodResolver(password_Schema),
  });

  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);
  const router = useRouter();

  const [editableFields, setEditableFields] = useState<
    Record<FieldKey, boolean>
  >(
    Object.keys(defaultValues).reduce(
      (acc, key) => {
        acc[key as FieldKey] = false;
        return acc;
      },
      {} as Record<FieldKey, boolean>
    )
  );
  const handleEditClick = (key: FieldKey) => {
    if (key === "phone_number" || key === "referral_code") return;
    setEditableFields((prev) => ({ ...prev, [key]: true }));
  };

  const onSubmit = async (data: FormSchema) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { phone_number, referral_code, ...filteredData } = data;

      const res = await editInfo(filteredData);

      if (res.success) {
        addToast({ title: "اطلاعات با موفقیت ویرایش شد", color: "success" });
        setIsSubmittedSuccessfully(true);
        setEditableFields(
          Object.keys(defaultValues).reduce(
            (acc, key) => {
              acc[key as FieldKey] = false;
              return acc;
            },
            {} as Record<FieldKey, boolean>
          )
        );
        if (redirect) {
          window.location.href = decodeURIComponent(redirect);
        } else {
          window.location.reload();
        }
      } else {
        if (res.errors) {
          Object.entries(res.errors).forEach(([key, messages]) => {
            setError(key as FieldKey, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          });
        }
        if (res.message) {
          addToast({ title: res.message, color: "danger" });
        }
      }
    } catch (err) {
      addToast({ title: "خطا در ارسال اطلاعات", color: "danger" });
      console.error(err);
    }
  };
  const onPasswordSubmit = async (data: PasswordSchema) => {
    if (!data.password) {
      addToast({
        title: "رمز عبور را وارد کنید",
        color: "danger",
      });
      return;
    }
    try {
      const res = await changePassword({
        new_password: data.password,
        confirm_password: data.confirm_password,
      });

      if (res.success) {
        addToast({ title: "رمز عبور با موفقیت ویرایش شد", color: "success" });
        setIsSubmittedSuccessfully(true);

        router.refresh();
      } else {
        if (res.errors) {
          Object.entries(res.errors).forEach(([key, messages]) => {
            setError(key as FieldKey, {
              type: "server",
              message: Array.isArray(messages) ? messages[0] : messages,
            });
          });
        }
        if (res.message) {
          addToast({ title: res.message, color: "danger" });
        }
      }
    } catch (err) {
      addToast({ title: "خطا در ارسال اطلاعات", color: "danger" });
      console.error(err);
    }
  };
  const selectedProvince = watch("province");
  const cities =
    provincesWithCities[selectedProvince as keyof typeof provincesWithCities] ||
    [];
  const [copied, setCopied] = useState(false);

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-2  gap-5 mt-2 items-start  max-sm:text-xs"
      >
        {(Object.entries(defaultValues) as [FieldKey, string][]).map(
          ([key]) => (
            <Controller
              key={key}
              name={key}
              control={control}
              render={({ field }) => {
                const handleCopy = () => {
                  navigator.clipboard.writeText(field.value ?? "");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                };

                return key === "referral_code" ? (
                  <div className="flex flex-col gap-3 border-l-4 bg-primary/5 p-4 rounded-lg border border-primary">
                    <p className="text-lg font-bold text-primary-700">
                      {fieldLabel(key)}
                    </p>

                    <div className="w-full relative">
                      <input
                        id={key}
                        type="text"
                        autoComplete="off"
                        className="bg-transparent border border-zinc-300 text-zinc-700 text-sm rounded-lg block w-full p-2.5 cursor-default select-all"
                        value={field.value}
                        disabled
                        readOnly
                      />
                      <Tooltip
                        content={copied ? "کپی شد" : "کپی کردن"}
                        color="default"
                        classNames={{ content: "!text-zinc-400" }}
                      >
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label="کپی کد معرف"
                          className="absolute top-1/2 left-2 -translate-y-1/2 flex items-center justify-center p-2 rounded-lg text-zinc-600 hover:bg-zinc-600/20 transition"
                        >
                          {copied ? (
                            <BsClipboard2Check className="w-5 h-5" />
                          ) : (
                            <BsClipboard2 className="w-5 h-5" />
                          )}
                          <span className="sr-only" aria-live="polite">
                            {copied && "کپی شد"}
                          </span>
                        </button>
                      </Tooltip>
                    </div>

                    <div className="flex items-start text-xs text-zinc-600">
                      <span className="mr-1 mt-0.5">🎁</span>
                      <p>
                        کد دعوتت رو با دوستانت به اشتراک بگذار؛ با هر ثبت‌نام،{" "}
                        <b>امتیاز هدیه</b> می‌گیری!
                      </p>
                    </div>

                    {errors[key] && (
                      <p className="text-red-500 text-sm">
                        {errors[key]?.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    className={`flex flex-col gap-1 relative border bg-zinc-50 p-3 rounded-lg ${
                      errors[key] ? "border-red-500" : "border-zinc-300"
                    }`}
                  >
                    <label
                      htmlFor={key}
                      className="text-base sm:text-lg font-semibold text-zinc-500"
                    >
                      {fieldLabel(key)}
                    </label>

                    {key === "province" ? (
                      <select
                        id={key}
                        {...field}
                        autoComplete="address-level1"
                        disabled={!editableFields[key]}
                        className="rounded-xl px-2 py-3 disabled:opacity-50 disabled:border-none border border-zinc-200"
                      >
                        <option value="">انتخاب کنید</option>
                        {Object.keys(provincesWithCities).map((province) => (
                          <option key={province} value={province}>
                            {province}
                          </option>
                        ))}
                      </select>
                    ) : key === "city" ? (
                      <select
                        id={key}
                        {...field}
                        autoComplete="address-level2"
                        disabled={!editableFields[key] || !selectedProvince}
                        className="rounded-xl px-2 py-3 disabled:opacity-50 disabled:border-none border border-zinc-200"
                      >
                        <option value="">انتخاب کنید</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    ) : key === "birth_date" ? (
                      <BirthDatePicker
                        value={field.value || ""}
                        onChange={field.onChange}
                        disabled={!editableFields["birth_date"]}
                      />
                    ) : (
                      <input
                        id={key}
                        {...field}
                        autoComplete="off"
                        type={inputTypes[key] || "text"}
                        disabled={!editableFields[key]}
                        placeholder={`${fieldLabel(key)} را وارد کنید`}
                        className="w-full rounded-xl px-2 py-3 placeholder:text-zinc-400 disabled:opacity-50 disabled:border-none border border-zinc-200 text-right"
                      />
                    )}

                    {errors[key] && (
                      <p className="text-red-500 text-sm">
                        {errors[key]?.message}
                      </p>
                    )}

                    {!editableFields[key] && key !== "phone_number" && (
                      <button
                        type="button"
                        className="mt-2 w-fit px-3 py-1 rounded text-primary-700 absolute left-2 top-2"
                        onClick={() => handleEditClick(key)}
                      >
                        <FaRegEdit className="inline size-4 ml-1" />
                      </button>
                    )}
                  </div>
                );
              }}
            />
          )
        )}
        <div className="col-span-2 text-left">
          <button
            type="submit"
            className="btn-primary rounded-lg !px-7 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!isDirty || isSubmittedSuccessfully}
          >
            ویرایش اطلاعات
          </button>
        </div>
        <div className="absolute -top-2 left-0 bg-primary-100 border-primary text-zinc-600 animate-fade border px-4 py-1 rounded-full flex items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <PiHandCoinsDuotone />
            <p className="text-sm font-semibold">
              امتیاز {user?.identity.points}
            </p>
          </div>
          <span className="text-lg font-medium">
            {convertNumberToPersian(identity?.points || "")}
          </span>
        </div>
      </form>
      <form
        onSubmit={handleSubmitPassword(onPasswordSubmit)}
        className="flex flex-col gap-3 mt-5"
      >
        <div className="border bg-zinc-50 p-3 rounded-lg border-zinc-300 flex flex-col gap-3">
          <label className="text-lg font-semibold text-zinc-500">
            تغییر رمز عبور
          </label>

          <Controller
            name="password"
            control={passwordControl}
            render={({ field }) => (
              <div className="flex flex-col">
                <input
                  {...field}
                  type="password"
                  placeholder="رمز عبور جدید"
                  className={`w-full rounded-xl px-2 py-3 border ${
                    passwordErrors.password
                      ? "border-red-500"
                      : "border-zinc-200"
                  }`}
                />
                {passwordErrors.password && (
                  <p className="text-red-500 text-sm">
                    {passwordErrors.password.message}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            name="confirm_password"
            control={passwordControl}
            render={({ field }) => (
              <div className="flex flex-col">
                <input
                  {...field}
                  type="password"
                  placeholder="تکرار رمز عبور"
                  className={`w-full rounded-xl px-2 py-3 border ${
                    passwordErrors.confirm_password
                      ? "border-red-500"
                      : "border-zinc-200"
                  }`}
                />
                {passwordErrors.confirm_password && (
                  <p className="text-red-500 text-sm">
                    {passwordErrors.confirm_password.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>
        <div className="text-left">
          <button
            type="submit"
            className="btn-primary rounded-lg !px-7 disabled:opacity-50 disabled:pointer-events-none"
            disabled={!passwordIsDirty || isSubmittedSuccessfully}
          >
            تغییر رمز عبور
          </button>
        </div>
      </form>
    </>
  );
}

function fieldLabel(key: FieldKey): string {
  const labels: Record<FieldKey, string> = {
    first_name: "نام",
    last_name: "نام خانوادگی",
    national_code: "کد ملی",
    job: "شغل",
    address: "آدرس",
    postal_code: "کد پستی",
    birth_date: "تاریخ تولد",
    province: "استان",
    city: "شهر",
    phone_number: "شماره تلفن",
    referral_code: "کد معرف",
    email: "ایمیل",
  };
  return labels[key];
}

export default PersonalInfoForm;
