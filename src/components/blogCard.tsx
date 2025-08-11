import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";

interface BlogCardProps {
    imgUrl: string;
    title: string;
    excerpt: string;
    location: string;
    date: string;
    href: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
    imgUrl,
    title,
    excerpt,
    location,
    date,
    href,
}) => {
    return (
        <Link href={href} className="block group">
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={imgUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {excerpt}
                    </p>
                    <div className="flex items-center text-gray-500 text-xs mb-2">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        <span>{location}</span>
                    </div>
                    <div className="flex items-center text-gray-500 text-xs">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{date}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogCard;
