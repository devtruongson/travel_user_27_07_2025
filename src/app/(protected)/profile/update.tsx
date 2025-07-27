"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API } from "@/lib/api";
import { useDispatch } from "react-redux";
import { setAuth } from "@/lib/redux/slices/authSlice";
import { AppDispatch } from "@/lib/redux/store";

const formSchema = z.object({
  full_name: z.string().min(1, "Tên không được bỏ trống").max(100),
  email: z.string().email("Email không hợp lệ"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số")
    .max(15)
    .regex(/^(0|\+84)[0-9]{9,10}$/, "Số điện thoại không hợp lệ"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.length >= 6,
      { message: "Mật khẩu tối thiểu 6 ký tự" }
    ),
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
  user: {
    full_name: string;
    email: string;
    phone?: string;
  } | null;
};

export default function UpdateInfo({ user }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        full_name: user.full_name || "",
        email: user.email || "",
        phone: user.phone || "",
        password: "",
      });
    }
  }, [user, form]);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      const payloadToSend: any = {
        full_name: values.full_name,
        email: values.email,
        phone: values.phone,
      };

      if (values.password?.trim()) {
        payloadToSend.password = values.password;
      }

      await API.put("/user/update", payloadToSend);

      // Lấy lại user mới
      const meRes = await API.get("/user/me");
      dispatch(setAuth({ user: meRes.data.user, accessToken: "" })); // nếu dùng cookie thì token rỗng

      toast.success("Cập nhật thành công");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Lỗi cập nhật");
    } finally {
      setLoading(false);
    }
  }

  const RequiredLabel = ({ label, required = false }: { label: string; required?: boolean }) => (
    <FormLabel className="text-[15px] font-[700] inline-block text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </FormLabel>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel label="Họ và tên" required />
              <FormControl>
                <Input className="input-style" placeholder="Nguyễn Văn A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel label="Email" required />
              <FormControl>
                <Input className="input-style" type="email" placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel label="Số điện thoại" required />
              <FormControl>
                <Input className="input-style" placeholder="0123456789" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <RequiredLabel label="Mật khẩu" />
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••"
                    {...field}
                    className="input-style"
                  />
                </FormControl>
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={23} /> : <Eye size={23} />}
                </button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="button-style mt-5" disabled={loading}>
          {loading ? "Đang cập nhật..." : "Lưu"}
        </Button>
      </form>
    </Form>
  );
}
