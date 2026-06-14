import { useForm } from "react-hook-form";
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
import { NavLink,useNavigate,useLocation } from "react-router";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

function Login() {

  const {
    register,
    handleSubmit,
    formState:{errors}
  }=useForm({
    mode:"onBlur"
  });

  const login=useAuth((state)=>state.login);
  const isAuthenticated=useAuth((state)=>state.isAuthenticated);
  const currentUser=useAuth((state)=>state.currentUser);
  const error=useAuth((state)=>state.error);

  const navigate=useNavigate();
  const location=useLocation();

  const onUserLogin=async(userCredObj)=>{
    await login(userCredObj);
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      toast.success("Login successful");

      if (currentUser.role === "ADMIN") {
        navigate("/admin");
      }

      if (currentUser.role === "CUSTOMER") {
        navigate("/customer");
      }
    }
  }, [isAuthenticated, currentUser, navigate, location.pathname]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>

        <h2 className={formTitle}>
          Sign In
        </h2>

        {error&&(
          <div className="mb-4">
            <p className={errorClass}>
              {error}
            </p>
            {error.toLowerCase().includes("verify") && (
              <button
                type="button"
                onClick={() => navigate("/verify-email")}
                className="mt-2 text-sm text-violet-600 hover:text-violet-500 font-medium underline"
              >
                Go to Verification Page
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit(onUserLogin)}>

          {/* Email */}
          <div className={formGroup}>
            <label className={labelClass}>
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className={inputClass}
              {...register("email",{
                required:"Email is required",
                pattern:{
                  value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message:"Invalid email format"
                }
              })}
            />

            {errors.email&&(
              <p className={errorClass}>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className={formGroup}>
            <label className={labelClass}>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className={inputClass}
              {...register("password",{
                required:"Password is required"
              })}
            />

            {errors.password&&(
              <p className={errorClass}>
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={submitBtn}
          >
            Sign In
          </button>

        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className={linkClass}
          >
            Create one
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Login;