import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToastContext } from '../context/ToastContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { getEmailError, getPasswordError, getRequiredError } from '../utils/validators';
import { Mail, Lock, User } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const { showSuccess, showError } = useToastContext();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [apiError, setApiError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }

    // Clear API error when user modifies form
    if (apiError) {
      setApiError('');
    }
  };

  const validateForm = (): boolean => {
    const usernameError = getRequiredError(formData.username, 'Username');
    const emailError = getEmailError(formData.email);
    const passwordError = getPasswordError(formData.password, 6);

    setErrors({
      username: usernameError,
      email: emailError,
      password: passwordError,
    });

    return !usernameError && !emailError && !passwordError;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      // Show success message
      showSuccess('Account created successfully! Welcome aboard.');

      // Navigate to dashboard on successful registration
      navigate('/dashboard', { replace: true });
    } catch (error: any) {
      // Display error message from API
      const errorMessage = error?.message || 'Registration failed. Please try again.';
      setApiError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E8F5E9] via-[#E1F5FE] to-[#F3E5F5] px-3 sm:px-4 py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)] mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
              Sign up to start managing your tasks
            </p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <div
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs sm:text-sm"
              role="alert"
            >
              {apiError}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-3 sm:space-y-4">
              <Input
                label="Username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                error={errors.username}
                placeholder="Enter your username"
                icon={<User size={20} />}
                autoComplete="username"
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="Enter your email"
                icon={<Mail size={20} />}
                autoComplete="email"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password (min 6 characters)"
                icon={<Lock size={20} />}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="mt-5 sm:mt-6">
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                className="w-full"
              >
                Sign Up
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-5 sm:mt-6 text-center">
            <p className="text-[var(--color-text-secondary)] text-xs sm:text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[var(--color-purple-primary)] font-medium hover:text-[var(--color-purple-dark)] transition-colors inline-block min-h-[44px] py-2 touch-manipulation"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
