"use client";

import { Button } from "@/components/ui/button";
import { Mail, Phone, Loader2 } from "lucide-react";
import { useState } from "react";

type Props = {
  onSelect: (method: "email" | "phone") => Promise<void>;
};

export default function MethodSelect({ onSelect }: Props) {
  const [loadingMethod, setLoadingMethod] = useState<"email" | "phone" | null>(null);

  const handleSelect = async (method: "email" | "phone") => {
    setLoadingMethod(method);
    try {
      await onSelect(method);
    } finally {
      setLoadingMethod(null); // reset sau khi xong
    }
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-muted-foreground text-sm">
        Vui lòng chọn phương thức để xác thực tài khoản của bạn.
      </p>

      <div className="flex flex-col gap-5 mt-6 mb-6">
        <Button
          variant="outline"
          disabled={loadingMethod !== null}
          className="w-full h-[45px] flex items-center gap-2 justify-center bg-[#dadada] hover:bg-[#8d8d8d] text-[15px] shadow-2xl cursor-pointer"
          onClick={() => handleSelect("email")}
        >
          {loadingMethod === "email" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang gửi Email...
            </>
          ) : (
            <>
              <Mail size={18} />
              Xác thực qua Email
            </>
          )}
        </Button>

        <Button
          variant="outline"
          disabled={loadingMethod !== null}
          className="w-full h-[45px] flex items-center gap-2 justify-center bg-[#dadada] hover:bg-[#8d8d8d] text-[15px] shadow-2xl cursor-pointer"
          onClick={() => handleSelect("phone")}
        >
          {loadingMethod === "phone" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Đang gửi SMS...
            </>
          ) : (
            <>
              <Phone size={18} />
              Xác thực qua Số điện thoại
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
