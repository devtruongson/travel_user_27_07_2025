"use client";

import { useEffect, useState } from "react";
import TourDepartureCalendar from "@/components/TourDepartureCalendar";

interface TourDepartureWrapperProps {
    tourId: number;
}

export default function TourDepartureWrapper({ tourId }: TourDepartureWrapperProps) {
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoDiscount, setPromoDiscount] = useState<{
        value: number;
        type: string;
    }>({
        type: "amount",
        value: 0,
    });

    useEffect(() => {
        // Lắng nghe sự kiện áp dụng mã giảm giá
        const handlePromoCode = (event: CustomEvent) => {
            const { promoCode: code, tourId: eventTourId, discount, discountData } = event.detail;
            
            if (eventTourId === tourId) {
                setPromoCode(code);
                // Sử dụng discount_amount từ API (số tiền giảm thực tế)
                setPromoDiscount({
                    type: discountData.discount_type,
                    value: discountData.discount_value
                });
                console.log(`Áp dụng mã giảm giá: ${code} cho tour: ${tourId}, giảm: ${discount} VNĐ`);
                
                // Log thông tin chi tiết nếu có
                if (discountData) {
                    console.log('Thông tin mã giảm giá:', discountData);
                }
            }
        };

        // Lắng nghe sự kiện xóa mã giảm giá
        const handleRemovePromoCode = (event: CustomEvent) => {
            const { tourId: eventTourId } = event.detail;
            
            if (eventTourId === tourId) {
                setPromoCode("");
                setPromoDiscount({
                    type: "amount",
                    value: 0,
                });
                console.log(`Xóa mã giảm giá cho tour: ${tourId}`);
            }
        };

        // Thêm event listeners
        window.addEventListener('applyPromoCode', handlePromoCode as EventListener);
        window.addEventListener('removePromoCode', handleRemovePromoCode as EventListener);

        // Cleanup
        return () => {
            window.removeEventListener('applyPromoCode', handlePromoCode as EventListener);
            window.removeEventListener('removePromoCode', handleRemovePromoCode as EventListener);
        };
    }, [tourId]);

    const handleSelectDeparture = (departure: any) => {
        console.log('Selected departure:', departure);
        
        // Gửi event để PromoCodeSection biết departure đã được chọn
        if (departure?.price) {
            const event = new CustomEvent('departureSelected', {
                detail: { 
                    tourId: tourId,
                    departurePrice: departure.price
                }
            });
            window.dispatchEvent(event);
            console.log('🚀 Sent departureSelected event with price:', departure.price);
        }
    };

    console.log('🚀 Promo code:', promoCode);
    console.log('🚀 Promo discount:', promoDiscount);

    return (
        <div>
            {/* Hiển thị thông tin mã giảm giá nếu có */}
            <TourDepartureCalendar 
                tourId={tourId}
                onSelectDeparture={handleSelectDeparture}
                promoCode={promoCode}
                promoDiscount={promoDiscount}
            />
        </div>
    );
}
