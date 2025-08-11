"use client";

import AuthDialog from "@/app/(auth)/AuthDialog";
import CustomButton from "@/components/customButton";
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from "@headlessui/react";
import {
    Bars3Icon,
    BellIcon,
    MagnifyingGlassIcon,
    UserCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import styles from "./style.module.css";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import type { AppDispatch } from "@/lib/redux/store";
import { RootState } from "@/lib/redux/store";
import { logout } from "@/lib/redux/thunks/logout";
import { useDispatch, useSelector } from "react-redux";

type NavigationItem = {
    name: string;
    href: string;
    current: boolean;
};

type Props = {
    navigation: NavigationItem[];
};

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function HeaderClient({ navigation }: Props) {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [showSearch, setShowSearch] = useState<boolean>(false);

    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const { user, isAuthenticated } = useSelector(
        (state: RootState) => state.auth
    );
    const [loading, setLoading] = useState(false);

    console.log("User:", JSON.stringify(user, null, 2));
    console.log(isAuthenticated);

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleSearch = (e: FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm("");
            setShowSearch(false);
        }
    };

    // Hàm để toggle hiển thị form tìm kiếm trên mobile
    const toggleSearch = () => {
        setShowSearch(!showSearch);
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 0);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={`${styles.header} ${
                isSticky ? styles.headerSticky : ""
            } top-0 left-0 right-0 z-20 transition-colors duration-300`}
        >
            <Disclosure as="nav">
                {({ open }) => (
                    <>
                        <div className="mx-auto container px-2 sm:px-6 lg:px-8">
                            <div className="relative flex items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset">
                                        <Bars3Icon className="block size-6 group-data-open:hidden" />
                                        <XMarkIcon className="hidden size-6 group-data-open:block" />
                                    </DisclosureButton>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:justify-between">
                                    <div className="flex shrink-0 items-center">
                                        <Image
                                            alt="Logo"
                                            src="/images/logo.png"
                                            className={styles.logo}
                                            width={1000}
                                            height={700}
                                            quality={100}
                                        />
                                    </div>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    prefetch={true}
                                                    aria-current={
                                                        item.current
                                                            ? "page"
                                                            : undefined
                                                    }
                                                    className={styles.menuItem}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Search Form - Desktop */}
                                <div className="hidden sm:block mr-4">
                                    <form
                                        onSubmit={handleSearch}
                                        className="flex items-center"
                                    >
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Tìm kiếm..."
                                                value={searchTerm}
                                                onChange={(e) =>
                                                    setSearchTerm(
                                                        e.target.value
                                                    )
                                                }
                                                className="py-2 pl-4 pr-10 rounded-full text-sm border border-gray-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-gray-700 bg-white/90"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-cyan-600"
                                            >
                                                <MagnifyingGlassIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Search toggle button - Mobile */}
                                <div className="sm:hidden mr-2">
                                    <button
                                        onClick={toggleSearch}
                                        className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
                                    >
                                        <MagnifyingGlassIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-2 sm:pr-0">
                                    <CustomButton className="relative rounded-full p-1 text-gray-400 hover:text-white">
                                        <BellIcon aria-hidden="true" />
                                    </CustomButton>

                                    <AuthDialog
                                        open={showForm}
                                        onOpenChange={setShowForm}
                                    />

                                    <div>
                                        {loading ? (
                                            <Loader2
                                                className="animate-spin"
                                                size={25}
                                            />
                                        ) : isAuthenticated && user ? (
                                            <div className="relative group inline-block">
                                                <button className="py-2 cursor-pointer">
                                                    <Image
                                                        src={
                                                            user.avatar_url ||
                                                            "/images/avatar-default.png"
                                                        }
                                                        width={50}
                                                        height={50}
                                                        className="w-[35px] h-[35px] rounded-full object-cover"
                                                        alt={user.full_name}
                                                    />
                                                </button>

                                                <div className="absolute hidden group-hover:block bg-white right-0 text-black shadow-md rounded-[10px] border border-[#999999] min-w-[200px] z-50">
                                                    <ul className="py-2">
                                                        <li className="px-5 py-2 truncate border-b border-[#d1d1d1] text-cyan-600">
                                                            {user.full_name}
                                                        </li>
                                                        <li className="px-5 py-2 hover:bg-cyan-400 cursor-pointer">
                                                            <Link
                                                                href="/profile"
                                                                className="text-black"
                                                            >
                                                                Thông tin tài
                                                                khoản
                                                            </Link>
                                                        </li>
                                                        <li className="px-5 py-2 hover:bg-cyan-400 cursor-pointer">
                                                            Tours yêu thích
                                                        </li>
                                                        <li className="px-5 py-2 hover:bg-cyan-400 cursor-pointer">
                                                            <Link
                                                                href="/myorder"
                                                                className="text-black"
                                                            >
                                                                Đơn hàng
                                                            </Link>
                                                        </li>
                                                        <li className="px-5 py-2">
                                                            <AlertDialog>
                                                                <AlertDialogTrigger
                                                                    asChild
                                                                >
                                                                    <CustomButton className="bg-red-600 hover:bg-red-400 text-white cursor-pointer rounded-2xl">
                                                                        Đăng
                                                                        xuất
                                                                    </CustomButton>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>
                                                                            Bạn
                                                                            chắc
                                                                            chắn
                                                                            muốn
                                                                            đăng
                                                                            xuất?
                                                                        </AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            Hành
                                                                            động
                                                                            này
                                                                            sẽ
                                                                            kết
                                                                            thúc
                                                                            phiên
                                                                            đăng
                                                                            nhập
                                                                            hiện
                                                                            tại
                                                                            của
                                                                            bạn.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel className="bg-gray-300 hover:bg-gray-400">
                                                                            Hủy
                                                                        </AlertDialogCancel>
                                                                        <AlertDialogAction
                                                                            className="bg-red-600 hover:bg-red-700"
                                                                            onClick={
                                                                                handleLogout
                                                                            }
                                                                        >
                                                                            Xác
                                                                            nhận
                                                                        </AlertDialogAction>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        ) : (
                                            <CustomButton
                                                onClick={() =>
                                                    setShowForm(true)
                                                }
                                                className="cursor-pointer rounded-full p-1 text-gray-400 hover:text-white"
                                            >
                                                <UserCircleIcon />
                                            </CustomButton>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobile search form */}
                        {showSearch && (
                            <div className="px-4 pt-2 pb-3 sm:hidden">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex items-center"
                                >
                                    <input
                                        type="text"
                                        placeholder="Tìm kiếm..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full py-2 px-4 rounded-l-md border border-gray-300 focus:outline-none focus:border-cyan-500 text-gray-700 bg-white/90"
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-cyan-500 text-white rounded-r-md border border-cyan-500 hover:bg-cyan-600"
                                    >
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        )}

                        <DisclosurePanel className="sm:hidden">
                            <div className="space-y-1 px-2 pt-2 pb-3">
                                {navigation.map((item) => (
                                    <DisclosureButton
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        aria-current={
                                            item.current ? "page" : undefined
                                        }
                                        className={classNames(
                                            item.current
                                                ? "bg-gray-900 text-white"
                                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "block rounded-md px-3 py-2 text-base font-medium"
                                        )}
                                    >
                                        {item.name}
                                    </DisclosureButton>
                                ))}
                            </div>
                        </DisclosurePanel>
                    </>
                )}
            </Disclosure>
        </header>
    );
}
