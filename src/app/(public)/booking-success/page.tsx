"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// Type definitions
interface StatusConfig {
    icon: React.ComponentType<{ className?: string }>;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    title: string;
    titleColor: string;
    messageColor: string;
}

// Icon components
const CheckCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5.707 8.707a1 1 0 00-1.414-1.414L11 14.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l6-6z"
            clipRule="evenodd"
        />
    </svg>
);

const XCircleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.536 5.464a1 1 0 00-1.414 0L12 9.586 9.878 7.464a1 1 0 10-1.414 1.414L10.586 11l-2.122 2.122a1 1 0 101.414 1.414L12 12.414l2.122 2.122a1 1 0 001.414-1.414L13.414 11l2.122-2.122a1 1 0 000-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

const ExclamationTriangleIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
        />
    </svg>
);

// Main component
function BookingSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Get parameters from URL
    const status = searchParams.get("status");
    const message = searchParams.get("message");
    const bookingId = searchParams.get("booking_id");
    const transactionNo = searchParams.get("transaction_no");
    const amount = searchParams.get("amount");
    const paymentDate = searchParams.get("payment_date");
    const tourName = searchParams.get("tour_name");
    const customerName = searchParams.get("customer_name");
    const responseCode = searchParams.get("response_code");
    const transactionStatus = searchParams.get("transaction_status");

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Format amount
    const formatAmount = (amount: string | null): string => {
        if (!amount) return "0";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(Number(amount));
    };

    // Format date
    const formatDate = (dateString: string | null): string => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }).format(date);
        } catch (error) {
            return dateString;
        }
    };

    // Get status configuration
    const getStatusConfig = (): StatusConfig => {
        switch (status) {
            case "success":
                return {
                    icon: CheckCircleIcon,
                    iconColor: "text-green-500",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    title: "Thanh toán thành công!",
                    titleColor: "text-green-800",
                    messageColor: "text-green-600",
                };
            case "failed":
                return {
                    icon: XCircleIcon,
                    iconColor: "text-red-500",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    title: "Thanh toán thất bại!",
                    titleColor: "text-red-800",
                    messageColor: "text-red-600",
                };
            case "error":
                return {
                    icon: ExclamationTriangleIcon,
                    iconColor: "text-yellow-500",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    title: "Có lỗi xảy ra!",
                    titleColor: "text-yellow-800",
                    messageColor: "text-yellow-600",
                };
            case "invalid_signature":
                return {
                    icon: ExclamationTriangleIcon,
                    iconColor: "text-red-500",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    title: "Lỗi bảo mật!",
                    titleColor: "text-red-800",
                    messageColor: "text-red-600",
                };
            default:
                return {
                    icon: ExclamationTriangleIcon,
                    iconColor: "text-gray-500",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    title: "Trạng thái không xác định",
                    titleColor: "text-gray-800",
                    messageColor: "text-gray-600",
                };
        }
    };

    const statusConfig = getStatusConfig();
    const StatusIcon = statusConfig.icon;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang xử lý...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8 pt-[100px]">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Kết quả thanh toán
                    </h1>
                    <p className="text-gray-600">
                        Thông tin chi tiết về giao dịch của bạn
                    </p>
                </div>

                {/* Main Card */}
                <div
                    className={`bg-white rounded-2xl shadow-xl overflow-hidden ${statusConfig.borderColor} border-2`}
                >
                    {/* Status Header */}
                    <div
                        className={`${statusConfig.bgColor} px-6 py-8 text-center`}
                    >
                        <StatusIcon
                            className={`w-16 h-16 ${statusConfig.iconColor} mx-auto mb-4`}
                        />
                        <h2
                            className={`text-2xl font-bold ${statusConfig.titleColor} mb-2`}
                        >
                            {statusConfig.title}
                        </h2>
                        {message && (
                            <p
                                className={`text-lg ${statusConfig.messageColor}`}
                            >
                                {decodeURIComponent(message)}
                            </p>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="px-6 py-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Booking Information */}
                            {bookingId && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thông tin đặt tour
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">
                                                Mã đặt tour:
                                            </span>
                                            <span className="font-semibold text-gray-900">
                                                #{bookingId}
                                            </span>
                                        </div>
                                        {tourName && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Tên tour:
                                                </span>
                                                <span className="font-semibold text-gray-900 text-right ml-2">
                                                    {decodeURIComponent(
                                                        tourName
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                        {customerName && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Khách hàng:
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {decodeURIComponent(
                                                        customerName
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Payment Information */}
                            {(transactionNo || amount || paymentDate) && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-3">
                                        Thông tin thanh toán
                                    </h3>
                                    <div className="space-y-2">
                                        {transactionNo && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Mã giao dịch:
                                                </span>
                                                <span className="font-semibold text-gray-900">
                                                    {transactionNo}
                                                </span>
                                            </div>
                                        )}
                                        {amount && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Số tiền:
                                                </span>
                                                <span className="font-bold text-green-600 text-lg">
                                                    {formatAmount(amount)}
                                                </span>
                                            </div>
                                        )}
                                        {paymentDate && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Thời gian:
                                                </span>
                                                <span className="font-semibold text-gray-900 text-right ml-2">
                                                    {formatDate(paymentDate)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Error Information */}
                            {(responseCode || transactionStatus) &&
                                status === "failed" && (
                                    <div className="bg-red-50 rounded-lg p-4 md:col-span-2">
                                        <h3 className="font-semibold text-red-800 mb-3">
                                            Thông tin lỗi
                                        </h3>
                                        <div className="space-y-2">
                                            {responseCode && (
                                                <div className="flex justify-between">
                                                    <span className="text-red-600">
                                                        Mã lỗi:
                                                    </span>
                                                    <span className="font-semibold text-red-800">
                                                        {responseCode}
                                                    </span>
                                                </div>
                                            )}
                                            {transactionStatus && (
                                                <div className="flex justify-between">
                                                    <span className="text-red-600">
                                                        Trạng thái giao dịch:
                                                    </span>
                                                    <span className="font-semibold text-red-800">
                                                        {transactionStatus}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 justify-center">
                        {status === "success" && (
                            <>
                                <button
                                    onClick={() => router.push("/myorder")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Xem đặt tour của tôi
                                </button>
                                <button
                                    onClick={() => router.push("/")}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        />
                                    </svg>
                                    Tiếp tục khám phá
                                </button>
                            </>
                        )}

                        {(status === "failed" ||
                            status === "error" ||
                            status === "invalid_signature") && (
                            <>
                                <button
                                    onClick={() => router.push("/tours")}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    Thử lại
                                </button>
                                <button
                                    onClick={() => router.push("/contact")}
                                    className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                                >
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    Liên hệ hỗ trợ
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => router.push("/")}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        >
                            <svg
                                className="w-5 h-5 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            Về trang chủ
                        </button>
                    </div>
                </div>

                {/* Additional Info */}
                {status === "success" && (
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-start">
                            <svg
                                className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">
                                    Lưu ý quan trọng
                                </h3>
                                <ul className="text-blue-700 space-y-1">
                                    <li>
                                        • Vui lòng lưu lại thông tin giao dịch
                                        để đối chiếu khi cần thiết
                                    </li>
                                    <li>
                                        • Chúng tôi sẽ gửi email xác nhận đến
                                        địa chỉ email đã đăng ký
                                    </li>
                                    <li>
                                        • Bạn có thể kiểm tra trạng thái đặt
                                        tour trong mục "Đặt tour của tôi"
                                    </li>
                                    <li>
                                        • Nếu có thắc mắc, vui lòng liên hệ
                                        hotline: 1900-xxxx
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Main page component with Suspense
export default function BookingSuccessPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Đang tải...</p>
                    </div>
                </div>
            }
        >
            <BookingSuccessContent />
        </Suspense>
    );
}
