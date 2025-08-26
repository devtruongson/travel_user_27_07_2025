"use client";

import { useEffect } from "react";

export default function LiveChat() {
    useEffect(() => {
        // Cấu hình LiveChat
        window.__lc = window.__lc || {};
        window.__lc.license = 19278811;
        window.__lc.integration_name = "manual_onboarding";
        window.__lc.product_name = "livechat";

        (function (n, t, c) {
            function i(n) {
                return e._h ? e._h.apply(null, n) : e._q.push(n);
            }
            var e: any = {
                _q: [],
                _h: null,
                _v: "2.0",
                on: function () {
                    i(["on", c.call(arguments)]);
                },
                once: function () {
                    i(["once", c.call(arguments)]);
                },
                off: function () {
                    i(["off", c.call(arguments)]);
                },
                get: function () {
                    if (!e._h) throw new Error("[LiveChatWidget] You can't use getters before load.");
                    return i(["get", c.call(arguments)]);
                },
                call: function () {
                    i(["call", c.call(arguments)]);
                },
                init: function () {
                    var n = t.createElement("script");
                    n.async = true;
                    n.type = "text/javascript";
                    n.src = "https://cdn.livechatinc.com/tracking.js";
                    t.head.appendChild(n);
                },
            };
            !n.__lc.asyncInit && e.init();
            (n as any).LiveChatWidget = (n as any).LiveChatWidget || e;
        })(window, document, [].slice);
    }, []);

    return (
        <noscript>
            <a href="https://www.livechat.com/chat-with/19278811/" rel="nofollow">
                Trò chuyện với chúng tôi!
            </a>
            , powered by{" "}
            <a
                href="https://www.livechat.com/?welcome"
                rel="noopener nofollow"
                target="_blank"
            >
                Vtravel
            </a>
        </noscript>
    );
}