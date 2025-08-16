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
import { setAuth } from "@/lib/redux/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const phoneRegex = /^\+?\d{10,15}$/;

const formSchema = z.object({
    info: z
        .string()
        .min(1, "Email hoặc số điện thoại không được bỏ trống")
        .refine(
            (value) =>
                z.string().email().safeParse(value).success ||
                phoneRegex.test(value),
            {
                message: "Email hoặc số điện thoại không hợp lệ",
            }
        ),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự").max(50),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
    onSwitch: () => void;
    onLoginVerifiedSuccess: (user: any) => void;
    onNeedVerify: (userId: string) => void;
    onForgotPassword: () => void;
};

export default function LoginForm({
    onSwitch,
    onLoginVerifiedSuccess,
    onNeedVerify,
    onForgotPassword,
}: Props) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            info: "",
            password: "",
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    async function onSubmit(values: FormValues) {
        setLoading(true);

        try {
            const payload = {
                login: values.info.trim(),
                password: values.password,
            };

            // Step 1: Gửi login
            const resLogin = await API.post("/login", payload);
            const accessToken = resLogin.data.access_token;

            dispatch(
                setAuth({
                    accessToken: accessToken,
                    user: resLogin.data.user,
                })
            );

            if (!accessToken) {
                throw new Error("Không nhận được access token");
            }

            // Step 2: Lưu token vào localStorage
            localStorage.setItem("access_token", accessToken);

            // Step 3: Gọi /me để lấy thông tin user chính xác
            const resMe = await API.get("/me");
            const user = resMe.data.user;

            // Step 4: Xác thực
            if (!user.is_verified) {
                toast.warning("Tài khoản của bạn chưa được xác thực.");
                onNeedVerify(user.id);
            } else {
                // Step 5: Cập nhật Redux
                dispatch(setAuth({ user, accessToken }));
                toast.success("Đăng nhập thành công");
                onLoginVerifiedSuccess(user);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Đăng nhập thất bại");
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
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="info"
                    render={({ field }) => (
                        <FormItem>
                            <RequiredLabel
                                label="Email/Số điện thoại"
                                required
                            />
                            <FormControl>
                                <Input
                                    className="input-style"
                                    placeholder="example@gmail.com / 0912345678"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <RequiredLabel label="Mật khẩu" required />
                            <div className="relative">
                                <FormControl>
                                    <Input
                                        type={
                                            showPassword ? "text" : "password"
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

                <Button
                    type="submit"
                    className="button-style mt-5"
                    disabled={loading}
                >
                    {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                </Button>

                <div className="text-center mt-3">
                    <button
                        type="button"
                        onClick={onForgotPassword}
                        className="text-sm text-blue-600 underline cursor-pointer hover:text-blue-800"
                    >
                        Quên mật khẩu?
                    </button>
                </div>
            </form>

            <div className="text-sm text-center mt-4">
                <span>Bạn chưa có tài khoản? </span>
                <button
                    type="button"
                    onClick={onSwitch}
                    className="text-blue-600 underline cursor-pointer"
                >
                    Đăng ký
                </button>
            </div>
        </Form>
    );
}
