"use client";

import { useEffect, useState } from "react";
import TourDepartureCalendar from "@/components/TourDepartureCalendar";

interface TourDepartureWrapperProps {
    tourId: number;
}

export default function TourDepartureWrapper({ tourId }: TourDepartureWrapperProps) {
    const [promoCode, setPromoCode] = useState<string>("");
    const [promoDiscount, setPromoDiscount] = useState<number>(0);

    useEffect(() => {
        // Lắng nghe sự kiện áp dụng mã giảm giá
        const handlePromoCode = (event: CustomEvent) => {
            const { promoCode: code, tourId: eventTourId, discount, discountData } = event.detail;
            
            // Kiểm tra xem mã giảm giá có phù hợp với tour hiện tại không
            if (eventTourId === tourId) {
                setPromoCode(code);
                // Sử dụng discount_amount từ API (số tiền giảm thực tế)
                setPromoDiscount(discount || 0);
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
                setPromoDiscount(0);
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
        // Có thể thêm logic xử lý khi chọn departure
    };

    return (
        <div>
            {/* Hiển thị thông tin mã giảm giá nếu có */}
            {promoCode && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600 text-lg">🎉</span>
                            <span className="text-green-800 font-semibold">
                                Mã giảm giá: {promoCode}
                            </span>
                        </div>
                        <div className="text-right">
                            <div className="text-green-600 font-bold text-lg">
                                -{promoDiscount} VNĐ
                            </div>
                            <div className="text-green-600 text-sm">
                                Đã áp dụng
                            </div>
                            {/* Hiển thị cảnh báo về giới hạn giá */}
                            <div className="text-yellow-600 text-xs mt-1">
                                ⚠️ Giá tối thiểu: 10,000 VNĐ
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <TourDepartureCalendar 
                tourId={tourId}
                onSelectDeparture={handleSelectDeparture}
                promoCode={promoCode}
                promoDiscount={promoDiscount}
            />
        </div>
    );
}
