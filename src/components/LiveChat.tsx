"use client";

import { useEffect } from "react";

export default function LiveChat() {
    useEffect(() => {
        // Thiết lập cấu hình LiveChat
        window.__lc = window.__lc || {};
        window.__lc.license = 19270730;
        window.__lc.asyncInit = true; // Thêm dòng này
        window.__lc.integration_name = "manual_onboarding";
        window.__lc.product_name = "livechat";

        // Khởi tạo LiveChat một cách thủ công
        const script = document.createElement("script");
        script.async = true;
        script.src = "https://cdn.livechatinc.com/tracking.js";
        document.head.appendChild(script);

        return () => {
            // Dọn dẹp khi component unmount
            if (document.head.contains(script)) {
                document.head.removeChild(script);
            }
        };
    }, []);

    return (
        <noscript>
            <a
                href="https://www.livechat.com/chat-with/19270730/"
                rel="nofollow"
            >
                Chat with us
            </a>
            , powered by{" "}
            <a
                href="https://www.livechat.com/?welcome"
                rel="noopener nofollow"
                target="_blank"
            >
                LiveChat
            </a>
        </noscript>
    );
}
