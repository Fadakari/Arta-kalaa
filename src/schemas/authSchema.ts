// src/schemas/authSchema.ts
import { z } from "zod";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export const loginSchema = z.object({
    password: z.string().min(4, "رمز عبور حداقل ۶ کاراکتر است"),
});

export const otpSchema = z.object({
    code: z
        .string()
        .length(6, "کد باید  ۶ رقم باشد")
        .regex(/^\d+$/, "کد فقط باید شامل عدد باشد"),


    referral_code: z.string()
        .regex(/^[a-zA-Z0-9]{6,10}$/, "کد معرف باید ۶ تا ۱۰ کاراکتر از حروف و اعداد باشد")
        .optional()
        .or(z.literal(""))
});

export const signupSchema = z
    .object({
        phone_number: z
            .string()
            .regex(/^(۰۹|09)[۰-۹0-9]{9}$/, "شماره تلفن باید 11 رقم  باشد"),
        // password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
        // confirm_password: z.string().min(6, "تکرار رمز عبور الزامی است"),
    })
// .superRefine((data, ctx) => {
//     if (data.confirm_password !== data.password) {
//         ctx.addIssue({
//             path: ["confirm_password"],
//             code: z.ZodIssueCode.custom,
//             message: "رمز عبور مطابقت ندارد",
//         });
//     }
// });