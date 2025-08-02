"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function BookTourButton({
    slug,
    isCustom,
    data,
}: {
    slug?: string;
    isCustom?: boolean;
    data?: {
        destination_id: number;
        vehicle: string;
        duration?: string;
        note?: string;
    };
}) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (!isCustom) {
            setOpen(true);
        } else {
            if (!data?.destination_id || !data.vehicle || !data?.duration) {
                toast.warning("Vui lòng điền đầy đủ thông tin");
            } else {
                setOpen(true);
            }
        }
    };

    return (
        <>
            <Button
                onClick={handleClick}
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
