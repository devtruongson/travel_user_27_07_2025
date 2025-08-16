/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const resetPasswordSchema = z
    .object({
        otp: z.string().length(6, "Mã OTP phải có 6 chữ số"),
        new_password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(50),
        new_password_confirmation: z.string(),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["new_password_confirmation"],
    });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

type Props = {
    email: string;
    onBack: () => void;
    onSuccess: () => void;
    onResendOtp: () => void;
};

export default function ResetPasswordForm({
    email,
    onBack,
    onSuccess,
    onResendOtp,
}: Props) {
    const form = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            otp: "",
            new_password: "",
            new_password_confirmation: "",
        },
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    async function onSubmit(values: ResetPasswordFormValues) {
        setLoading(true);

        try {
            await API.post("/reset-password", {
                email: email,
                otp: values.otp,
                new_password: values.new_password,
                new_password_confirmation: values.new_password_confirmation,
            });

            toast.success("Đặt lại mật khẩu thành công");
            onSuccess();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                    "Có lỗi xảy ra khi đặt lại mật khẩu"
            );
        } finally {
            setLoading(false);
        }
    }

    const RequiredLabel = ({
        label,
        required = false,
    }: {
        label: string;
        required?: boolean;
    }) => (
        <FormLabel className="text-[15px] font-[700] inline-block text-gray-600">
            {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
    );

    return (
        <div>
            <div className="flex items-center mb-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại
                </button>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Đặt lại mật khẩu
                </h2>
                <p className="text-gray-600">
                    Nhập mã OTP đã được gửi đến <strong>{email}</strong> và mật
                    khẩu mới
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel label="Mã OTP" required />
                                <FormControl>
                                    <Input
                                        className="input-style text-center text-lg tracking-widest"
                                        placeholder="000000"
                                        maxLength={6}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="new_password"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel label="Mật khẩu mới" required />
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••"
                                            {...field}
                                            className="input-style"
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                size={23}
                                                className="cursor-pointer"
                                            />
                                        ) : (
                                            <Eye
                                                size={23}
                                                className="cursor-pointer"
                                            />
                                        )}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="new_password_confirmation"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel
                                    label="Xác nhận mật khẩu mới"
                                    required
                                />
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="••••••"
                                            {...field}
                                            className="input-style"
                                        />
                                    </FormControl>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev
                                            )
                                        }
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff
                                                size={23}
                                                className="cursor-pointer"
                                            />
                                        ) : (
                                            <Eye
                                                size={23}
                                                className="cursor-pointer"
                                            />
                                        )}
                                    </button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="button-style mt-5 w-full"
                        disabled={loading}
                    >
                        {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                    </Button>

                    <div className="text-center mt-4">
                        <span className="text-sm text-gray-600">
                            Không nhận được mã?{" "}
                        </span>
                        <button
                            type="button"
                            onClick={onResendOtp}
                            className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                        >
                            Gửi lại
                        </button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
