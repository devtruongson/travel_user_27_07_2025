"use client";

import { useState, useEffect } from "react";
import { API } from "@/lib/api";
import { toast } from "sonner";

interface PromoCodeSectionProps {
    tourId: number;
}

interface PromoCodeValidation {
    success: boolean;
    message: string;
    data?: {
        promotion: any; // Promotion object từ API
        discount_amount: number; // Số tiền giảm
        final_amount: number; // Số tiền cuối cùng
    };
}

export default function PromoCodeSection({ tourId }: PromoCodeSectionProps) {
    const [promoCode, setPromoCode] = useState("");
    const [isApplied, setIsApplied] = useState(false);
    const [appliedCode, setAppliedCode] = useState("");
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tourInfo, setTourInfo] = useState<any>(null);

    // Fetch tour info để lấy price
    useEffect(() => {
        if (tourId) {
            fetchTourInfo();
        }
    }, [tourId]);

    const fetchTourInfo = async () => {
        try {
            const response = await API.get(`/tours/${tourId}`);
            if (response.data.success) {
                setTourInfo(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching tour info:', error);
        }
    };

    // Lắng nghe event removePromoCode từ TourDepartureWrapper
    useEffect(() => {
        const handleRemovePromoCode = (event: CustomEvent) => {
            const { tourId: eventTourId } = event.detail;
            
            if (eventTourId === tourId) {
                setIsApplied(false);
                setAppliedCode("");
                setAppliedDiscount(0);
            }
        };

        const handleApplyPromoCode = (event: CustomEvent) => {
            const { promoCode: code, tourId: eventTourId, discount } = event.detail;
            
            if (eventTourId === tourId) {
                setIsApplied(true);
                setAppliedCode(code);
                setAppliedDiscount(discount || 0);
            }
        };

        window.addEventListener('removePromoCode', handleRemovePromoCode as EventListener);
        window.addEventListener('applyPromoCode', handleApplyPromoCode as EventListener);

        return () => {
            window.removeEventListener('removePromoCode', handleRemovePromoCode as EventListener);
            window.removeEventListener('applyPromoCode', handleApplyPromoCode as EventListener);
        };
    }, [tourId]);

    const validatePromoCode = async (code: string) => {
        setLoading(true);
        setError("");
        
        try {
            // Tính order_total từ tour price (sử dụng giá cơ bản của tour)
            let orderTotal = 0;
            if (tourInfo?.price) {
                // Sử dụng giá cơ bản của tour làm order_total
                orderTotal = tourInfo.price;
            } else {
                // Fallback: sử dụng giá mặc định nếu không có thông tin
                orderTotal = 1000000; // 1 triệu VNĐ mặc định
            }
            
            const response = await API.post('/promotions/validate', {
                code: code, // Sử dụng 'code' thay vì 'promo_code'
                order_total: orderTotal // Sử dụng 'order_total' thay vì 'tour_id'
            });
            
            const result: PromoCodeValidation = response.data;
            
            if (result.success && result.data) {
                // Mã giảm giá hợp lệ
                const discountInfo = result.data;
                
                // Gửi mã giảm giá đến TourDepartureWrapper
                const event = new CustomEvent('applyPromoCode', {
                    detail: { 
                        promoCode: code, 
                        tourId: tourId,
                        discount: discountInfo.discount_amount,
                        discountData: discountInfo
                    }
                });
                window.dispatchEvent(event);
                
                // Cập nhật state
                setIsApplied(true);
                setAppliedCode(code);
                setAppliedDiscount(discountInfo.discount_amount);
                setPromoCode("");
                
                // Thông báo thành công
                const discountMessage = `✅ Mã giảm giá hợp lệ!\nGiảm ${discountInfo.discount_amount.toLocaleString('vi-VN')} VNĐ`;
                
                // Kiểm tra nếu giá cuối cùng quá thấp
                if (discountInfo.final_amount < 10000) {
                    toast.success(`${discountMessage}\n⚠️ Lưu ý: Giá cuối cùng đã được điều chỉnh lên 10,000 VNĐ để đảm bảo tính hợp lệ của đơn hàng.`);
                } else {
                    toast.success(discountMessage);
                }
                
            } else {
                // Mã giảm giá không hợp lệ
                setError(result.message || 'Mã giảm giá không hợp lệ');
                toast.error(`❌ ${result.message || 'Mã giảm giá không hợp lệ'}`);
            }
            
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra mã giảm giá';
            setError(errorMessage);
            toast.error(`❌ ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromoCode = () => {
        const code = promoCode.trim();
        if (!code) {
            setError('Vui lòng nhập mã giảm giá');
            return;
        }

        validatePromoCode(code);
    };

    const handleRemovePromoCode = () => {
        // Gửi event để xóa mã giảm giá
        const event = new CustomEvent('removePromoCode', {
            detail: { tourId: tourId }
        });
        window.dispatchEvent(event);
        
        setIsApplied(false);
        setAppliedCode("");
        setAppliedDiscount(0);
        setError("");
        toast.success('Đã xóa mã giảm giá');
    };

    return (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                🎁 Mã giảm giá
            </h4>
            
            {!isApplied ? (
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
                            value={promoCode}
                            onChange={(e) => {
                                setPromoCode(e.target.value);
                                setError(""); // Clear error when typing
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleApplyPromoCode()}
                        />
                        <button
                            onClick={handleApplyPromoCode}
                            disabled={loading}
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Đang kiểm tra...</span>
                                </div>
                            ) : (
                                'Áp dụng'
                            )}
                        </button>
                    </div>
                    
                    {/* Error message */}
                    {error && (
                        <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-3">
                            ❌ {error}
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <div className="bg-green-100 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-green-600 text-lg">🎉</span>
                            <span className="text-green-800 font-semibold">
                                Mã giảm giá đã được áp dụng!
                            </span>
                        </div>
                        <p className="text-green-600 text-sm">
                            Mã: <strong>{appliedCode}</strong> - Giảm {appliedDiscount.toLocaleString('vi-VN')} VNĐ
                        </p>
                        {/* Hiển thị cảnh báo nếu giá cuối cùng quá thấp */}
                        {tourInfo?.price && (tourInfo.price - appliedDiscount) < 10000 && (
                            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-yellow-700 text-xs">
                                    ⚠️ Giá cuối cùng đã được điều chỉnh lên 10,000 VNĐ
                                </p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleRemovePromoCode}
                        className="px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                        Xóa mã giảm giá
                    </button>
                </div>
            )}
            
            <p className="text-sm text-gray-600 text-center mt-3">
                💡 Nhập mã giảm giá để được ưu đãi đặc biệt
            </p>
        </div>
    );
}
