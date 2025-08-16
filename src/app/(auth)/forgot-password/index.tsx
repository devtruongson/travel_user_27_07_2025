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
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const forgotPasswordSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

type Props = {
    onBack: () => void;
    onOtpSent: (email: string) => void;
};

export default function ForgotPasswordForm({ onBack, onOtpSent }: Props) {
    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const [loading, setLoading] = useState(false);

    async function onSubmit(values: ForgotPasswordFormValues) {
        setLoading(true);

        try {
            const response = await API.post("/forgot-password", {
                email: values.email,
            });

            console.log("Forgot password response:", response.data);
            toast.success("Mã OTP đã được gửi đến email của bạn");
            onOtpSent(values.email);
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast.error(
                error?.response?.data?.message || "Có lỗi xảy ra khi gửi email"
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
                    Quay lại đăng nhập
                </button>
            </div>

            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Quên mật khẩu
                </h2>
                <p className="text-gray-600">
                    Nhập email của bạn để nhận mã OTP đặt lại mật khẩu
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <RequiredLabel label="Email" required />
                                <FormControl>
                                    <Input
                                        className="input-style"
                                        placeholder="example@gmail.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="button-style mt-5 w-full"
                        disabled={loading}
                    >
                        {loading ? "Đang gửi..." : "Gửi mã OTP"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
