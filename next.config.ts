import { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: [
            "cdn1.ivivu.com",
            "cdn2.ivivu.com",
            "cdn3.ivivu.com",
            "scontent.fdad3-1.fna.fbcdn.net",
            "scontent.fdad3-2.fna.fbcdn.net",
            "scontent.fdad3-3.fna.fbcdn.net",
            "scontent.fdad3-4.fna.fbcdn.net",
            "scontent.fdad3-5.fna.fbcdn.net",
            "scontent.fhan2-3.fna.fbcdn.net",
            "i.imgur.com",
            "localhost",
        ],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/**", // cho phép tất cả đường dẫn ảnh
            },
        ],
    },
};

export default nextConfig;
