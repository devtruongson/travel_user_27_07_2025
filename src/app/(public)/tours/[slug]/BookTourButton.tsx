"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";

export default function BookTourButton({
    slug,
    isCustom,
    data,
}: {
    slug?: string;
    isCustom?: boolean;
    data?: {
        destination: number;
        vehicle: string;
        duration?: string;
    };
}) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                className="bg-[#00b0e1] text-[20px] font-[500] text-[#fff] p-6 mt-4 cursor-pointer hover:opacity-[0.6]"
            >
                Đặt ngay
            </Button>
            <BookingModal
                slug={slug}
                open={open}
                onClose={() => setOpen(false)}
                isCustom={isCustom}
                data={data}
            />
        </>
    );
}
