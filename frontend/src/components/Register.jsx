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
  loadingClass,
} from "../styles/common";
import { NavLink,useNavigate } from "react-router";
import { useEffect,useState } from "react";
import axios from "axios";

function Register() {

  const {
    register,
    handleSubmit,
    formState:{errors}
  }=useForm({
    mode:"onBlur"
  });

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [preview,setPreview]=useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  
  const [blocks, setBlocks] = useState([]);
  const [flats, setFlats] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState("");

  const navigate=useNavigate();

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await axios.get("/common-api/blocks");
        setBlocks(res.data.payload.blocks || []);
      } catch (err) {
        console.error("Failed to load blocks:", err);
      }
    };
    fetchBlocks();
  }, []);

  const handleBlockChange = async (e) => {
    const blockId = e.target.value;
    setSelectedBlockId(blockId);
    setFlats([]);
    if (blockId) {
      try {
        const res = await axios.get(`/common-api/flats/by-block/${blockId}`);
        setFlats(res.data.payload.flats || []);
      } catch (err) {
        console.error("Failed to load flats:", err);
      }
    }
  };

  const onUserRegister=async(newUser)=>{
    if (!selectedFile) {
      setFileError("Profile image is required");
      return;
    }

    setLoading(true);
    setError(null);
    setFileError(null);

    const formData=new FormData();

    formData.append("fullName",newUser.fullName);
    formData.append("email",newUser.email);
    formData.append("mobile",newUser.mobile);
    formData.append("password",newUser.password);
    formData.append("occupantType",newUser.occupantType);
    formData.append("flatId",newUser.flatId);
    formData.append("profileImage", selectedFile);

    try{

      const res=await axios.post(
        "/user-api/register",
        formData,
        {
          withCredentials:true
        }
      );

      if(res.status===201){
        navigate("/verify-email", { state: { email: newUser.email } });
      }

    }catch(err){

      setError(
        err.response?.data?.message ||
        "Registration failed"
      );

    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    return ()=>{
      if(preview){
        URL.revokeObjectURL(preview);
      }
    };
  },[preview]);

  if(loading){
    return (
      <p className={loadingClass}>
        Registering...
      </p>
    );
  }

  return (
    <div className={`${pageBackground} flex items-center justify-center py-16 px-4`}>
      <div className={formCard}>

        <h2 className={formTitle}>
          Create Account
        </h2>

        {error&&(
          <p className={errorClass}>
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit(onUserRegister)}>

          {/* Full Name */}
          <div className={formGroup}>
            <label className={labelClass}>
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter full name"
              className={inputClass}
              {...register("fullName",{
                required:"Full name is required",
                pattern:{
                  value:/^[A-Za-z ]{3,50}$/,
                  message:"Only letters and spaces allowed"
                }
              })}
            />

            {errors.fullName&&(
              <p className={errorClass}>
                {errors.fullName.message}
              </p>
            )}
          </div>

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

          {/* Mobile */}
          <div className={formGroup}>
            <label className={labelClass}>
              Mobile
            </label>

            <input
              type="text"
              placeholder="9876543210"
              className={inputClass}
              {...register("mobile",{
                required:"Mobile number is required",
                pattern:{
                  value:/^[6-9]\d{9}$/,
                  message:"Enter valid 10 digit mobile number"
                }
              })}
            />

            {errors.mobile&&(
              <p className={errorClass}>
                {errors.mobile.message}
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
                required:"Password is required",
                pattern:{
                  value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                  message:"Must contain uppercase, lowercase, number and 8+ chars"
                }
              })}
            />

            {errors.password&&(
              <p className={errorClass}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Occupant Type */}
          <div className={formGroup}>
            <label className={labelClass}>
              Occupant Type
            </label>
            <select
              className={inputClass}
              {...register("occupantType",{
                required:"Occupant type is required"
              })}
            >
              <option value="">Select occupant type</option>
              <option value="OWNER">Owner</option>
              <option value="TENANT">Tenant</option>
            </select>
            {errors.occupantType&&(
              <p className={errorClass}>
                {errors.occupantType.message}
              </p>
            )}
          </div>

          {/* Block Selection */}
          <div className={formGroup}>
            <label className={labelClass}>
              Block
            </label>
            <select
              className={inputClass}
              value={selectedBlockId}
              onChange={handleBlockChange}
            >
              <option value="">Select block</option>
              {blocks.map((block) => (
                <option key={block.id} value={block.id}>
                  {block.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flat Selection */}
          <div className={formGroup}>
            <label className={labelClass}>
              Flat
            </label>
            <select
              className={inputClass}
              disabled={!selectedBlockId}
              {...register("flatId",{
                required:"Flat selection is required"
              })}
            >
              <option value="">Select flat</option>
              {flats.map((flat) => (
                <option key={flat.id} value={flat.id}>
                  {flat.flatNumber} ({flat.bhkType})
                </option>
              ))}
            </select>
            {errors.flatId&&(
              <p className={errorClass}>
                {errors.flatId.message}
              </p>
            )}
          </div>

          {/* Profile Image */}
          <div className={formGroup}>
            <label className={labelClass}>
              Profile Image
            </label>

            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) {
                  setSelectedFile(null);
                  setFileError("Profile image is required");
                  setPreview(null);
                  return;
                }

                if (!["image/jpeg", "image/png"].includes(file.type)) {
                  setFileError("Only JPG and PNG allowed");
                  setSelectedFile(null);
                  setPreview(null);
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  setFileError("File size must be less than 2MB");
                  setSelectedFile(null);
                  setPreview(null);
                  return;
                }

                setFileError(null);
                setSelectedFile(file);
                const previewUrl = URL.createObjectURL(file);
                setPreview(previewUrl);
              }}
            />

            {fileError && (
              <p className={errorClass}>
                {fileError}
              </p>
            )}

            {preview&&(
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={submitBtn}
          >
            Create Account
          </button>

        </form>

        <p className={`${mutedText} text-center mt-5`}>
          Already have an account?{" "}
          <NavLink
            to="/login"
            className="text-violet-600 hover:text-violet-500 font-medium"
          >
            Login
          </NavLink>
        </p>

      </div>
    </div>
  );
}

export default Register;