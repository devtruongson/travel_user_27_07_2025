"use client";

import { useState } from "react";
import ForgotPasswordForm from "./forgot-password";
import ResetPasswordForm from "./reset-password";
import { Button } from "@/components/ui/button";

export default function TestForgotPassword() {
    const [step, setStep] = useState<"forgot" | "reset">("forgot");
    const [userId, setUserId] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Test Forgot Password</h1>
                <p>Current step: {step}</p>
            </div>

            {step === "forgot" && (
                <ForgotPasswordForm
                    onBack={() => console.log("Back clicked")}
                    onOtpSent={(id, userEmail) => {
                        console.log("OTP Sent", { id, userEmail });
                        setUserId(id);
                        setEmail(userEmail);
                        setStep("reset");
                    }}
                />
            )}

            {step === "reset" && userId && email && (
                <ResetPasswordForm
                    userId={userId}
                    email={email}
                    onBack={() => setStep("forgot")}
                    onSuccess={() => {
                        console.log("Reset success!");
                        alert("Password reset successful!");
                    }}
                    onResendOtp={() => {
                        console.log("Resend OTP");
                        setStep("forgot");
                    }}
                />
            )}

            <div className="mt-4 flex gap-2">
                <Button onClick={() => setStep("forgot")} variant="outline">
                    Test Forgot
                </Button>
                <Button
                    onClick={() => {
                        setUserId("123");
                        setEmail("test@example.com");
                        setStep("reset");
                    }}
                    variant="outline"
                >
                    Test Reset
                </Button>
            </div>
        </div>
    );
}
