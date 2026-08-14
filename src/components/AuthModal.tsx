"use client";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HiXMark } from "react-icons/hi2";
import {
  LoginFormValues,
  loginSchema,
  OtpFormValues,
  otpSchema,
  SignupFormValues,
  signupSchema,
} from "@/schemas/authSchema";
import { convertPersianToEnglish } from "@/utils/converNumbers";
import {
  checkPhoneExists,
  login,
  sendOtp,
  verifyOtp,
} from "@/services/authActions";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal } from "@/context/AuthModalProvider";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function OtpInput({
  value,
  onChange,
  error,
  length = 6,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
  length?: number;
}) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;
    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    const finalValue = newValue.join('').slice(0, length);
    onChange(finalValue);
    if (val && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
  };

  return (
    <div>
      <div className="flex gap-2 justify-center" dir="ltr">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputsRef.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-2 text-center">{error}</p>}
    </div>
  );
}

export default function AuthModal() {
  const { isOpen, onClose } = useAuthModal();
  const [step, setStep] = useState<"PHONE" | "OTP" | "PASSWORD">("PHONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(120);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const searchParams = useSearchParams();
  const [hasPasswordError, setHasPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const phoneForm = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });
  const otpForm = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) });
  const loginForm = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const checkPhoneNumber = async ({ phone_number }: SignupFormValues) => {
    try {
      setLoading(true);
      const converted = convertPersianToEnglish(phone_number);
      setPhoneNumber(converted);
      const exists = await checkPhoneExists(converted);
      if (exists) {
        setIsNewUser(false);
        setStep("PASSWORD");
      } else {
        setIsNewUser(true);
        const result = await sendOtp(converted);
        if (result?.status === 200) {
          setStep("OTP");
          setCanResend(false);
          setResendTimer(120);
        } else {
          phoneForm.setError("phone_number", { message: "ارسال کد تایید ناموفق بود" });
        }
      }
    } catch {
      phoneForm.setError("phone_number", { message: "خطایی در ارسال اطلاعات" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ اصلاح: بررسی درست موفقیت
  const onPasswordLogin = async ({ password }: { password: string }) => {
    setHasPasswordError(false);
    setLoading(true);
    try {
      const result = await login(phoneNumber, password);
      
      // ✅ بررسی وجود access یا success
      if (result?.access || result?.success) {
        loginForm.reset();
        onClose();
        const redirectTo = searchParams.get("redirectTo") || "/profile";
        router.push(redirectTo);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch {
      loginForm.setError("password", { message: "رمز عبور اشتباه است" });
      setHasPasswordError(true);
    } finally {
      setLoading(false);
    }
  };

  // ✅ اصلاح: بررسی درست موفقیت
  const onOtpSubmit = async (data: OtpFormValues) => {
    setLoading(true);
    try {
      const result = await verifyOtp(phoneNumber, data.code, data.referral_code);
      
      // ✅ بررسی وجود access یا success
      if (result?.access || result?.success) {
        loginForm.reset();
        onClose();
        const redirectTo = searchParams.get("redirectTo") || "/profile";
        router.push(redirectTo);
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch {
      otpForm.setError("code", { message: "کد وارد شده اشتباه یا منقضی شده" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === "OTP") {
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) { clearInterval(interval); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [step]);

  useEffect(() => {
    phoneForm.reset(); otpForm.reset(); loginForm.reset();
  }, [step]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <p className="font-bold text-lg">ورود | ثبت‌نام</p>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-lg transition-colors">
            <HiXMark className="size-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <form
            onSubmit={
              step === "PHONE" ? phoneForm.handleSubmit(checkPhoneNumber) :
              step === "OTP" ? otpForm.handleSubmit(onOtpSubmit) :
              loginForm.handleSubmit(onPasswordLogin)
            }
            className="space-y-4"
          >
            {step === "PHONE" && (
              <>
                <label className="block text-sm font-medium text-gray-700">شماره تلفن</label>
                <input
                  {...phoneForm.register("phone_number")}
                  maxLength={11}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  inputMode="numeric"
                  placeholder="مثلاً 09123456789"
                />
                {phoneForm.formState.errors.phone_number && (
                  <p className="text-xs text-red-500">{phoneForm.formState.errors.phone_number.message}</p>
                )}
              </>
            )}

            {step === "PASSWORD" && (
              <>
                <label className="block text-sm font-medium text-gray-700">رمز عبور</label>
                <div className="relative">
                  <input
                    {...loginForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                  </button>
                </div>
                <button
                  type="button"
                  className="text-xs text-blue-500 underline mt-2"
                  onClick={() => { setPhoneNumber(""); setStep("PHONE"); }}
                >
                  تغییر شماره
                </button>
                {!loading && hasPasswordError && (
                  <p className="text-xs text-red-500">{loginForm.formState.errors.password?.message}</p>
                )}
                <button
                  type="button"
                  className="text-xs text-blue-500 underline mt-1 block"
                  onClick={async () => {
                    try { setLoading(true); const result = await sendOtp(phoneNumber); if (result?.status === 200) { setStep("OTP"); setCanResend(false); setResendTimer(120); } } finally { setLoading(false); }
                  }}
                >
                  ورود با کد تایید
                </button>
              </>
            )}

            {step === "OTP" && (
              <>
                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-sm text-gray-700">
                  کد تایید برای شماره {phoneNumber} ارسال شد
                  <button
                    type="button"
                    className="text-xs text-blue-500 underline mr-2"
                    onClick={() => { setPhoneNumber(""); setStep("PHONE"); }}
                  >
                    تغییر شماره
                  </button>
                </div>

                <label className="block text-sm font-medium text-gray-700">کد تایید</label>
                <OtpInput
                  value={otpForm.watch("code") || ""}
                  onChange={(val) => otpForm.setValue("code", val)}
                  error={otpForm.formState.errors?.code?.message}
                />

                {isNewUser && (
                  <>
                    <label className="block text-sm font-medium text-gray-700">کد معرف (اختیاری)</label>
                    <input
                      {...otpForm.register("referral_code")}
                      maxLength={11}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    />
                  </>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? "لطفا صبر کنید..." : step === "PHONE" ? "ادامه" : step === "OTP" ? "تایید" : "ورود"}
            </button>

            {step === "OTP" && (
              <button
                type="button"
                className="w-full text-xs text-blue-500 py-2"
                onClick={() => { sendOtp(phoneNumber); setCanResend(false); setResendTimer(120); }}
                disabled={!canResend}
              >
                {canResend ? "ارسال مجدد کد" : `ارسال مجدد بعد از ${Math.floor(resendTimer / 60)}:${String(resendTimer % 60).padStart(2, "0")}`}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}