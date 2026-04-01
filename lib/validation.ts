interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Invalid email format' };
  }

  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }

  return { valid: true };
}

export function validateRegistration(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  uniqueCode?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.firstName?.trim()) errors.firstName = 'First name is required';
  if (!data.lastName?.trim()) errors.lastName = 'Last name is required';
  if (!data.uniqueCode?.trim()) errors.uniqueCode = 'Registration code is required';

  const emailResult = validateEmail(data.email || '');
  if (!emailResult.valid) errors.email = emailResult.error!;

  const passwordResult = validatePassword(data.password || '');
  if (!passwordResult.valid) errors.password = passwordResult.error!;

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginInput(data: {
  email?: string;
  password?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.email?.trim()) errors.email = 'Email is required';
  if (!data.password) errors.password = 'Password is required';

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
