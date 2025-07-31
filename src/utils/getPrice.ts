export default function getPrice(value: string | number): string {
    // Chuyển về string và loại bỏ ký tự không phải số hoặc dấu chấm
    let str = String(value).replace(/[^0-9.]/g, "");
    // Loại bỏ phần thập phân .00 hoặc .0
    str = str.replace(/(\.\d{1,2})$/, "");
    // Định dạng lại với dấu chấm ngăn cách mỗi 3 số từ phải sang trái
    return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
