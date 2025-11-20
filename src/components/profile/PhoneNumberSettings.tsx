import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Check, X, AlertCircle, Trash2 } from 'lucide-react';
import { useToastContext } from '../../context/ToastContext';
import { userService } from '../../services/userService';
import Button from '../common/Button';
import Input from '../common/Input';

interface PhoneNumberSettingsProps {
  initialPhoneNumber?: string;
  initialPhoneVerified?: boolean;
  onPhoneUpdate?: () => void;
}

// Common country codes for the selector
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: 'US' },
  { code: '+44', country: 'UK', flag: 'GB' },
  { code: '+234', country: 'NG', flag: 'NG' },
  { code: '+91', country: 'IN', flag: 'IN' },
  { code: '+86', country: 'CN', flag: 'CN' },
  { code: '+81', country: 'JP', flag: 'JP' },
  { code: '+49', country: 'DE', flag: 'DE' },
  { code: '+33', country: 'FR', flag: 'FR' },
  { code: '+61', country: 'AU', flag: 'AU' },
  { code: '+55', country: 'BR', flag: 'BR' },
  { code: '+52', country: 'MX', flag: 'MX' },
  { code: '+34', country: 'ES', flag: 'ES' },
  { code: '+39', country: 'IT', flag: 'IT' },
  { code: '+7', country: 'RU', flag: 'RU' },
  { code: '+82', country: 'KR', flag: 'KR' },
  { code: '+31', country: 'NL', flag: 'NL' },
  { code: '+46', country: 'SE', flag: 'SE' },
  { code: '+47', country: 'NO', flag: 'NO' },
  { code: '+45', country: 'DK', flag: 'DK' },
  { code: '+41', country: 'CH', flag: 'CH' },
  { code: '+43', country: 'AT', flag: 'AT' },
];

