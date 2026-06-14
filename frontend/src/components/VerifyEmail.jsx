import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import {
  pageBackground,
  formCard,
  formTitle,
  formGroup,
  labelClass,
  inputClass,
  submitBtn,
  errorClass,
  mutedText,
  linkClass,
} from "../styles/common";

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);

  // Get email from location state or prompt user to type it if not present
  const [email, setEmail] = useState(location.state?.email || "");
  const [showEmailInput, setShowEmailInput] = useState(!location.state?.email);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onVerifyOtp = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/user-api/verify-otp", {
        email: email,
        otp: data.otp,
      });

      if (res.status === 200) {
        toast.success("Account verified successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed"
      );
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const onResendOtp = async () => {
    if (!email) {
      toast.error("Please provide your email address first.");
      setShowEmailInput(true);
      return;
    }
    setResending(true);
    setError(null);
    try {
      const res = await axios.post("/user-api/resend-otp", { email });
      if (res.status === 200) {
        toast.success("A new OTP has been sent to your email!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>
        <h2 className={formTitle}>Verify Your Email</h2>

        {error && <p className={`${errorClass} mb-4`}>{error}</p>}

        <p className={`${mutedText} text-center mb-6`}>
          We have sent a 6-digit verification code (OTP) to your email.
        </p>

        {showEmailInput ? (
          <div className={formGroup}>
            <label className={labelClass}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShowEmailInput(false)}
              disabled={!email}
              className="mt-2 text-xs text-violet-600 font-medium"
            >
              Confirm Email & Enter OTP
            </button>
          </div>
        ) : (
          <div className="mb-4 text-center">
            <span className="text-sm font-semibold text-slate-800">{email}</span>
            <button
              type="button"
              onClick={() => setShowEmailInput(true)}
              className="ml-2 text-xs text-violet-600 underline"
            >
              Change
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onVerifyOtp)}>
          <div className={formGroup}>
            <label className={labelClass}>Enter 6-Digit OTP</label>
            <input
              type="text"
              placeholder="123456"
              className={inputClass}
              maxLength={6}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "OTP must be exactly 6 digits",
                },
              })}
            />
            {errors.otp && (
              <p className={`${errorClass} mt-2`}>{errors.otp.message}</p>
            )}
          </div>

          <button type="submit" disabled={loading} className={submitBtn}>
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="flex flex-col items-center gap-3 mt-6">
          <button
            type="button"
            onClick={onResendOtp}
            disabled={resending}
            className="text-sm text-violet-600 hover:text-violet-500 font-medium disabled:opacity-50"
          >
            {resending ? "Sending OTP..." : "Resend OTP"}
          </button>

          <p className={mutedText}>
            Back to{" "}
            <button
              onClick={() => navigate("/login")}
              className={linkClass}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
