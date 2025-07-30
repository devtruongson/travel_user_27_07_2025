"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";
import { Button } from "@/components/ui/button";

export default function BookTourButton({ slug }: { slug: string }) {
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
            />
        </>
    );
}
