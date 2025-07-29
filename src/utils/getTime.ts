export const getTime = (time: string) => {
    const [hoursStr, minutesStr] = time.split(":");
    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // chuyển 0 -> 12, 13 -> 1, etc.

    const paddedMinutes = minutes.toString().padStart(2, "0");
    return `${hours}:${paddedMinutes} ${period}`;
};
