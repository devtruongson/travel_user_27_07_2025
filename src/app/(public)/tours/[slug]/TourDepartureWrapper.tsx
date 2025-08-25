"use client";

import TourDepartureCalendar from "@/components/TourDepartureCalendar";

interface TourDepartureWrapperProps {
    tourId: number;
}

export default function TourDepartureWrapper({ tourId }: TourDepartureWrapperProps) {
    const handleSelectDeparture = (departure: any) => {
        console.log('Selected departure:', departure);
        // Có thể thêm logic xử lý khi chọn departure
    };

    return (
        <TourDepartureCalendar 
            tourId={tourId}
            onSelectDeparture={handleSelectDeparture}
        />
    );
}
