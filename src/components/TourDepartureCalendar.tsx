"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, DollarSign, Users } from 'lucide-react';
import { PUBLIC_API } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface TourDeparture {
    departure_id: number;
    departure_date: string;
    price: number;
    max_capacity: number;
    booked_count: number;
    status: string;
    notes?: string;
}

interface AdditionalService {
    id: string;
    name: string;
    price: number;
    description: string;
    icon: string;
    type: string;
}

interface ServiceData {
    guides: any[];
    hotels: any[];
    busRoutes: any[];
    motorbikes: any[];
}

interface TourDepartureCalendarProps {
    tourId: number;
    onSelectDeparture: (departure: TourDeparture) => void;
    selectedDeparture?: TourDeparture | null;
}

const TourDepartureCalendar: React.FC<TourDepartureCalendarProps> = ({
    tourId,
    onSelectDeparture,
    selectedDeparture
}) => {
    const router = useRouter();
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [availableMonths, setAvailableMonths] = useState<string[]>([]);
    const [departures, setDepartures] = useState<TourDeparture[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [localSelectedDeparture, setLocalSelectedDeparture] = useState<TourDeparture | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    const [showBookingForm, setShowBookingForm] = useState(false);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [services, setServices] = useState<ServiceData>({
        guides: [],
        hotels: [],
        busRoutes: [],
        motorbikes: [],
    });
    const [servicesLoading, setServicesLoading] = useState(false);
    
    // Guest booking states
    const [isGuestBooking, setIsGuestBooking] = useState(false);
    const [guestInfo, setGuestInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Kiểm tra đăng nhập
    const checkAuth = () => {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            alert('❌ Vui lòng đăng nhập để đặt tour!');
            router.push('/login');
            return false;
        }
        
        // Kiểm tra token có hợp lệ không (có thể thêm logic kiểm tra JWT expiration)
        try {
            // Nếu token là JWT, có thể decode để kiểm tra expiration
            if (token.split('.').length === 3) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp && payload.exp * 1000 < Date.now()) {
                    // Token đã hết hạn
                    localStorage.removeItem('token');
                    sessionStorage.removeItem('token');
                    alert('❌ Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    router.push('/login');
                    return false;
                }
            }
        } catch (error) {
            console.error('Error checking token:', error);
            // Nếu có lỗi khi kiểm tra token, vẫn cho phép tiếp tục
        }
        
        return true;
    };

    // Fetch available months
    const fetchAvailableMonths = async () => {
        try {
            const response = await PUBLIC_API.get(`/tour-departures/${tourId}/months`);
            if (response.data.success) {
                const months = response.data.data || [];
                setAvailableMonths(months);
                
                // Tự động chuyển đến tháng đầu tiên có departure
                if (months.length > 0) {
                    const [firstMonth, firstYear] = months[0].split('/');
                    const monthNum = parseInt(firstMonth) - 1;
                    const yearNum = parseInt(firstYear);
                    setCurrentMonth(monthNum);
                    setCurrentYear(yearNum);
                }
            }
        } catch (error) {
            console.error('Error fetching available months:', error);
        } finally {
            setInitialLoading(false);
        }
    };

    // Fetch departures for current month
    const fetchDepartures = async () => {
        if (!tourId) return;
        
        setLoading(true);
        try {
            const response = await PUBLIC_API.get(`/tour-departures/tour/${tourId}`, {
                params: {
                    month: currentMonth + 1,
                    year: currentYear
                }
            });
            
            if (response.data.success) {
                const departuresData = response.data.data || [];
                console.log('Fetched departures:', departuresData);
                console.log('Current month/year:', currentMonth + 1, currentYear);
                setDepartures(departuresData);
            }
        } catch (error) {
            console.error('Error fetching departures:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableMonths();
        fetchServices();
    }, [tourId]);

    // Fetch services from API
    const fetchServices = async () => {
        setServicesLoading(true);
        try {
            const results = await Promise.allSettled([
                PUBLIC_API.get("/guides"),
                PUBLIC_API.get("/hotels"),
                PUBLIC_API.get("/bus-routes"),
                PUBLIC_API.get("/motorbikes"),
            ]);

            // Xử lý kết quả, đảm bảo dữ liệu luôn là mảng ngay cả khi có lỗi
            const guideRes = results[0].status === "fulfilled" ? results[0].value?.data || [] : [];
            const hotelRes = results[1].status === "fulfilled" ? results[1].value?.data || [] : [];
            const busRes = results[2].status === "fulfilled" ? results[2].value?.data || [] : [];
            const bikeRes = results[3].status === "fulfilled" ? results[3].value?.data || [] : [];

            setServices({
                guides: Array.isArray(guideRes) ? guideRes : [],
                hotels: Array.isArray(hotelRes) ? hotelRes : [],
                busRoutes: Array.isArray(busRes) ? busRes : [],
                motorbikes: Array.isArray(bikeRes) ? bikeRes : [],
            });
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setServicesLoading(false);
        }
    };

    useEffect(() => {
        fetchDepartures();
    }, [tourId, currentMonth, currentYear]);

    const navigateMonth = (direction: 'prev' | 'next') => {
        if (loading) return; // Prevent navigation while loading
        
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        } else {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        }
    };

    const generateCalendarDays = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const days = [];
        const totalDays = 42; // 6 weeks * 7 days
        
        for (let i = 0; i < totalDays; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            
            const isCurrentMonth = date.getMonth() === currentMonth;
            const isToday = date.toDateString() === new Date().toDateString();
            const dateString = date.toISOString().split('T')[0];
            
            // So sánh ngày với nhiều format khác nhau
            const departure = departures.find(d => {
                const apiDate = new Date(d.departure_date);
                const apiDateString = apiDate.toISOString().split('T')[0];
                const calendarDateString = date.toISOString().split('T')[0];
                
                console.log('Comparing dates:', {
                    apiDate: d.departure_date,
                    apiDateString,
                    calendarDateString,
                    matches: apiDateString === calendarDateString
                });
                
                return apiDateString === calendarDateString;
            });
            const isSelected = selectedDate === dateString;
            
            // Debug log cho ngày có departure
        if (departure) {
                console.log('Found departure for date:', dateString, departure);
            }
            
            days.push({
                date,
                dateString,
                isCurrentMonth,
                isToday,
                departure,
                isSelected
            });
        }
        
        return days;
    };

    const handleDateClick = (day: any) => {
        if (day.departure) {
            setSelectedDate(day.dateString);
            setLocalSelectedDeparture(day.departure);
            setQuantity(1); // Reset quantity khi chọn departure mới
            setSelectedServices([]); // Reset selected services
            setShowBookingForm(false); // Reset booking form
            setIsGuestBooking(false); // Reset guest booking mode
            onSelectDeparture(day.departure);
        }
    };

    const handleServiceToggle = (serviceId: string) => {
        setSelectedServices(prev => 
            prev.includes(serviceId) 
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    // Lấy thông tin chi tiết của dịch vụ từ API
    const getServiceDetails = (serviceType: string) => {
        switch (serviceType) {
            case 'guide':
                return services.guides.map(guide => ({
                    name: guide.name || 'Hướng dẫn viên',
                    price: guide.price_per_day || 0,
                    description: guide.description || 'Chuyên nghiệp, thông thạo địa phương'
                }));
            case 'hotel':
                return services.hotels.map(hotel => ({
                    name: hotel.name || 'Khách sạn',
                    price: hotel.price || 0,
                    description: hotel.description || 'Tiện nghi đầy đủ'
                }));
            case 'bus':
                return services.busRoutes.map(bus => ({
                    name: bus.route_name || 'Tuyến xe',
                    price: bus.price || 0,
                    description: bus.description || 'An toàn và thoải mái'
                }));
            case 'motorbike':
                return services.motorbikes.map(bike => ({
                    name: bike.bike_type || 'Xe máy',
                    price: bike.price_per_day || 0,
                    description: bike.description || 'Bảo hiểm đầy đủ'
                }));
            default:
                return [];
        }
    };

    const calculateTotalPrice = () => {
        if (!localSelectedDeparture) return 0;
        
        const basePrice = localSelectedDeparture.price * quantity;
        const servicesPrice = selectedServices.reduce((total, serviceId) => {
            const service = additionalServices.find(s => s.id === serviceId);
            return total + (service ? service.price : 0);
        }, 0);
        
        return basePrice + servicesPrice;
    };

    const handleBooking = async () => {
        if (!localSelectedDeparture) return;
        
        // Validation cơ bản
        if (quantity < 1) {
            alert('❌ Số người tham gia phải lớn hơn 0');
            return;
        }
        
        if (quantity > localSelectedDeparture.max_capacity - localSelectedDeparture.booked_count) {
            alert(`❌ Chỉ còn ${localSelectedDeparture.max_capacity - localSelectedDeparture.booked_count} chỗ trống cho ngày này`);
            return;
        }
        
        // Kiểm tra thông tin khách hàng nếu là guest booking
        if (isGuestBooking) {
            if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
                alert('❌ Vui lòng điền đầy đủ thông tin cá nhân!');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(guestInfo.email)) {
                alert('❌ Email không hợp lệ!');
                return;
            }
        } else {
            // Kiểm tra đăng nhập nếu không phải guest booking
            if (!checkAuth()) {
                return;
            }
        }
        
        setBookingLoading(true);
        try {
            // Chuẩn bị dữ liệu booking
            const bookingData: any = {
                tour_id: tourId,
                departure_id: localSelectedDeparture.departure_id,
                quantity: quantity,
                start_date: localSelectedDeparture.departure_date,
                total_price: calculateTotalPrice(),
                payment_method_id: "1", // VNPay
                status: "pending",
                // Dịch vụ bổ sung - lấy ID của dịch vụ được chọn
                guide_id: selectedServices.includes('guide') ? (() => {
                    const selectedGuide = services.guides.find(g => g.guide_id);
                    return selectedGuide?.guide_id || null;
                })() : null,
                hotel_id: selectedServices.includes('hotel') ? (() => {
                    const selectedHotel = services.hotels.find(h => h.hotel_id);
                    return selectedHotel?.hotel_id || null;
                })() : null,
                bus_route_id: selectedServices.includes('bus') ? (() => {
                    const selectedBus = services.busRoutes.find(b => b.bus_route_id);
                    return selectedBus?.bus_route_id || null;
                })() : null,
                motorbike_id: selectedServices.includes('motorbike') ? (() => {
                    const selectedBike = services.motorbikes.find(b => b.motorbike_id);
                    return selectedBike?.motorbike_id || null;
                })() : null,
            };
            
            // Thêm thông tin khách hàng nếu là guest booking
            if (isGuestBooking) {
                bookingData.guest_info = guestInfo;
            } else {
                // Thêm user_id nếu đã đăng nhập
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');
                if (token) {
                    try {
                        // Decode JWT để lấy user_id (giả sử token có payload user_id)
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        if (payload.user_id) {
                            bookingData.user_id = payload.user_id;
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                    }
                }
            }

            // Gọi API booking
            console.log('Sending booking data:', bookingData);
            const response = await PUBLIC_API.post("/bookings", bookingData);
            console.log('Booking response:', response.data);

            if (response.data.success || response.data.message) {
                // Success - show confirmation
                let successMessage = `🎉 Đặt tour thành công!\n\n📅 Ngày: ${new Date(localSelectedDeparture.departure_date).toLocaleDateString('vi-VN')}\n👥 Số người: ${quantity}\n💰 Tổng tiền: ${calculateTotalPrice().toLocaleString('vi-VN')} VNĐ\n🔧 Dịch vụ: ${selectedServices.length > 0 ? selectedServices.map(id => {
                    const service = additionalServices.find(s => s.id === id);
                    return service?.name;
                }).join(', ') : 'Không có'}\n\nChúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận chi tiết!`;
                
                // Thêm thông tin user mới tạo nếu có
                if (response.data.guest_user) {
                    successMessage += `\n\n✅ Tài khoản đã được tạo tự động:\n📧 Email: ${response.data.guest_user.email}\n🔐 Mật khẩu: Đã được gửi qua email\n\nBạn có thể sử dụng email này để đăng nhập sau!`;
                }
                
                alert(successMessage);

                // Reset form
                setShowBookingForm(false);
                setSelectedServices([]);
                setQuantity(1);
                setIsGuestBooking(false);
                setGuestInfo({ name: '', email: '', phone: '' });

                // Nếu có payment_url, chuyển hướng đến trang thanh toán
                if (response.data.payment_url) {
                    window.location.href = response.data.payment_url;
                }
            } else {
                throw new Error(response.data.message || 'Đặt tour thất bại');
            }
            
        } catch (error: any) {
            console.error('Booking error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi đặt tour. Vui lòng thử lại!';
            alert(`❌ ${errorMessage}`);
        } finally {
            setBookingLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return `${(price / 1000).toFixed(0)}K`;
    };

    const getMonthName = (month: number) => {
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return months[month];
    };

    // Danh sách dịch vụ bổ sung từ API với giá thực tế
    const getAdditionalServices = (): AdditionalService[] => {
        const serviceList: AdditionalService[] = [];

        // Hướng dẫn viên - lấy giá từ API
        if (services.guides.length > 0) {
            // Tính giá trung bình của tất cả hướng dẫn viên
            const totalGuidePrice = services.guides.reduce((sum, guide) => sum + (guide.price_per_day || 0), 0);
            const avgGuidePrice = Math.round(totalGuidePrice / services.guides.length);
            
            serviceList.push({
                id: 'guide',
                name: 'Hướng dẫn viên',
                price: avgGuidePrice || 200000,
                description: `${services.guides.length} hướng dẫn viên khả dụng - Giá từ ${Math.min(...services.guides.map(g => g.price_per_day || 0))} VNĐ`,
                icon: '👨‍💼',
                type: 'guide'
            });
        }

        // Khách sạn - lấy giá từ API
        if (services.hotels.length > 0) {
            // Tính giá trung bình của tất cả khách sạn
            const totalHotelPrice = services.hotels.reduce((sum, hotel) => sum + (hotel.price || 0), 0);
            const avgHotelPrice = Math.round(totalHotelPrice / services.hotels.length);
            
            serviceList.push({
                id: 'hotel',
                name: 'Khách sạn',
                price: avgHotelPrice || 300000,
                description: `${services.hotels.length} khách sạn khả dụng - Giá từ ${Math.min(...services.hotels.map(h => h.price || 0))} VNĐ`,
                icon: '🏨',
                type: 'hotel'
            });
        }

        // Xe khách - lấy giá từ API
        if (services.busRoutes.length > 0) {
            // Tính giá trung bình của tất cả tuyến xe
            const totalBusPrice = services.busRoutes.reduce((sum, bus) => sum + (bus.price || 0), 0);
            const avgBusPrice = Math.round(totalBusPrice / services.busRoutes.length);
            
            serviceList.push({
                id: 'bus',
                name: 'Xe khách',
                price: avgBusPrice || 150000,
                description: `${services.busRoutes.length} tuyến xe khả dụng - Giá từ ${Math.min(...services.busRoutes.map(b => b.price || 0))} VNĐ`,
                icon: '🚌',
                type: 'bus'
            });
        }

        // Xe máy - lấy giá từ API
        if (services.motorbikes.length > 0) {
            // Tính giá trung bình của tất cả xe máy
            const totalBikePrice = services.motorbikes.reduce((sum, bike) => sum + (bike.price_per_day || 0), 0);
            const avgBikePrice = Math.round(totalBikePrice / services.motorbikes.length);
            
            serviceList.push({
                id: 'motorbike',
                name: 'Xe máy',
                price: avgBikePrice || 100000,
                description: `${services.motorbikes.length} xe máy khả dụng - Giá từ ${Math.min(...services.motorbikes.map(b => b.price_per_day || 0))} VNĐ`,
                icon: '🏍️',
                type: 'motorbike'
            });
        }

        return serviceList;
    };

    const additionalServices = getAdditionalServices();

    const calendarDays = generateCalendarDays();

    // Initial loading state
    if (initialLoading) {
        return (
            <div className="tour-departure-calendar bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4">
                    <h2 className="text-xl font-bold text-center">LỊCH KHỞI HÀNH</h2>
                </div>
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-6"></div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">Đang tải lịch khởi hành...</h3>
                        <p className="text-gray-500">Vui lòng chờ trong giây lát</p>
                    </div>
                </div>
            </div>
        );
    }
        
        return (
        <div className="tour-departure-calendar bg-white rounded-lg shadow-lg overflow-hidden">
            <style jsx>{`
                .tour-departure-calendar {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                }
                
                .calendar-day {
                    transition: all 0.2s ease-in-out;
                }
                
                .calendar-day:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .calendar-day.selected {
                    border-color: #3b82f6 !important;
                    background-color: #eff6ff !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
                }
                
                .calendar-day.has-departure {
                    border-color: #10b981 !important;
                    background-color: #f0fdf4 !important;
                }
                
                .calendar-day.today {
                    border-color: #3b82f6 !important;
                    background-color: #eff6ff !important;
                }
                
                .month-button {
                    transition: all 0.2s ease-in-out;
                }
                
                .month-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .month-button.active {
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }
                
                .nav-button {
                    transition: all 0.2s ease-in-out;
                }
                
                .nav-button:hover:not(:disabled) {
                    background-color: #f3f4f6;
                    transform: scale(1.05);
                }
                
                .nav-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
            
                         {/* Header */}
             <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white p-4">
                 <h2 className="text-xl font-bold text-center">LỊCH KHỞI HÀNH</h2>
                 
                  
             </div>

            <div className="flex">
                                 {/* Left Sidebar - Month Selection */}
                {/* Main Calendar */}
                <div className="flex-1 p-4">
                                         {/* Month Navigation */}
                     <div className="flex items-center justify-between mb-6">
                         <button
                             onClick={() => navigateMonth('prev')}
                             className={`nav-button p-2 rounded-lg transition-all ${
                                 currentMonth === 0 && currentYear <= new Date().getFullYear()
                                     ? 'text-gray-300 cursor-not-allowed'
                                     : 'text-gray-600 hover:bg-gray-100'
                             }`}
                             disabled={currentMonth === 0 && currentYear <= new Date().getFullYear() || loading}
                         >
                             <ChevronLeft size={20} />
                         </button>
                         
                         <h3 className="text-2xl font-bold text-blue-600">
                             {loading ? (
                                 <div className="flex items-center space-x-2">
                                     <div className="w-6 h-6 bg-blue-200 rounded animate-pulse"></div>
                                     <span>/</span>
                                     <div className="w-8 h-6 bg-blue-200 rounded animate-pulse"></div>
                                 </div>
                             ) : (
                                 `${getMonthName(currentMonth)}/${currentYear}`
                             )}
                         </h3>
                         
                         <button
                             onClick={() => navigateMonth('next')}
                             className="nav-button p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                             disabled={loading}
                         >
                             <ChevronRight size={20} />
                         </button>
                     </div>
                     

                                         {/* Days of Week Header */}
                     <div className="grid grid-cols-7 gap-1 mb-2">
                         {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, index) => (
                             <div
                                 key={day}
                                 className={`p-2 text-center text-sm font-medium ${
                                     index >= 5 ? 'text-red-500' : 'text-gray-700'
                                 }`}
                             >
                                 {day}
                             </div>
                         ))}
                     </div>
                     
                     {/* Loading State */}
                     {loading && (
                         <div className="flex items-center justify-center py-12">
                             <div className="text-center">
                                 <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                 <p className="text-gray-600">Đang tải lịch khởi hành...</p>
                             </div>
                         </div>
                     )}

                                         {/* Calendar Grid */}
                     {!loading && (
                         <div className="grid grid-cols-7 gap-1">
                             {calendarDays.map((day, index) => {
                                 const hasDeparture = day.departure;
                                 const isAvailable = hasDeparture && day.departure.status === 'available';
                                 
                                 // Debug log cho ngày có departure
                                 if (hasDeparture) {
                                     console.log('Rendering day with departure:', day.dateString, day.departure);
                                 }
                                 
                                 return (
                                     <div
                                         key={index}
                                         onClick={() => hasDeparture && handleDateClick(day)}
                                         className={`calendar-day min-h-[80px] p-2 border border-gray-200 transition-all ${
                                             day.isSelected
                                                 ? 'calendar-day selected'
                                                 : hasDeparture
                                                 ? 'calendar-day has-departure cursor-pointer hover:bg-green-50'
                                                 : day.isToday
                                                 ? 'calendar-day today'
                                                 : 'text-gray-300 cursor-not-allowed'
                                         } ${
                                             !day.isCurrentMonth ? 'text-gray-400' : ''
                                         }`}
                                     >
                                         {/* Date Number */}
                                         <div className={`text-sm font-medium mb-1 ${
                                             day.isToday ? 'text-blue-600' : ''
                                         }`}>
                                             {day.date.getDate()}
                                         </div>
                                         
                                         {/* Departure Info */}
                                         {hasDeparture && (
                                             <div className="space-y-1">
                                                 <div className="text-xs font-bold text-red-600">
                                                     {formatPrice(day.departure.price)}
                                                 </div>
                                                 {day.departure.notes && (
                                                     <div className="text-xs text-gray-600 truncate">
                                                         {day.departure.notes}
                                                     </div>
                                                 )}
                                             </div>
                                         )}
                                     </div>
                                 );
                             })}
                         </div>
                     )}

                     
                     {/* Selected Departure Details */}
                     {localSelectedDeparture && (
                         <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                             <h4 className="font-semibold text-blue-800 mb-4">Thông tin chuyến đi đã chọn:</h4>
                             <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                 <div className="flex items-center space-x-2">
                                     <CalendarIcon size={16} className="text-blue-600" />
                                     <span className="text-gray-700">
                                         Ngày: {new Date(localSelectedDeparture.departure_date).toLocaleDateString('vi-VN')}
                                     </span>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                     <DollarSign size={16} className="text-green-600" />
                                     <span className="text-gray-700">
                                         Giá: {localSelectedDeparture.price.toLocaleString('vi-VN')} VNĐ
                                     </span>
                                 </div>
                                 <div className="flex items-center space-x-2">
                                     <Users size={16} className="text-purple-600" />
                                     <span className="text-gray-700">
                                         Còn lại: {localSelectedDeparture.max_capacity - localSelectedDeparture.booked_count} chỗ
                                     </span>
                                 </div>
                                 <div className="text-gray-600">
                                     Trạng thái: {localSelectedDeparture.status === 'available' ? 'Còn chỗ' : 'Hết chỗ'}
                                 </div>
                             </div>
                             
                                                           {/* Booking Form */}
                              {localSelectedDeparture.status === 'available' && (
                                  <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
                                      {/* Chọn phương thức đặt tour */}
                                      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                          <div className="flex items-center space-x-2 text-blue-800 mb-3">
                                              <span>🎯</span>
                                              <span className="text-sm font-medium">Chọn phương thức đặt tour</span>
                                          </div>
                                          
                                          <div className="flex space-x-2">
                                              <button
                                                  onClick={() => setIsGuestBooking(false)}
                                                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                                      !isGuestBooking 
                                                          ? 'bg-blue-600 text-white' 
                                                          : 'bg-white text-blue-600 border border-blue-300 hover:bg-blue-50'
                                                  }`}
                                              >
                                                  🔐 Đăng nhập để đặt
                                              </button>
                                              <button
                                                  onClick={() => setIsGuestBooking(true)}
                                                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                                      isGuestBooking 
                                                          ? 'bg-green-600 text-white' 
                                                          : 'bg-white text-green-600 border border-green-300 hover:bg-green-50'
                                                  }`}
                                              >
                                                  👤 Đặt tour không cần đăng nhập
                                              </button>
                                          </div>
                                          
                                          {/* Thông báo đăng nhập nếu chọn đăng nhập */}
                                          {!isGuestBooking && (
                                              <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                                  <p className="text-xs text-yellow-700">
                                                      💡 Bạn cần đăng nhập để đặt tour. 
                                                      <button 
                                                          onClick={() => router.push('/login')}
                                                          className="ml-1 text-blue-600 underline hover:text-blue-800"
                                                      >
                                                          Đăng nhập ngay
                                                      </button>
                                                  </p>
                                              </div>
                                          )}
                                          
                                          {/* Form thông tin khách hàng nếu chọn guest booking */}
                                          {isGuestBooking && (
                                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                                                  <h6 className="text-sm font-medium text-green-800 mb-2">📝 Thông tin cá nhân</h6>
                                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                      <div>
                                                          <label className="block text-xs text-green-700 mb-1">Họ tên *</label>
                                                          <input
                                                              type="text"
                                                              value={guestInfo.name}
                                                              onChange={(e) => setGuestInfo(prev => ({ ...prev, name: e.target.value }))}
                                                              className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                              placeholder="Nhập họ tên"
                                                          />
                                                      </div>
                                                      <div>
                                                          <label className="block text-xs text-green-700 mb-1">Email *</label>
                                                          <input
                                                              type="email"
                                                              value={guestInfo.email}
                                                              onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                                                              className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                              placeholder="example@email.com"
                                                          />
                                                      </div>
                                                      <div>
                                                          <label className="block text-xs text-green-700 mb-1">Số điện thoại *</label>
                                                          <input
                                                              type="tel"
                                                              value={guestInfo.phone}
                                                              onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                                                              className="w-full px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                                                              placeholder="0123456789"
                                                          />
                                                      </div>

                                                  </div>
                                                  <p className="text-xs text-green-600 mt-2">
                                                      💡 Tài khoản sẽ được tạo tự động với email của bạn
                                                  </p>
                                              </div>
                                          )}
                                      </div>
                                      
                                      <div className="flex items-center justify-between mb-4">
                                          <h5 className="font-semibold text-gray-800">Đặt tour ngay</h5>
                                          <button
                                              onClick={() => setShowBookingForm(!showBookingForm)}
                                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                          >
                                              {showBookingForm ? 'Thu gọn' : 'Mở rộng'}
                                          </button>
                            </div>
                                     
                                     {showBookingForm ? (
                                         <div className="space-y-4">
                                             {/* Số người tham gia */}
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                                     👥 Số người tham gia
                                                 </label>
                                                 <input
                                                     type="number"
                                                     min="1"
                                                     max={localSelectedDeparture.max_capacity - localSelectedDeparture.booked_count}
                                                     value={quantity}
                                                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                     onChange={(e) => {
                                                         const newQuantity = parseInt(e.target.value) || 1;
                                                         setQuantity(newQuantity);
                                                     }}
                                                 />
                                             </div>
                                             
                                             {/* Dịch vụ bổ sung */}
                                             <div>
                                                 <label className="block text-sm font-medium text-gray-700 mb-2">
                                                     🔧 Dịch vụ bổ sung
                                                     {servicesLoading && (
                                                         <span className="ml-2 text-xs text-gray-500">
                                                             <div className="inline-flex items-center">
                                                                 <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-1"></div>
                                                                 Đang tải...
                                                             </div>
                                                         </span>
                                                     )}
                                                 </label>
                                                 
                                                 {servicesLoading ? (
                                                     // Loading skeleton cho services
                                                     <div className="space-y-2">
                                                         {Array.from({ length: 3 }).map((_, index) => (
                                                             <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                                                                 <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                                                                 <div className="flex-1">
                                                                     <div className="flex items-center space-x-2 mb-1">
                                                                         <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                                                                         <div className="w-24 h-4 bg-gray-200 rounded animate-pulse"></div>
                                                                         <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                                                                     </div>
                                                                     <div className="w-32 h-3 bg-gray-200 rounded animate-pulse"></div>
                                                                 </div>
                                                             </div>
                ))}
            </div>
                                                 ) : additionalServices.length > 0 ? (
                                                     <div className="space-y-2">
                                                         {additionalServices.map((service) => (
                                                             <label key={service.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                                                 <input
                                                                     type="checkbox"
                                                                     checked={selectedServices.includes(service.id)}
                                                                     onChange={() => handleServiceToggle(service.id)}
                                                                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                                 />
                                                                 <div className="flex-1">
                                                                     <div className="flex items-center space-x-2">
                                                                         <span className="text-lg">{service.icon}</span>
                                                                         <span className="font-medium text-gray-800">{service.name}</span>
                                                                         <span className="text-sm font-bold text-green-600">
                                                                             {service.price.toLocaleString('vi-VN')} VNĐ
                                                                         </span>
                                                                     </div>
                                                                     <p className="text-xs text-gray-600 mt-1">{service.description}</p>
                                                                     
                                                                     {/* Hiển thị thông tin chi tiết từ API */}
                                                                     {(() => {
                                                                         const serviceDetails = getServiceDetails(service.type);
                                                                         if (serviceDetails.length > 0) {
        return (
                                                                                 <div className="mt-2 space-y-1">
                                                                                     <div className="text-xs font-medium text-gray-600">
                                                                                         Chi tiết dịch vụ:
                                                                                     </div>
                                                                                     {serviceDetails.slice(0, 3).map((detail, index) => (
                                                                                         <div key={index} className="text-xs bg-gray-50 p-1 rounded">
                                                                                             <div className="flex justify-between items-center">
                                                                                                 <span className="text-gray-700">{detail.name}</span>
                                                                                                 <span className="font-medium text-green-600">
                                                                                                     {detail.price.toLocaleString('vi-VN')} VNĐ
                                                                                                 </span>
                                                                                             </div>
                                                                                             {detail.description && (
                                                                                                 <div className="text-gray-500 text-xs mt-1">
                                                                                                     {detail.description}
                                                                                                 </div>
                                                                                             )}
                                                                                         </div>
                                                                                     ))}
                                                                                     {serviceDetails.length > 3 && (
                                                                                         <div className="text-xs text-blue-600 text-center">
                                                                                             +{serviceDetails.length - 3} dịch vụ khác
                                                                                         </div>
                                                                                     )}
                                                                                 </div>
                                                                             );
                                                                         }
                                                                         return null;
                                                                     })()}
                                                                 </div>
                                                             </label>
                                                         ))}
                                                     </div>
                                                 ) : (
                                                     <div className="text-center py-6 text-gray-500">
                                                         <div className="text-2xl mb-2">🔧</div>
                                                         <p className="text-sm">Không có dịch vụ bổ sung khả dụng</p>
                                                         <button
                                                             onClick={fetchServices}
                                                             className="mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                                                         >
                                                             Thử lại
                                                         </button>
                                                     </div>
                                                 )}
                                             </div>
                                             
                                             {/* Tổng tiền */}
                                             <div className="bg-gray-50 p-3 rounded-lg">
                                                 <div className="space-y-2">
                                                     <div className="flex justify-between text-sm">
                                                         <span>Giá tour cơ bản:</span>
                                                         <span>{(localSelectedDeparture.price * quantity).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                                                     {selectedServices.length > 0 && (
                                                         <div className="flex justify-between text-sm">
                                                             <span>Dịch vụ bổ sung:</span>
                                                             <span>{selectedServices.reduce((total, serviceId) => {
                                                                 const service = additionalServices.find(s => s.id === serviceId);
                                                                 return total + (service ? service.price : 0);
                                                             }, 0).toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                                                     )}
                                                     <div className="border-t pt-2 flex justify-between font-bold text-lg">
                                                         <span>Tổng cộng:</span>
                                                         <span className="text-green-600">{calculateTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                    </div>
                                             </div>
                                             
                                                                                           {/* Nút đặt tour */}
                                              <button
                                                  onClick={handleBooking}
                                                  disabled={bookingLoading || (isGuestBooking && (!guestInfo.name || !guestInfo.email || !guestInfo.phone))}
                                                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                                              >
                                                  {bookingLoading ? (
                                                      <div className="flex items-center justify-center space-x-2">
                                                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                          <span>Đang xử lý...</span>
                                                      </div>
                                                  ) : (
                                                      <div className="flex items-center justify-center space-x-2">
                                                          <span>🎯</span>
                                                          <span>
                                                              {isGuestBooking ? 'Đặt tour không cần đăng nhập' : 'Đặt tour ngay'}
                                                          </span>
                                                      </div>
                                                  )}
                                              </button>
                                              
                                              {/* Thông báo validation cho guest booking */}
                                              {isGuestBooking && (!guestInfo.name || !guestInfo.email || !guestInfo.phone) && (
                                                  <p className="text-xs text-red-600 text-center mt-2">
                                                      ⚠️ Vui lòng điền đầy đủ thông tin bắt buộc để tiếp tục
                                                  </p>
                                              )}
                                         </div>
                                     ) : (
                                         <button
                                             onClick={() => setShowBookingForm(true)}
                                             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                         >
                                             🎯 Đặt tour ngay
                                         </button>
                                     )}
                                 </div>
                             )}
                         </div>
                     )}
                </div>

                                 {/* Right Sidebar - Price Info */}
                 <div className="w-48 bg-gray-50 p-4 border-l border-gray-200">
                     <h3 className="font-semibold text-gray-800 mb-3">Giá</h3>
                     {loading ? (
                         // Loading skeleton cho price info
                         <div className="text-center">
                             <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
                             <div className="w-20 h-6 bg-gray-200 rounded mx-auto mb-2 animate-pulse"></div>
                             <div className="w-16 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
                         </div>
                     ) : localSelectedDeparture ? (
                         <div className="text-center">
                             <div className="text-3xl font-bold text-green-600 mb-2">
                                 {formatPrice(localSelectedDeparture.price)}
                             </div>
                             <div className="text-sm text-gray-600 mb-4">
                                 VNĐ/người
                             </div>
                             
                             {/* Giá cơ bản */}
                             <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                                 <div className="text-xs text-gray-500 mb-1">Giá cơ bản ({quantity} người)</div>
                                 <div className="text-lg font-semibold text-gray-800">
                                     {(localSelectedDeparture.price * quantity).toLocaleString('vi-VN')} VNĐ
                </div>
            </div>

                             {/* Dịch vụ bổ sung */}
                             {selectedServices.length > 0 && (
                                 <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 mb-3">
                                     <div className="text-xs text-blue-600 mb-1">Dịch vụ bổ sung</div>
                                     <div className="space-y-1">
                                         {selectedServices.map(serviceId => {
                                             const service = additionalServices.find(s => s.id === serviceId);
                                             return service ? (
                                                 <div key={serviceId} className="flex items-center justify-between text-xs">
                                                     <span className="text-gray-700">{service.icon} {service.name}</span>
                                                     <span className="font-medium text-blue-600">{service.price.toLocaleString('vi-VN')} VNĐ</span>
                                                 </div>
                                             ) : null;
                                         })}
                                     </div>
                                 </div>
                             )}
                             
                             {/* Thông tin dịch vụ từ API */}
                             {!servicesLoading && (
                                 <div className="bg-gray-100 rounded-lg p-3 border border-gray-200 mb-3">
                                     <div className="text-xs text-gray-600 mb-2">Dịch vụ khả dụng:</div>
                                     <div className="space-y-1 text-xs">
                                         {services.guides.length > 0 && (
                                             <div className="flex items-center justify-between">
                                                 <span className="text-gray-700">👨‍💼 Hướng dẫn viên</span>
                                                 <span className="text-blue-600 font-medium">{services.guides.length}</span>
                                             </div>
                                         )}
                                         {services.hotels.length > 0 && (
                                             <div className="flex items-center justify-between">
                                                 <span className="text-gray-700">🏨 Khách sạn</span>
                                                 <span className="text-green-600 font-medium">{services.hotels.length}</span>
                                             </div>
                                         )}
                                         {services.busRoutes.length > 0 && (
                                             <div className="flex items-center justify-between">
                                                 <span className="text-gray-700">🚌 Xe khách</span>
                                                 <span className="text-purple-600 font-medium">{services.busRoutes.length}</span>
                                             </div>
                                         )}
                                         {services.motorbikes.length > 0 && (
                                             <div className="flex items-center justify-between">
                                                 <span className="text-gray-700">🏍️ Xe máy</span>
                                                 <span className="text-orange-600 font-medium">{services.motorbikes.length}</span>
                                             </div>
                                         )}
                                     </div>
                                     
                                     {/* Hiển thị giá thực tế từ API */}
                                     <div className="mt-2 pt-2 border-t border-gray-200">
                                         <div className="text-xs text-gray-600 mb-1">Giá thực tế từ API:</div>
                                         <div className="space-y-1">
                                             {services.guides.length > 0 && (
                                                 <div className="text-xs">
                                                     <span className="text-gray-600">Hướng dẫn viên:</span>
                                                     <span className="ml-1 text-blue-600 font-medium">
                                                         {Math.min(...services.guides.map(g => g.price_per_day || 0)).toLocaleString('vi-VN')} - {Math.max(...services.guides.map(g => g.price_per_day || 0)).toLocaleString('vi-VN')} VNĐ
                                                     </span>
                                                 </div>
                                             )}
                                             {services.hotels.length > 0 && (
                                                 <div className="text-xs">
                                                     <span className="text-gray-600">Khách sạn:</span>
                                                     <span className="ml-1 text-green-600 font-medium">
                                                         {Math.min(...services.hotels.map(h => h.price || 0)).toLocaleString('vi-VN')} - {Math.max(...services.hotels.map(h => h.price || 0)).toLocaleString('vi-VN')} VNĐ
                                                     </span>
                                                 </div>
                                             )}
                                             {services.busRoutes.length > 0 && (
                                                 <div className="text-xs">
                                                     <span className="text-gray-600">Xe khách:</span>
                                                     <span className="ml-1 text-purple-600 font-medium">
                                                         {Math.min(...services.busRoutes.map(b => b.price || 0)).toLocaleString('vi-VN')} - {Math.max(...services.busRoutes.map(b => b.price || 0)).toLocaleString('vi-VN')} VNĐ
                                                     </span>
                                                 </div>
                                             )}
                                             {services.motorbikes.length > 0 && (
                                                 <div className="text-xs">
                                                     <span className="text-gray-600">Xe máy:</span>
                                                     <span className="ml-1 text-orange-600 font-medium">
                                                         {Math.min(...services.motorbikes.map(b => b.price_per_day || 0)).toLocaleString('vi-VN')} - {Math.max(...services.motorbikes.map(b => b.price_per_day || 0)).toLocaleString('vi-VN')} VNĐ
                                                     </span>
                                                 </div>
                        )}
                    </div>
                                     </div>
                                 </div>
                             )}
                             
                             {/* Tổng cộng */}
                             <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                                 <div className="text-xs text-gray-500 mb-1">Tổng cộng</div>
                                 <div className="text-xl font-bold text-green-600">
                                     {calculateTotalPrice().toLocaleString('vi-VN')} VNĐ
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="text-center text-gray-500">
                             <CalendarIcon size={48} className="mx-auto mb-2 text-gray-300" />
                             <p className="text-sm">Chọn ngày để xem giá</p>
                </div>
            )}
                 </div>
            </div>
        </div>
    );
};

export default TourDepartureCalendar;
