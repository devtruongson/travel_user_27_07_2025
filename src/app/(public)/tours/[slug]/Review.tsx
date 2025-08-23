"use client";
import { PUBLIC_API } from "@/lib/api";
import { RootState } from "@/lib/redux/store";
import { ReviewType } from "@/types/review";
import { pl } from "date-fns/locale";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

type Props = {
    tour_id?: number;
};

const TourReviewUI = ({ tour_id }: Props) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [reviews, setReviews] = useState<ReviewType[]>([]);
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: "",
    });
    const [showReviewForm, setShowReviewForm] = useState(false);
    // Thêm state kiểm tra người dùng đã đặt tour chưa
    const [hasBookedTour, setHasBookedTour] = useState(false);
    const [checkingBooking, setCheckingBooking] = useState(false);

    const StarRating = ({
        rating,
        size = 5,
        interactive = false,
        onRatingChange,
    }: {
        rating: number;
        size?: number;
        interactive?: boolean;
        onRatingChange?: (star: number) => void;
    }) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`text-2xl ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                        } ${
                            interactive
                                ? "cursor-pointer hover:text-yellow-400"
                                : ""
                        }`}
                        onClick={
                            interactive && onRatingChange
                                ? () => onRatingChange(star)
                                : undefined
                        }
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    const calculateAverageRating = () => {
        if (!reviews?.length) return "0";
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (total / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        if (reviews?.length) {
            reviews.forEach((review) => {
                distribution[review.rating - 1]++;
            });
        }
        return distribution.reverse();
    };

    // Thêm hàm kiểm tra xem người dùng đã đặt tour chưa
    const checkUserHasBookedTour = useCallback(async () => {
        if (!user?.id || !tour_id) return;

        setCheckingBooking(true);
        try {
            const res = await PUBLIC_API.get(
                `/bookings/check-user-tour/${user.id}/${tour_id}`
            );
            setHasBookedTour(res?.data?.hasBooked || false);
        } catch (error) {
            console.error("Error checking booking history:", error);
            setHasBookedTour(false);
        } finally {
            setCheckingBooking(false);
        }
    }, [user?.id, tour_id]);

    const handleSubmitReview = useCallback(async () => {
        if (!user?.id) {
            toast.error("Vui lòng đăng nhập để đánh giá");
            return;
        }

        if (!hasBookedTour) {
            toast.error("Bạn cần đặt tour này trước khi đánh giá");
            return;
        }

        if (!newReview.rating || !newReview.comment) {
            toast.error("Vui lòng điền đủ thông tin");
            return;
        }

        try {
            const review = {
                user_id: user?.id,
                tour_id: tour_id || 0,
                rating: newReview.rating,
                comment: newReview.comment,
            };
            const res = await PUBLIC_API.post("/reviews", review);
            if (res?.data?.success) {
                setReviews([res.data?.data, ...reviews]);
                toast.success("Đánh giá của bạn đã được gửi thành công");
            }
            setNewReview({ ...newReview, rating: 5, comment: "" });
            setShowReviewForm(false);
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error("Có lỗi xảy ra khi gửi đánh giá");
        }
    }, [newReview, reviews, tour_id, user?.id, hasBookedTour]);

    useEffect(() => {
        if (tour_id) {
            const fetchReviews = async () => {
                try {
                    const res = await PUBLIC_API.get(
                        `/reviews/tour/${tour_id}`
                    );
                    setReviews(res?.data?.data?.data || []);
                } catch (error) {
                    console.error("Error fetching reviews:", error);
                    setReviews([]);
                }
            };

            fetchReviews();
        }
    }, [tour_id]);

    // Thêm useEffect để kiểm tra booking khi user hoặc tour_id thay đổi
    useEffect(() => {
        checkUserHasBookedTour();
    }, [checkUserHasBookedTour]);

    return (
        <div className="w-full bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Đánh giá Tour du lịch
                </h1>

                {/* Rating Overview */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-500">
                                {calculateAverageRating()}
                            </div>
                            <StarRating
                                rating={Math.round(
                                    parseFloat(calculateAverageRating())
                                )}
                            />
                            <div className="text-sm text-gray-600 mt-1">
                                {reviews.length} đánh giá
                            </div>
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="space-y-2">
                        {getRatingDistribution().map((count, index) => (
                            <div
                                key={index}
                                className="flex items-center space-x-2 text-sm"
                            >
                                <span className="w-8">{5 - index} ⭐</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-yellow-400 h-2 rounded-full"
                                        style={{
                                            width: `${
                                                reviews.length
                                                    ? (count / reviews.length) *
                                                      100
                                                    : 0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="w-8 text-gray-600">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Write Review Button - Chỉ hiển thị nếu user đã book tour */}
                {user?.id ? (
                    checkingBooking ? (
                        <div className="mt-4 italic text-gray-500">
                            Đang kiểm tra thông tin...
                        </div>
                    ) : hasBookedTour ? (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                            Viết đánh giá
                        </button>
                    ) : (
                        <div className="mt-4 text-amber-600">
                            Bạn cần đặt tour này trước khi có thể đánh giá
                        </div>
                    )
                ) : (
                    <div className="mt-4 text-amber-600">
                        Vui lòng đăng nhập để đánh giá tour
                    </div>
                )}
            </div>

            {/* Review Form */}
            {showReviewForm && hasBookedTour && (
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Viết đánh giá của bạn
                    </h2>
                    <div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đánh giá của bạn
                                </label>
                                <StarRating
                                    rating={newReview.rating}
                                    interactive={true}
                                    onRatingChange={(rating) =>
                                        setNewReview({ ...newReview, rating })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nội dung đánh giá
                                </label>
                                <textarea
                                    value={newReview.comment}
                                    onChange={(e) =>
                                        setNewReview({
                                            ...newReview,
                                            comment: e.target.value,
                                        })
                                    }
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Chia sẻ chi tiết về trải nghiệm tour của bạn..."
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleSubmitReview}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                                >
                                    Gửi đánh giá
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowReviewForm(false)}
                                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews?.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-white rounded-lg shadow-sm p-6"
                        >
                            <div className="flex items-start space-x-4">
                                {review?.user?.avatar ? (
                                    <Image
                                        width={40}
                                        height={40}
                                        src={
                                            review?.user?.avatar.startsWith(
                                                "http"
                                            )
                                                ? review?.user?.avatar
                                                : `${
                                                      process.env
                                                          .NEXT_PUBLIC_IMAGE_DOMAIN ||
                                                      ""
                                                  }/${review?.user?.avatar}`
                                        }
                                        alt="avatar"
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-semibold">
                                            {review?.user?.full_name?.charAt(
                                                0
                                            ) || "?"}
                                        </span>
                                    </div>
                                )}

                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-medium text-gray-900">
                                                {review?.user?.full_name}
                                            </span>
                                            {/* Thêm badge xác nhận người dùng đã trải nghiệm tour */}
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                                Đã trải nghiệm tour
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                                            <span>📅</span>
                                            <span>
                                                {new Date(
                                                    review.created_at
                                                ).toLocaleDateString("vi-VN")}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mb-2">
                                        <StarRating rating={review.rating} />
                                    </div>

                                    <p className="text-gray-700 mb-4">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-4xl">📝</span>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Chưa có đánh giá nào
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Hãy là người đầu tiên chia sẻ trải nghiệm của bạn về
                            tour này
                        </p>
                        {user?.id ? (
                            hasBookedTour ? (
                                <button
                                    onClick={() => setShowReviewForm(true)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
                                >
                                    <span>✍️</span>
                                    <span>Viết đánh giá đầu tiên</span>
                                </button>
                            ) : (
                                <div className="text-amber-600">
                                    Bạn cần đặt tour này trước khi có thể đánh
                                    giá
                                </div>
                            )
                        ) : (
                            <div className="text-amber-600">
                                Vui lòng đăng nhập để đánh giá tour
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TourReviewUI;
