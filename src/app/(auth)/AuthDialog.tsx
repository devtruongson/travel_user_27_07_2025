/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import LoginForm from "./login";
import RegisterForm from "./register";
import MethodSelect from "./method-select";
import OtpVerification from "./otp-verification";
import ForgotPasswordForm from "./forgot-password";
import ResetPasswordForm from "./reset-password";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { API } from "@/lib/api";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

type Step =
    | "login"
    | "register"
    | "verify-method"
    | "verify-otp"
    | "forgot-password"
    | "reset-password"
    | "success";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export default function AuthDialog({ open, onOpenChange }: Props) {
    const [step, setStep] = useState<Step>("login");
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string>("");
    const [otpExpireTime, setOtpExpireTime] = useState<number | null>(null); // timestamp (ms)
    const [method, setMethod] = useState<"email" | "phone" | null>(null);

    // Lưu vào localStorage
    useEffect(() => {
        if (step === "verify-otp" && otpExpireTime && userId) {
            localStorage.setItem("authStep", step);
            localStorage.setItem("authUserId", userId);
            localStorage.setItem("otpExpireTime", otpExpireTime.toString());
        } else {
            localStorage.removeItem("authStep");
            localStorage.removeItem("authUserId");
            localStorage.removeItem("otpExpireTime");
        }
    }, [step, otpExpireTime, userId]);

    // Khôi phục nếu reload
    useEffect(() => {
        if (open) {
            const savedStep = localStorage.getItem("authStep") as Step | null;
            const savedUserId = localStorage.getItem("authUserId");
            const savedOtpExpire = localStorage.getItem("otpExpireTime");

            if (savedStep === "verify-otp" && savedUserId && savedOtpExpire) {
                const remainingTime = parseInt(savedOtpExpire) - Date.now();
                if (remainingTime > 0) {
                    setUserId(savedUserId);
                    setOtpExpireTime(parseInt(savedOtpExpire));
                    setStep("verify-otp");
                } else {
                    localStorage.removeItem("authStep");
                    localStorage.removeItem("authUserId");
                    localStorage.removeItem("otpExpireTime");
                }
            } else {
                setStep("login");
            }
        }
    }, [open]);

    // Handlers
    const handleRegisterSuccess = (
        user: { id: string },
        expireTime: number
    ) => {
        setUserId(user.id);
        setOtpExpireTime(expireTime);
        setStep("verify-method");
    };

    const handleMethodSelected = async (method: "email" | "phone") => {
        if (!userId) return;
        setMethod(method);
        try {
            await API.post("/otp/send", {
                method,
                user_id: userId,
            });
            const expire = Date.now() + 2 * 60 * 1000; // 2 phút
            setOtpExpireTime(expire);
            setStep("verify-otp");

            toast.success(
                method == "email"
                    ? "Vui lòng kiểm tra email của bạn để nhận mã OTP."
                    : "Vui lòng kiểm tra điện thoại của bạn để nhận mã OTP."
            );
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                "Gửi mã OTP thất bại, vui lòng thử lại.";
            toast.error(msg);
        }
    };

    const handleOtpVerified = () => {
        localStorage.removeItem("authStep");
        localStorage.removeItem("authUserId");
        localStorage.removeItem("otpExpireTime");
        setUserId(null);
        setStep("success");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[600px]">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl mb-8 font-extrabold text-[#020085]">
                        {step === "login"
                            ? "Đăng nhập"
                            : step === "register"
                            ? "Đăng ký"
                            : step === "forgot-password"
                            ? "Quên mật khẩu"
                            : step === "reset-password"
                            ? "Đặt lại mật khẩu"
                            : step === "verify-method"
                            ? "Chọn phương thức xác thực"
                            : step === "success"
                            ? "Thành công"
                            : "Xác thực OTP"}
                    </DialogTitle>
                </DialogHeader>

                {step === "login" && (
                    <LoginForm
                        onSwitch={() => setStep("register")}
                        onLoginVerifiedSuccess={(_user) => {
                            onOpenChange(false);
                        }}
                        onNeedVerify={(userId) => {
                            setUserId(userId);
                            setStep("verify-method");
                        }}
                        onForgotPassword={() => setStep("forgot-password")}
                    />
                )}
                {step === "register" && (
                    <RegisterForm
                        onSwitch={() => setStep("login")}
                        onSuccess={handleRegisterSuccess}
                    />
                )}
                {step === "forgot-password" && (
                    <ForgotPasswordForm
                        onBack={() => setStep("login")}
                        onOtpSent={(email) => {
                            console.log(
                                "AuthDialog: onOtpSent called with email:",
                                email
                            );
                            setUserEmail(email);
                            setStep("reset-password");
                        }}
                    />
                )}
                {step === "reset-password" && (
                    <ResetPasswordForm
                        email={userEmail}
                        onBack={() => setStep("forgot-password")}
                        onSuccess={() => {
                            toast.success(
                                "Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại."
                            );
                            setStep("login");
                        }}
                        onResendOtp={() => {
                            setStep("forgot-password");
                        }}
                    />
                )}
                {step === "verify-method" && (
                    <MethodSelect onSelect={handleMethodSelected} />
                )}
                {step === "verify-otp" &&
                    otpExpireTime &&
                    userId &&
                    method !== null && (
                        <OtpVerification
                            method={method}
                            userId={userId}
                            expireTime={otpExpireTime}
                            onVerified={handleOtpVerified}
                        />
                    )}
                {step === "success" && (
                    <div className="text-center space-y-4 py-6">
                        <p className="text-xl font-semibold text-green-600">
                            Đăng ký thành công!
                        </p>
                        <div className="flex justify-center my-5">
                            <DotLottieReact
                                src="https://lottie.host/c2b7dd91-b54d-4f96-b612-0ed20ceb710a/adFhGPJj5J.lottie"
                                autoplay
                                className="w-[300px]"
                            />
                        </div>
                        <p>Bạn có thể sử dụng tài khoản để đăng nhập.</p>
                        <Button
                            onClick={() => {
                                setStep("login");
                            }}
                            className="bg-emerald-700 text-[#fff] py-5 px-10 cursor-pointer"
                        >
                            OK
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
