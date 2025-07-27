export type LoginFormData = {
  phoneOrEmail: string;
  password: string;
};

export type LoginFormErrors = {
  phoneOrEmail: string;
  password: string;
};

export const validateLoginForm = (data: LoginFormData): LoginFormErrors => {
  const errors: LoginFormErrors = {
    phoneOrEmail: '',
    password: '',
  };

  if (!data.phoneOrEmail.trim()) {
    errors.phoneOrEmail = 'Please enter a phone number or email!';
  } else {
    const isPhone = /^0\d{9}$/.test(data.phoneOrEmail);
    const isEmail = /\S+@\S+\.\S+/.test(data.phoneOrEmail);
    if (!isPhone && !isEmail) {
      errors.phoneOrEmail = 'Invalid phone number or email!';
    }
  }

  if (!data.password.trim()) {
    errors.password = 'Password is required!';
  }

  return errors;
};