const PhoneNumberSettings: React.FC<PhoneNumberSettingsProps> = ({
  initialPhoneNumber,
  initialPhoneVerified = false,
  onPhoneUpdate,
}) => {
  const { showSuccess, showError } = useToastContext();
  
  // Parse initial phone number into country code and number
  const parsePhoneNumber = (phone?: string) => {
    if (!phone) return { countryCode: '+1', phoneNumber: '' };
    
    // Find matching country code
    const matchingCode = COUNTRY_CODES.find(c => phone.startsWith(c.code));
    if (matchingCode) {
      return {
        countryCode: matchingCode.code,
        phoneNumber: phone.substring(matchingCode.code.length),
      };
    }
    
    return { countryCode: '+1', phoneNumber: phone.replace(/^\+/, '') };
  };

  const [isEditing, setIsEditing] = useState(!initialPhoneNumber);
  const [countryCode, setCountryCode] = useState(parsePhoneNumber(initialPhoneNumber).countryCode);
  const [phoneNumber, setPhoneNumber] = useState(parsePhoneNumber(initialPhoneNumber).phoneNumber);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(initialPhoneVerified);
  const [showVerificationInput, setShowVerificationInput] = useState(false);
  const [currentPhone, setCurrentPhone] = useState(initialPhoneNumber);

  useEffect(() => {
    setPhoneVerified(initialPhoneVerified);
    setCurrentPhone(initialPhoneNumber);
    const parsed = parsePhoneNumber(initialPhoneNumber);
    setCountryCode(parsed.countryCode);
    setPhoneNumber(parsed.phoneNumber);
  }, [initialPhoneNumber, initialPhoneVerified]);

  const handleSavePhone = async () => {
    // Validate phone number
    if (!phoneNumber || phoneNumber.trim().length < 7) {
      showError('Please enter a valid phone number');
      return;
    }

    // Remove any non-digit characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const fullPhoneNumber = `${countryCode}${cleanNumber}`;

    try {
      setIsSaving(true);
      
      const data = await userService.updatePhoneNumber(fullPhoneNumber);

      setCurrentPhone(fullPhoneNumber);
      setPhoneVerified(false);
      setShowVerificationInput(true);
      setIsEditing(false);
      showSuccess('Phone number updated. Please verify with the code sent to your phone.');
      
      // In development, show the verification code
      if (data.verificationCode) {
        console.log('Verification code:', data.verificationCode);
        showSuccess(`Development mode - Code: ${data.verificationCode}`);
      }

      if (onPhoneUpdate) {
        onPhoneUpdate();
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to update phone number');
    } finally {
      setIsSaving(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      showError('Please enter a valid 6-digit verification code');
      return;
    }

    try {
      setIsVerifying(true);

      await userService.verifyPhoneNumber(verificationCode);

      setPhoneVerified(true);
      setShowVerificationInput(false);
      setVerificationCode('');
      showSuccess('Phone number verified successfully!');

      if (onPhoneUpdate) {
        onPhoneUpdate();
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to verify phone number');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemovePhone = async () => {
    if (!confirm('Are you sure you want to remove your phone number? You will no longer receive WhatsApp notifications.')) {
      return;
    }

    try {
      setIsRemoving(true);

      await userService.removePhoneNumber();

      setCurrentPhone(undefined);
      setPhoneNumber('');
      setPhoneVerified(false);
      setShowVerificationInput(false);
      setIsEditing(true);
      showSuccess('Phone number removed successfully');

      if (onPhoneUpdate) {
        onPhoneUpdate();
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to remove phone number');
    } finally {
      setIsRemoving(false);
    }
  };

  const handleResendCode = async () => {
    if (!currentPhone) return;
    
    try {
      setIsSaving(true);
      
      const data = await userService.updatePhoneNumber(currentPhone);

      showSuccess('Verification code resent successfully');
      
      // In development, show the verification code
      if (data.verificationCode) {
        console.log('Verification code:', data.verificationCode);
        showSuccess(`Development mode - Code: ${data.verificationCode}`);
      }
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Failed to resend verification code');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-[#334155] shadow-sm"
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Phone Number
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Add your phone number to receive WhatsApp notifications
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Phone Display */}
        {currentPhone && !isEditing && (
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0f172a] rounded-lg">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <div>
                <p className="text-gray-900 dark:text-gray-100 font-medium">
                  {currentPhone}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {phoneVerified ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <Check className="w-4 h-4" />
                      Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="w-4 h-4" />
                      Not verified
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
              >
                Change
              </button>
              <button
                onClick={handleRemovePhone}
                disabled={isRemoving}
                className="px-3 py-1.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>
        )}

        {/* Phone Number Input */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phone Number (E.164 format)
                </label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20 min-w-[120px]"
                  >
                    {COUNTRY_CODES.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.code} {country.country}
                      </option>
                    ))}
                  </select>

                  {/* Phone Number Input */}
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="1234567890"
                    className="flex-1 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/20"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Example: {countryCode}1234567890
                </p>
              </div>

              <div className="flex gap-3">
                {currentPhone && (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      const parsed = parsePhoneNumber(currentPhone);
                      setCountryCode(parsed.countryCode);
                      setPhoneNumber(parsed.phoneNumber);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
                <Button
                  onClick={handleSavePhone}
                  loading={isSaving}
                  variant="primary"
                  icon={<Check className="w-4 h-4" />}
                >
                  {currentPhone ? 'Update Phone' : 'Add Phone'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Code Input */}
        <AnimatePresence>
          {showVerificationInput && !phoneVerified && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 p-4 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    Verification Required
                  </p>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>
              </div>

              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="text-center text-2xl tracking-widest font-mono"
              />

              <div className="flex gap-3">
                <button
                  onClick={handleResendCode}
                  disabled={isSaving}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline disabled:opacity-50"
                >
                  Resend Code
                </button>
                <Button
                  onClick={handleVerifyCode}
                  loading={isVerifying}
                  variant="primary"
                  icon={<Check className="w-4 h-4" />}
                  className="ml-auto"
                >
                  Verify
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Verification Status */}
        {currentPhone && phoneVerified && !isEditing && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-500/10 rounded-lg border border-green-200 dark:border-green-500/20">
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <p className="text-sm text-green-700 dark:text-green-300">
              Your phone number is verified and ready to receive notifications
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PhoneNumberSettings;
