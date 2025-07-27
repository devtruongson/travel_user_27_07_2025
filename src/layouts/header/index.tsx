
import HeaderClient from "./HeaderClient";

export default async function Header() {

  const navigation = [
    { name: "Trang chủ", href: '/', current: true },
    { name: "Về chúng tôi", href: '/about', current: false },
    { name: "Tours", href: '/tours', current: false },
    { name: "Điểm đến", href: '/destination', current: false },
    { name: "Dịch vụ", href: '/service', current: false },
    { name: "Blog", href: '/blog', current: false },
    { name: "Liên hệ", href: '/contact', current: false },
  ];

  return <HeaderClient navigation={navigation} />;
}
