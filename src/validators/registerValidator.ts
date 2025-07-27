interface RegisterFormData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

interface RegisterFormErrors {
  fullname: string;
  email: string;
  phone: string;
  password: string;
}

export function validateRegisterForm(data: RegisterFormData): RegisterFormErrors {
  const errors: RegisterFormErrors = {
    fullname: '',
    email: '',
    phone: '',
    password: '',
  };

  if (!data.fullname.trim()) {
    errors.fullname = 'Vui lòng nhập họ và tên';
  }

  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  if (!data.phone.trim()) {
    errors.phone = 'Vui lòng nhập số điện thoại';
  } else if (!phoneRegex.test(data.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!data.email.trim()) {
    errors.email = 'Vui lòng nhập email';
  } else if (!emailRegex.test(data.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!data.password.trim()) {
    errors.password = 'Vui lòng nhập mật khẩu';
  } else if (data.password.length < 6) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  return errors;
}
