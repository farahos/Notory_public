import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const Login = () => {
    const [form, setForm] = useState({
        phone: "",
        password: ""
    });
    const { login, user } = useUser();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role === "admin") navigate("/admin-dashboard");
        else if (user?.role === "user") navigate("/");
    }, [user]);

    // Check for remembered email
    useEffect(() => {
        const rememberedEmail = localStorage.getItem("rememberedEmail");
        if (rememberedEmail) {
            setForm(prev => ({ ...prev, email: rememberedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        
        try {
            const { data } = await axios.post('/api/user/loginuser', form);
            console.log(data.role);
            toast.success("Login successful!");
            
            // Remember email if checkbox is checked
            if (rememberMe) {
                localStorage.setItem("rememberedEmail", form.phone);
            } else {
                localStorage.removeItem("rememberedEmail");
            }
            
            setLoading(false);
            login(data, data.expirein);
            
            if (data.role === "admin") {
                navigate("/sidebar");
            } else {
                navigate("/header");
            }
        } catch (error) {
            setLoading(false);
            toast.error(error.response?.data?.message || "Login failed. Please try again.");
            console.error(error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-8">
      
      {/* Logo / Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-semibold text-blue-600">
          Gal Hadda
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Ku soo gal akoonkaaga
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tel
          </label>
          <input
            type="text"
            id="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Gali telefoonkaaga"
            className="w-full px-4 py-2 border border-gray-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Gali password kaaga"
              className="w-full px-4 py-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2.5 text-sm text-blue-600"
            >
              {showPassword ? "Qari" : "Muuji"}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div className="text-right">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white
            py-2.5 rounded-md font-medium transition disabled:opacity-60"
        >
          {loading ? "Sug..." : "Gal Hadda"}
        </button>
      </form>

      {/* Register */}
      
    </div>
  </div>
);

};

export default Login;