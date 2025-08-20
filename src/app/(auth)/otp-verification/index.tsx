"use client";

import { useEffect, useRef, useState } from "react";
import OTPInput from "react-otp-input";
import { Button } from "@/components/ui/button";
import styles from "./styles.module.css";
import { API } from "@/lib/api";
import { toast } from "sonner";

interface ErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

type Props = {
    userId: string;
    expireTime: number;
    method: "email" | "phone";
    onVerified: () => void;
};

export default function OtpVerification({
    userId,
    expireTime,
    onVerified,
    method,
}: Props) {
    const [timeLeft, setTimeLeft] = useState(
        Math.max(0, Math.floor((expireTime - Date.now()) / 1000))
    );
    const [resendCooldown, setResendCooldown] = useState(0);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => Math.max(prev - 1, 0));
            setResendCooldown((prev) => Math.max(prev - 1, 0));
        }, 1000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleVerifyOtp = async (value: string) => {
        setLoading(true);
        try {
            await API.post("/otp/verify", {
                user_id: userId,
                method,
                code: value,
            });

            toast.success("Xác thực thành công!");
            onVerified();
        } catch (error: ErrorResponse) {
            const msg =
                error?.response?.data?.message ||
                "Mã OTP không hợp lệ hoặc đã hết hạn.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;

        setResending(true);
        try {
            await API.post("/otp/send", {
                user_id: userId,
                method,
            });

            const newExpire = Date.now() + 2 * 60 * 1000;
            localStorage.setItem("otpExpireTime", newExpire.toString());
            setTimeLeft(120);
            setResendCooldown(60);
            setOtp("");

            toast.success("Mã OTP mới đã được gửi!");
        } catch (err) {
            console.error("Resend OTP failed:", err);
            toast.error("Gửi lại OTP thất bại.");
        } finally {
            setResending(false);
        }
    };

    const formatTime = (s: number) =>
        `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div className="space-y-4 text-center">
            <p className="text-muted-foreground text-sm">
                Nhập mã xác thực đã gửi đến bạn (
                {method === "email" ? "email" : "số điện thoại"}).
            </p>

            <div className="flex justify-center mt-4">
                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    inputType="tel"
                    shouldAutoFocus
                    containerStyle="flex gap-2 justify-center"
                    renderInput={(props) => (
                        <input
                            {...props}
                            className={styles.inputOTP}
                            maxLength={1}
                        />
                    )}
                />
            </div>

            <p className="text-sm text-muted-foreground">
                Mã sẽ hết hạn sau{" "}
                <strong className="text-blue-800">
                    {formatTime(timeLeft)}
                </strong>
            </p>

            <Button
                onClick={() => handleVerifyOtp(otp)}
                disabled={otp.length !== 6 || loading}
                className="w-full text-[#fff] bg-cyan-500 cursor-pointer py-5"
            >
                {loading ? "Đang xác thực..." : "Xác thực"}
            </Button>

            <Button
                variant="ghost"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resending}
                className="w-full text-[#fff] bg-gray-600 cursor-pointer py-5"
            >
                {resending
                    ? "Đang gửi lại..."
                    : resendCooldown > 0
                    ? `Gửi lại mã sau ${resendCooldown}s`
                    : "Gửi lại mã"}
            </Button>
        </div>
    );
}
