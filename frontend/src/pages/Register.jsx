// import axios from "axios";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { Link, useNavigate } from "react-router-dom";
// import { useUser } from "../hooks/useUser";

// const Register = () => {
//     const [form, setForm] = useState({
//         username: "",
//         email: "",
//         phone: "",
//         password: "",
//         confirmPassword: ""
//     });
//     const { login, user } = useUser();
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [touched, setTouched] = useState({});
//     const [showVerificationPopup, setShowVerificationPopup] = useState(false);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (user) navigate("/");
//     }, [user, navigate]);

//     // Form validation
//     const validateForm = () => {
//         const newErrors = {};

//         // Username validation
//         if (!form.username.trim()) {
//             newErrors.username = "Username is required";
//         }

//         // Email validation
//         if (!form.email.trim()) {
//             newErrors.email = "Email is required";
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//             newErrors.email = "Please enter a valid email address";
//         }

//         // Phone validation
//         if (!form.phone.trim()) {
//             newErrors.phone = "Phone number is required";
//         } else if (!/^\+?[\d\s-()]+$/.test(form.phone)) {
//             newErrors.phone = "Please enter a valid phone number";
//         }

//         // Password validation
//         if (!form.password) {
//             newErrors.password = "Password is required";
//         }

//         // Confirm password validation
//         if (!form.confirmPassword) {
//             newErrors.confirmPassword = "Please confirm your password";
//         } else if (form.password !== form.confirmPassword) {
//             newErrors.confirmPassword = "Passwords do not match";
//         }

//         return newErrors;
//     };

//     const handleChange = (event) => {
//         const { id, value } = event.target;
//         setForm(prev => ({
//             ...prev,
//             [id]: value
//         }));

//         // Clear error when user starts typing
//         if (errors[id]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [id]: ""
//             }));
//         }
//     };

//     const handleBlur = (event) => {
//         const { id } = event.target;
//         setTouched(prev => ({
//             ...prev,
//             [id]: true
//         }));

//         // Validate field on blur
//         const fieldErrors = validateForm();
//         setErrors(prev => ({
//             ...prev,
//             [id]: fieldErrors[id] || ""
//         }));
//     };

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         setTouched({
//             username: true,
//             email: true,
//             phone: true,
//             password: true,
//             confirmPassword: true
//         });

//         const formErrors = validateForm();
//         setErrors(formErrors);

//         if (Object.keys(formErrors).length === 0) {
//             setLoading(true);
//             try {
//                 const { data } = await axios.post("/api/user/registerUser", {
//                     username: form.username,
//                     email: form.email,
//                     phone: form.phone,
//                     password: form.password
//                 });
                
//                 setLoading(false);
//                 // Show verification popup instead of logging in immediately
//                 setShowVerificationPopup(true);
                
//                 // Don't login or navigate yet - account needs verification
//             } catch (error) {
//                 setLoading(false);
//                 const errorMessage = error.response?.data?.message || 
//                                    error.response?.data || 
//                                    "Registration failed. Please try again.";
//                 toast.error(errorMessage);
//                 console.error("Registration error:", error);
//             }
//         } else {
//             toast.error("Please fix the errors in the form");
//         }
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     const getInputClassName = (fieldName) => {
//         const baseClass = "block w-full pl-10 pr-12 py-3 border rounded-xl bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 transition-all duration-200";
//         const errorClass = "border-red-300 dark:border-red-600 focus:ring-red-500 focus:border-red-500";
//         const validClass = "border-gray-300 dark:border-gray-600 focus:ring-green-500 focus:border-green-500";
//         const defaultClass = "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500";
        
//         if (errors[fieldName] && touched[fieldName]) {
//             return `${baseClass} ${errorClass}`;
//         } else if (form[fieldName] && !errors[fieldName] && touched[fieldName]) {
//             return `${baseClass} ${validClass}`;
//         }
//         return `${baseClass} ${defaultClass}`;
//     };

//     const handlePopupClose = () => {
//         setShowVerificationPopup(false);
//         // Redirect to login page after showing the popup
//         navigate("/login");
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 p-4">
//             {/* Background Decorations */}
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 dark:bg-green-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
//                 <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
//                 <div className="absolute top-40 left-40 w-80 h-80 bg-teal-200 dark:bg-teal-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
//             </div>

//             <div className="relative w-full max-w-md">
//                 {/* Main Card */}
//                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-8 animate-fade-in-up">
//                     {/* Header */}
//                     <div className="text-center mb-8">
//                         <div className="flex justify-center mb-4">
//                             <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
//                                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
//                                 </svg>
//                             </div>
//                         </div>
//                         <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
//                            Hadda is diiwaangeli
//                         </h1>
//                         <p className="text-gray-600 dark:text-gray-400 mt-2">
//                             Ku biir suuqa iibka Saamiga ee ugu weyn
//                         </p>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         {/* Username Field */}
//                         <div>
//                             <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                 Magaca
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="text"
//                                     id="username"
//                                     value={form.username}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     className={getInputClassName("username")}
//                                     placeholder="Gali magacaaga oo buuxa"
//                                     required
//                                 />
//                                 {form.username && !errors.username && touched.username && (
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 )}
//                             </div>
//                             {errors.username && touched.username && (
//                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username}</p>
//                             )}
//                         </div>

//                         {/* Email Field */}
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                 Email kaaga
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="email"
//                                     id="email"
//                                     value={form.email}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     className={getInputClassName("email")}
//                                     placeholder="Gali email kaaga "
//                                     required
//                                 />
//                                 {form.email && !errors.email && touched.email && (
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 )}
//                             </div>
//                             {errors.email && touched.email && (
//                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
//                             )}
//                         </div>

//                         {/* Phone Field */}
//                         <div>
//                             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                  Tel
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type="tel"
//                                     id="phone"
//                                     value={form.phone}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     className={getInputClassName("phone")}
//                                     placeholder="Gali lambarka taleefankaaga"
//                                     required
//                                 />
//                                 {form.phone && !errors.phone && touched.phone && (
//                                     <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                                         <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                                         </svg>
//                                     </div>
//                                 )}
//                             </div>
//                             {errors.phone && touched.phone && (
//                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>
//                             )}
//                         </div>

//                         {/* Password Field */}
//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                 Password
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     id="password"
//                                     value={form.password}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     className={getInputClassName("password")}
//                                     placeholder="gali password kaaga"
//                                     required
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={togglePasswordVisibility}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
//                                 >
//                                     {showPassword ? (
//                                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                         </svg>
//                                     ) : (
//                                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                             {errors.password && touched.password && (
//                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
//                             )}
//                             {!errors.password && form.password && (
//                                 <p className="mt-1 text-sm text-green-600 dark:text-green-400">
//                                     ✓ Password meets requirements
//                                 </p>
//                             )}
//                         </div>

//                         {/* Confirm Password Field */}
//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                 Hubi password kaaga
//                             </label>
//                             <div className="relative">
//                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                     <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                                     </svg>
//                                 </div>
//                                 <input
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     id="confirmPassword"
//                                     value={form.confirmPassword}
//                                     onChange={handleChange}
//                                     onBlur={handleBlur}
//                                     className={getInputClassName("confirmPassword")}
//                                     placeholder="Gali mar kale password kaaga"
//                                     required
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={toggleConfirmPasswordVisibility}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
//                                 >
//                                     {showConfirmPassword ? (
//                                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                         </svg>
//                                     ) : (
//                                         <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                             {errors.confirmPassword && touched.confirmPassword && (
//                                 <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>
//                             )}
//                             {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
//                                 <p className="mt-1 text-sm text-green-600 dark:text-green-400">
//                                     ✓ Password waa inuu isku mid ahaadaa
//                                 </p>
//                             )}
//                         </div>

//                         {/* Terms Agreement */}
//                         <div className="flex items-start space-x-3">
//                             <input
//                                 type="checkbox"
//                                 id="terms"
//                                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mt-1"
//                                 required
//                             />
//                             <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
//                                 I agree to the{" "}
//                                 <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Terms of Service</a>
//                                 {" "}and{" "}
//                                 <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Privacy Policy</a>
//                             </label>
//                         </div>

//                         {/* Submit Button */}
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="w-full bg-blue-600 hover:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//                         >
//                             {loading ? (
//                                 <div className="flex items-center justify-center">
//                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Waxaa socda Diwaan galinta...
//                                 </div>
//                             ) : (
//                                 "Is diiwaan geli"
//                             )}
//                         </button>
//                     </form>

//                     {/* Divider */}
//                     <div className="mt-8">
//                         <div className="relative">
//                             <div className="absolute inset-0 flex items-center">
//                                 <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
//                             </div>
//                             <div className="relative flex justify-center text-sm">
//                                 <span className="px-2 bg-white/80 dark:bg-gray-800/80 text-gray-500">Haddii aad hore isku diiwaan galisay</span>
//                             </div>
//                         </div>

//                         {/* Login Link */}
//                         <div className="mt-6 text-center">
//                             <Link
//                                 to="/login"
//                                 className="inline-flex items-center text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
//                             >
//                                 Gal hadda
//                                 <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                                 </svg>
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div className="text-center mt-6">
//                     <p className="text-xs text-gray-500 dark:text-gray-400">
//                         By creating an account, you agree to our{" "}
//                         <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Terms of Service</a>
//                         {" "}and{" "}
//                         <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">Privacy Policy</a>
//                     </p>
//                 </div>
//             </div>

//             {/* Verification Popup */}
//             {showVerificationPopup && (
//                 <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
//                     <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-fade-in-up">
//                         <div className="text-center">
//                             {/* Icon */}
//                             <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
//                                 <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                 </svg>
//                             </div>
                            
//                             {/* Title */}
//                             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
//                                 <p>
//                                 Codsigaaga waa la aqbalay!
//                                </p>
//                                La xariir Nootaayo Boqole
//                             </h3>
                            
//                             {/* Message */}
//                             {/* <p className="text-black dark:text-black mb-6 font-semibold">
//                                 Your account has been created successfully but needs to be verified by our team. 
//                                 Your account will be activated within <span className="font-semibold">24 hours</span>.
//                                 You'll receive a notification once it's approved.
//                             </p> */}
                            
//                             {/* Button */}
//                             <button
//                                 onClick={handlePopupClose}
//                                 className="w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
//                             >
//                                 Continue to Login
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Custom CSS for animations */}
//             <style jsx>{`
//                 @keyframes blob {
//                     0% { transform: translate(0px, 0px) scale(1); }
//                     33% { transform: translate(30px, -50px) scale(1.1); }
//                     66% { transform: translate(-20px, 20px) scale(0.9); }
//                     100% { transform: translate(0px, 0px) scale(1); }
//                 }
//                 .animate-blob {
//                     animation: blob 7s infinite;
//                 }
//                 .animation-delay-2000 {
//                     animation-delay: 2s;
//                 }
//                 .animation-delay-4000 {
//                     animation-delay: 4s;
//                 }
//                 .animate-fade-in-up {
//                     animation: fadeInUp 0.6s ease-out;
//                 }
//                 @keyframes fadeInUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(30px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }
//             `}</style>
//         </div>
//     );
// };

// export default Register;

import React from 'react'

const Register = () => {
  return (
    <div>Register</div>
  )
}

export default Register







// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import { Document, Packer, Paragraph, TextRun } from "docx";
// import { saveAs } from "file-saver";

// const ViewAgreementDetails = () => {
//   const { id } = useParams();
//   const [agreement, setAgreement] = useState(null);
//   const [newWitness, setNewWitness] = useState("");
//   const [services, setServices] = useState([]);
  
//   // Forms for adding/editing service
//   const [serviceFormData, setServiceFormData] = useState({
//     // Mooto fields
//     type: "", chassisNo: "", modelYear: "", color: "", cylinder: "", 
//     plateNo: "", plateIssueDate: "", ownershipType: "Buug", 
//     ownershipBookNo: "", ownershipIssueDate: "",
//     // Car fields
//     engineNo: "", brand: "",
//     // Land fields
//     location: "", area: "", buildingNumber: "", landNumber: "", 
//     deedNumber: "", deedDate: "", titleNo: "",
//     // Saami fields
    
//     companyName: "", 
//     acount: "", 
//     SaamiDate: "",
//     _id: "" // For edit mode
//   });
  
//   // UI states
//   const [showServiceModal, setShowServiceModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [serviceData, setServiceData] = useState(null);
//   const [isEditMode, setIsEditMode] = useState(false);
// // ================= FETCH DATA =================
// const fetchAgreement = async () => {
//   try {
//     setIsLoading(true);

//     const res = await axios.get(`/api/agreements/${id}`);
//     setAgreement(res.data);

//     // adeegga si toos ah uga qaado agreement
//     if (res.data?.serviceRef) {
//       setServiceData(res.data.serviceRef);
//     } else {
//       setServiceData(null);
//     }

//   } catch (error) {
//     toast.error("Error fetching agreement data");
//   } finally {
//     setIsLoading(false);
//   }
// };

// // ================= FETCH SERVICES LIST (optional sidebar) =================
// const fetchServices = async () => {
//   if (!agreement?.serviceType) return;

//   try {
//     let url = "";
//     switch (agreement.serviceType) {
//       case "Mooto": url = "/api/Mootos"; break;
//       case "Car": url = "/api/cars"; break;
//       case "Land": url = "/api/lands"; break;
//       case "Saami": url = "/api/Saamis"; break;
//       default: return;
//     }

//     const res = await axios.get(url);
//     setServices(res.data);

//   } catch (error) {
//     toast.error("Error fetching services");
//   }
// };

// // ================= EFFECTS =================
// useEffect(() => {
//   fetchAgreement();
// }, [id]);

// useEffect(() => {
//   if (agreement?.serviceType) {
//     fetchServices();
//   }
// }, [agreement?.serviceType]);

//   if (isLoading) return <p className="text-center py-10">Loading...</p>;
//   if (!agreement) return <p className="text-center py-10">Agreement not found</p>;

//   // ================= AGREEMENT INFO =================
//   const updateAgreementInfo = async () => {
//     try {
//       await axios.put(`/api/agreements/${id}`, {
//         agreementDate: agreement.agreementDate,
//         serviceType: agreement.serviceType,
//         officeFee: agreement.officeFee,
//         sellingPrice: agreement.sellingPrice,
//       });
//       toast.success("Agreement updated");
//     } catch (error) {
//       toast.error("Error updating agreement");
//     }
//   };

//   // ================= PERSON OPERATIONS =================
//   const updatePerson = async (personId, data, type) => {
//     try {
//       await axios.put(`/api/persons/${personId}`, data);
//       toast.success(`${type} updated`);
//       fetchAgreement();
//     } catch (error) {
//       toast.error(`Error updating ${type}`);
//     }
//   };

//   const deletePerson = async (personId, type) => {
//     if (!window.confirm(`Delete this ${type}?`)) return;
//     try {
//       await axios.delete(`/api/persons/${personId}`);
//       toast.success(`${type} deleted`);
//       fetchAgreement();
//     } catch (error) {
//       toast.error(`Error deleting ${type}`);
//     }
//   };

//   // ================= SERVICE OPERATIONS =================
//   const handleServiceSubmit = async () => {
//     try {
//       const isUpdate = serviceFormData._id;
      
//       let endpoint = "";
//       let dataToSend = {};
      
//       switch(agreement.serviceType) {
//         case "Mooto":
//           endpoint = isUpdate ? `/api/Mootos/${serviceFormData._id}` : "/api/Mootos";
//           dataToSend = {
//             type: serviceFormData.type,
//             chassisNo: serviceFormData.chassisNo,
//             modelYear: serviceFormData.modelYear,
//             color: serviceFormData.color,
//             cylinder: serviceFormData.cylinder,
//             plateNo: serviceFormData.plateNo,
//             plateIssueDate: serviceFormData.plateIssueDate,
//             ownershipType: serviceFormData.ownershipType,
//             ownershipBookNo: serviceFormData.ownershipBookNo,
//             ownershipIssueDate: serviceFormData.ownershipIssueDate,
//           };
//           break;
//         case "Car":
//           endpoint = isUpdate ? `/api/cars/${serviceFormData._id}` : "/api/cars";
//           dataToSend = {
//             type: serviceFormData.type,
//             brand: serviceFormData.brand,
//             chassisNo: serviceFormData.chassisNo,
//             engineNo: serviceFormData.engineNo,
//             modelYear: serviceFormData.modelYear,
//             color: serviceFormData.color,
//             plateNo: serviceFormData.plateNo,
//             plateIssueDate: serviceFormData.plateIssueDate,
//           };
//           break;
//         case "Land":
//           endpoint = isUpdate ? `/api/lands/${serviceFormData._id}` : "/api/lands";
//           dataToSend = {
//             location: serviceFormData.location,
//             area: serviceFormData.area,
//             buildingNumber: serviceFormData.buildingNumber,
//             landNumber: serviceFormData.landNumber,
//             deedNumber: serviceFormData.deedNumber,
//             deedDate: serviceFormData.deedDate,
//             titleNo: serviceFormData.titleNo,
//           };
//           break;
//         case "Saami":
//           endpoint = isUpdate ? `/api/Saamis/${serviceFormData._id}` : "/api/Saamis";
//           dataToSend = {
//             companyName: serviceFormData.companyName,
//             acount: serviceFormData.acount, 
//             SaamiDate: serviceFormData.SaamiDate,
            
//           };
//           break;
//         default:
//           return;
//       }
      
//       let res;
//       if (isUpdate) {
//         res = await axios.put(endpoint, dataToSend);
//         toast.success(`${agreement.serviceType} updated successfully`);
//       } else {
//         res = await axios.post(endpoint, dataToSend);
//         toast.success(`${agreement.serviceType} added successfully`);
        
//         // Automatically link to agreement if it's new
//         await axios.put(`/api/agreements/${id}`, { serviceRef: res.data._id });
//       }
      
//       // Reset form
//       resetServiceForm();
//       setShowServiceModal(false);
//       setIsEditMode(false);
//       fetchAgreement();
//       fetchServices();
      
//     } catch (error) {
//       toast.error(`Error ${isUpdate ? 'updating' : 'adding'} ${agreement.serviceType}`);
//     }
//   };

//   const updateServiceData = async () => {
//     try {
//       let endpoint = "";
//       switch(agreement.serviceType) {
//         case "Mooto": endpoint = `/api/Mootos/${serviceData?._id}`; break;
//         case "Car": endpoint = `/api/cars/${serviceData?._id}`; break;
//         case "Land": endpoint = `/api/lands/${serviceData?._id}`; break;
//         case "Saami": endpoint = `/api/Saamis/${serviceData?._id}`; break;
//         default: return;
//       }
//       await axios.put(endpoint, serviceData);
//       toast.success(`${agreement.serviceType} updated`);
//       fetchAgreement();
//     } catch (error) {
//       toast.error(`Error updating ${agreement.serviceType}`);
//     }
//   };

//   const deleteService = async (serviceId) => {
//     if (!window.confirm(`Delete this ${agreement.serviceType}?`)) return;
//     try {
//       let endpoint = "";
//       switch(agreement.serviceType) {
//         case "Mooto": endpoint = `/api/Mootos/${serviceId}`; break;
//         case "Car": endpoint = `/api/cars/${serviceId}`; break;
//         case "Land": endpoint = `/api/lands/${serviceId}`; break;
//         case "Saami": endpoint = `/api/Saamis/${serviceId}`; break;
//         default: return;
//       }
//       await axios.delete(endpoint);
//       toast.success(`${agreement.serviceType} deleted`);
//       fetchAgreement();
//       fetchServices();
//     } catch (error) {
//       toast.error(`Error deleting ${agreement.serviceType}`);
//     }
//   };

//   const handleServiceChange = (e) => {
//     const { name, value } = e.target;
//     setServiceData({
//       ...serviceData,
//       [name]: value
//     });
//   };

//   const resetServiceForm = () => {
//     setServiceFormData({
//       type: "", chassisNo: "", modelYear: "", color: "", cylinder: "", 
//       plateNo: "", plateIssueDate: "", ownershipType: "Buug", 
//       ownershipBookNo: "", ownershipIssueDate: "",
//       engineNo: "", brand: "",
//       location: "", area: "", buildingNumber: "", landNumber: "", 
//       deedNumber: "", deedDate: "", titleNo: "",
    
//       companyName: "", 
//       acount: "", 
//       SaamiDate: "",
//       _id: ""
//     });
//   };

//   const handleEditService = (service) => {
//     setServiceFormData({
//       type: service.type || "",
//       chassisNo: service.chassisNo || "",
//       modelYear: service.modelYear || "",
//       color: service.color || "",
//       cylinder: service.cylinder || "",
//       plateNo: service.plateNo || "",
//       plateIssueDate: service.plateIssueDate?.split('T')[0] || "",
//       ownershipType: service.ownershipType || "Buug",
//       ownershipBookNo: service.ownershipBookNo || "",
//       ownershipIssueDate: service.ownershipIssueDate?.split('T')[0] || "",
//       engineNo: service.engineNo || "",
//       brand: service.brand || "",
//       location: service.location || "",
//       area: service.area || "",
//       buildingNumber: service.buildingNumber || "",
//       landNumber: service.landNumber || "",
//       deedNumber: service.deedNumber || "",
//       deedDate: service.deedDate?.split('T')[0] || "",
//       titleNo: service.titleNo || "",
     
//       companyName: service.companyName || "",
     
//       acount: service.acount || "",
//       SaamiDate: service.SaamiDate?.split('T')[0] || "",
//       _id: service._id
//     });
//     setIsEditMode(true);
//     setShowServiceModal(true);
//   };

//   // ================= WITNESS OPERATIONS =================
//   const addWitness = async () => {
//     if (!newWitness) return;
//     try {
//       await axios.put(`/api/agreements/${id}`, {
//         witnesses: [...agreement.witnesses, newWitness],
//       });
//       setNewWitness("");
//       toast.success("Witness added");
//       fetchAgreement();
//     } catch (error) {
//       toast.error("Error adding witness");
//     }
//   };

//   const deleteWitness = async (index) => {
//     try {
//       const updated = agreement.witnesses.filter((_, i) => i !== index);
//       await axios.put(`/api/agreements/${id}`, { witnesses: updated });
//       toast.success("Witness removed");
//       fetchAgreement();
//     } catch (error) {
//       toast.error("Error removing witness");
//     }
//   };

//   // ================= UI HELPERS =================
//   const renderServiceLabel = (s) => {
//     if (!s) return "Unknown";
//     switch(agreement.serviceType) {
//       case "Mooto": return `${s.plateNo || "No Plate"} - ${s.type || "No Type"}`;
//       case "Car": return `${s.plateNo || "No Plate"} - ${s.brand || s.type || "No Brand"}`;
//       case "Land": return `${s.titleNo || s.landNumber || "No Number"} - ${s.location || "No Location"}`;
//       case "Saami": return `${s.companyName || "No Company"} (${s.acount || "No Account"})`;
//       default: return "Unknown Service";
//     }
//   };

//   const getServiceFields = () => {
//     switch(agreement.serviceType) {
//       case "Mooto":
//         return ["type", "chassisNo", "modelYear", "color", "cylinder", "plateNo", "plateIssueDate", "ownershipType", "ownershipBookNo", "ownershipIssueDate"];
//       case "Car":
//         return ["type", "brand", "chassisNo", "engineNo", "modelYear", "color", "plateNo", "plateIssueDate"];
//       case "Land":
//         return ["titleNo", "location", "area", "buildingNumber", "landNumber", "deedNumber", "deedDate"];
//       case "Saami":
//         return ["companyName", "acount", "SaamiDate"];
//       default:
//         return [];
//     }
//   };

//   // ================= MODALS =================
//   const renderServiceModal = () => (
//     showServiceModal && (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-bold text-lg">
//               {isEditMode ? `Edit ${agreement.serviceType}` : `Add New ${agreement.serviceType}`}
//             </h3>
//             <button onClick={() => {
//               setShowServiceModal(false);
//               resetServiceForm();
//               setIsEditMode(false);
//             }} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
//           </div>
          
//           <div className="grid grid-cols-3 gap-4 mb-4">
//             {agreement.serviceType === "Mooto" && (
//               <>
//                 <input value={serviceFormData.type} onChange={(e) => setServiceFormData({...serviceFormData, type: e.target.value})} placeholder="Type" className="border p-2 rounded" required />
//                 <input value={serviceFormData.chassisNo} onChange={(e) => setServiceFormData({...serviceFormData, chassisNo: e.target.value})} placeholder="Chassis No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.modelYear} onChange={(e) => setServiceFormData({...serviceFormData, modelYear: e.target.value})} placeholder="Model Year" className="border p-2 rounded" type="number" required />
//                 <input value={serviceFormData.color} onChange={(e) => setServiceFormData({...serviceFormData, color: e.target.value})} placeholder="Color" className="border p-2 rounded" required />
//                 <input value={serviceFormData.cylinder} onChange={(e) => setServiceFormData({...serviceFormData, cylinder: e.target.value})} placeholder="Cylinder" className="border p-2 rounded" type="number" required />
//                 <input value={serviceFormData.plateNo} onChange={(e) => setServiceFormData({...serviceFormData, plateNo: e.target.value})} placeholder="Plate No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.plateIssueDate} onChange={(e) => setServiceFormData({...serviceFormData, plateIssueDate: e.target.value})} type="date" className="border p-2 rounded" required />
//                 <select value={serviceFormData.ownershipType} onChange={(e) => setServiceFormData({...serviceFormData, ownershipType: e.target.value})} className="border p-2 rounded">
//                   <option value="Buug">Buug</option>
//                   <option value="Kaarka">Kaarka</option>
//                 </select>
//                 <input value={serviceFormData.ownershipBookNo} onChange={(e) => setServiceFormData({...serviceFormData, ownershipBookNo: e.target.value})} placeholder="Ownership Book No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.ownershipIssueDate} onChange={(e) => setServiceFormData({...serviceFormData, ownershipIssueDate: e.target.value})} type="date" className="border p-2 rounded" required />
//               </>
//             )}
            
//             {agreement.serviceType === "Car" && (
//               <>
//                 <input value={serviceFormData.type} onChange={(e) => setServiceFormData({...serviceFormData, type: e.target.value})} placeholder="Type" className="border p-2 rounded" required />
//                 <input value={serviceFormData.brand} onChange={(e) => setServiceFormData({...serviceFormData, brand: e.target.value})} placeholder="Brand" className="border p-2 rounded" required />
//                 <input value={serviceFormData.chassisNo} onChange={(e) => setServiceFormData({...serviceFormData, chassisNo: e.target.value})} placeholder="Chassis No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.engineNo} onChange={(e) => setServiceFormData({...serviceFormData, engineNo: e.target.value})} placeholder="Engine No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.modelYear} onChange={(e) => setServiceFormData({...serviceFormData, modelYear: e.target.value})} placeholder="Model Year" className="border p-2 rounded" type="number" required />
//                 <input value={serviceFormData.color} onChange={(e) => setServiceFormData({...serviceFormData, color: e.target.value})} placeholder="Color" className="border p-2 rounded" required />
//                 <input value={serviceFormData.plateNo} onChange={(e) => setServiceFormData({...serviceFormData, plateNo: e.target.value})} placeholder="Plate No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.plateIssueDate} onChange={(e) => setServiceFormData({...serviceFormData, plateIssueDate: e.target.value})} type="date" className="border p-2 rounded" required />
//               </>
//             )}
            
//             {agreement.serviceType === "Land" && (
//               <>
//                 <input value={serviceFormData.titleNo} onChange={(e) => setServiceFormData({...serviceFormData, titleNo: e.target.value})} placeholder="Title No" className="border p-2 rounded" required />
//                 <input value={serviceFormData.location} onChange={(e) => setServiceFormData({...serviceFormData, location: e.target.value})} placeholder="Location" className="border p-2 rounded" required />
//                 <input value={serviceFormData.area} onChange={(e) => setServiceFormData({...serviceFormData, area: e.target.value})} placeholder="Area" className="border p-2 rounded" required />
//                 <input value={serviceFormData.buildingNumber} onChange={(e) => setServiceFormData({...serviceFormData, buildingNumber: e.target.value})} placeholder="Building Number" className="border p-2 rounded" required />
//                 <input value={serviceFormData.landNumber} onChange={(e) => setServiceFormData({...serviceFormData, landNumber: e.target.value})} placeholder="Land Number" className="border p-2 rounded" required />
//                 <input value={serviceFormData.deedNumber} onChange={(e) => setServiceFormData({...serviceFormData, deedNumber: e.target.value})} placeholder="Deed Number" className="border p-2 rounded" required />
//                 <input value={serviceFormData.deedDate} onChange={(e) => setServiceFormData({...serviceFormData, deedDate: e.target.value})} type="date" className="border p-2 rounded" required />
//               </>
//             )}
            
//             {agreement.serviceType === "Saami" && (
//               <>
//                 <input value={serviceFormData.companyName} onChange={(e) => setServiceFormData({...serviceFormData, companyName: e.target.value})} placeholder="Company Name" className="border p-2 rounded" required />
//                 <input value={serviceFormData.acount} onChange={(e) => setServiceFormData({...serviceFormData, acount: e.target.value})} placeholder="Account Number" className="border p-2 rounded" required />
//                 <input value={serviceFormData.SaamiDate} onChange={(e) => setServiceFormData({...serviceFormData, SaamiDate: e.target.value})} type="date" className="border p-2 rounded" required />
//               </>
//             )}
//           </div>
          
//           <div className="flex gap-2 justify-end">
//             <button onClick={() => {
//               setShowServiceModal(false);
//               resetServiceForm();
//               setIsEditMode(false);
//             }} className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">Cancel</button>
//             <button onClick={handleServiceSubmit} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
//               {isEditMode ? `Update ${agreement.serviceType}` : `Add ${agreement.serviceType}`}
//             </button>
//           </div>
//         </div>
//       </div>
//     )
//   );

//   // ================= DOWNLOAD WORD =================
//   const downloadWord = async () => {
//     const text = generateAgreementText();
//     const doc = new Document({
//       sections: [
//         {
//           children: text.split("\n").map(
//             (line) => new Paragraph({
//               children: [new TextRun({ text: line, font: "Arial" })],
//             })
//           ),
//         },
//       ],
//     });

//     const blob = await Packer.toBlob(doc);
//     saveAs(blob, `Agreement-${agreement.refNo}.docx`);
//   };

//   const generateAgreementText = () => {
//     const buyer = agreement.buyer;
//     const seller = agreement.seller;
    
//     let serviceDetails = "";
//         console.log("SERVICE TYPE:", agreement.serviceType);
//     console.log("SERVICE DATA:", serviceData);

//     switch(agreement.serviceType) {
//       case "Mooto":
//         serviceDetails = `
//           Nooca: ${serviceData?.type || ""}
//           Chassis No: ${serviceData?.chassisNo || ""}
//           Model: ${serviceData?.modelYear || ""}
//           Midab: ${serviceData?.color || ""}
//           Taargo: ${serviceData?.plateNo || ""}
//         `;
//         break;
//       case "Car":
//         serviceDetails = `
//           Nooca: ${serviceData?.type || ""}
//           Brand: ${serviceData?.brand || ""}
//           Chassis No: ${serviceData?.chassisNo || ""}
//           Engine No: ${serviceData?.engineNo || ""}
//           Model: ${serviceData?.modelYear || ""}
//           Midab: ${serviceData?.color || ""}
//           Taargo: ${serviceData?.plateNo || ""}
//         `;
//         break;
//       case "Land":
//         serviceDetails = `
//           Goobta: ${serviceData?.location || ""}
//           Aagga: ${serviceData?.area || ""}
//           Lambarka Dhisme: ${serviceData?.buildingNumber || ""}
//           Lambarka Dhulka: ${serviceData?.landNumber || ""}
//           Lambarka Deed: ${serviceData?.deedNumber || ""}
//         `;
//         break;
//       case "Saami":
//         serviceDetails = `
//           Shirkadda: ${serviceData?.companyName}
//           Akauntiga: ${serviceData?.acount }
//           Taariikhda Saami-ka: ${serviceData?.SaamiDate }
//         `;
//         break;
//     }

//                 return `
//             REF ${agreement.refNo}        ${agreement.agreementDate}

//             UJEEDDO: HESHIIS KALA GADASHO ${agreement.serviceType}

//             Maanta oo ay taariikhdu tahay ${agreement.agreementDate}, 
//             waxaa heshiis ah:

//             ISKA IIBIYAHA
//             ${seller?.fullName || ""}

//             IIBSADAHA
//             ${buyer?.fullName || ""}

//             Anigoo ah ${seller?.fullName || ""}, waxa aan ka iibiyey kuna wareejiyey 
//             ${buyer?.fullName || ""} leh sifooyinkan:

//             ${serviceDetails}

//             Qiimaha lagu kala iibsaday waa $${agreement.sellingPrice || 0} USD.

//             Sidaasi darteed, milkiyadda waxay si sharci ah ugu wareegtay iibsadaha.

//             SAXIIXA ISKA IIBIYAHA
//             ${seller?.fullName || ""}

//             SAXIIXA IIBSADAHA
//             ${buyer?.fullName || ""}

//             MARQAATIYAASHA
//             ${agreement.witnesses.map((w, i) => `${i + 1}. ${w}`).join("\n")}

//             SUGITAANKA NOOTAAYADA
//             REF: ${agreement.refNo}

//             NOOTAAYAHA
//             Dr. Maxamed Cabdiraxmaan Sheekh Maxamed
//                 `;
//             };

//   // ================= PERSON INFORMATION TABLE COMPONENT =================
//   const PersonInformationTable = ({ person, type }) => {
//     const [editMode, setEditMode] = useState(false);
//     const [editedPerson, setEditedPerson] = useState({ ...person });

//     const handleInputChange = (field, value) => {
//       setEditedPerson({
//         ...editedPerson,
//         [field]: value
//       });
//     };

//     const handleUpdate = () => {
//       updatePerson(person._id, editedPerson, type);
//       setEditMode(false);
//     };

//     const handleDelete = () => {
//       deletePerson(person._id, type);
//     };

//     const personFields = [
//       { label: "Full Name", field: "fullName", type: "text" },
//       { label: "Mother Name", field: "motherName", type: "text" },
//       { label: "Birth Place", field: "birthPlace", type: "text" },
//       { label: "Birth Year", field: "birthYear", type: "number" },
//       { label: "Address", field: "address", type: "text" },
//       { label: "Nationality", field: "nationality", type: "text" },
//       { label: "Phone", field: "phone", type: "text" },
//       { label: "Document Type", field: "documentType", type: "select" },
//       { label: "Document Number", field: "documentNumber", type: "text" }
//     ];

//     return (
//       <div className="bg-white shadow rounded-lg overflow-hidden">
//         <div className="bg-blue-50 px-4 py-3 border-b flex justify-between items-center">
//           <h3 className="font-bold text-lg text-gray-800">{type} Information</h3>
//           <div className="flex gap-2">
//             {!editMode ? (
//               <>
//                 <button 
//                   onClick={() => setEditMode(true)} 
//                   className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded text-sm"
//                 >
//                   Edit
//                 </button>
//                 <button 
//                   onClick={handleDelete} 
//                   className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
//                 >
//                   Delete
//                 </button>
//               </>
//             ) : (
//               <>
//                 <button 
//                   onClick={handleUpdate} 
//                   className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
//                 >
//                   Save
//                 </button>
//                 <button 
//                   onClick={() => {
//                     setEditMode(false);
//                     setEditedPerson({ ...person });
//                   }} 
//                   className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm"
//                 >
//                   Cancel
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
        
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <tbody>
//               {personFields.map((field, index) => (
//                 <tr key={field.field} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
//                   <td className="px-4 py-3 border-b font-medium text-gray-700 w-1/4">
//                     {field.label}
//                   </td>
//                   <td className="px-4 py-3 border-b">
//                     {editMode ? (
//                       field.type === "select" ? (
//                         <select
//                           value={editedPerson[field.field] || ""}
//                           onChange={(e) => handleInputChange(field.field, e.target.value)}
//                           className="w-full border rounded px-3 py-2"
//                         >
//                           <option value="">Select Document Type</option>
//                           <option value="Passport">Passport</option>
//                           <option value="ID Card">ID Card</option>
//                           <option value="Niira">Niira</option>
//                           <option value="Sugnan">Sugnan</option>
//                           <option value="Laysin">Laysin</option>
//                         </select>
//                       ) : field.type === "number" ? (
//                         <input
//                           type="number"
//                           value={editedPerson[field.field] || ""}
//                           onChange={(e) => handleInputChange(field.field, e.target.value)}
//                           className="w-full border rounded px-3 py-2"
//                         />
//                       ) : (
//                         <input
//                           type="text"
//                           value={editedPerson[field.field] || ""}
//                           onChange={(e) => handleInputChange(field.field, e.target.value)}
//                           className="w-full border rounded px-3 py-2"
//                         />
//                       )
//                     ) : (
//                       <span className="text-gray-900">
//                         {person[field.field] || <span className="text-gray-400 italic">Not provided</span>}
//                       </span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
        
//         {!editMode && (
//           <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 border-t">
//             Last updated: {new Date(person.updatedAt || person.createdAt).toLocaleDateString()}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="max-w-7xl mx-auto p-6">
//       {/* Header */}
//       <div className="bg-blue-600 text-white p-4 rounded mb-6">
//         <h1 className="text-2xl font-bold">Agreement Details</h1>
//         <p>REF: {agreement.refNo} | Type: {agreement.serviceType}</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//         {/* MAIN CONTENT */}
//         <div className="md:col-span-3 space-y-6">
//           {/* Agreement Info */}
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="font-bold text-lg mb-3">Agreement Information</h2>
//             <div className="grid grid-cols-4 gap-4">
//               <input
//                 type="date"
//                 value={agreement.agreementDate?.split('T')[0] || ""}
//                 onChange={(e) => setAgreement({...agreement, agreementDate: e.target.value})}
//                 className="border p-2 rounded"
//               />
//               <input value={agreement.refNo} readOnly className="border p-2 rounded bg-gray-100" placeholder="Reference No" />
//               <input
//                 type="number"
//                 value={agreement.officeFee}
//                 onChange={(e) => setAgreement({...agreement, officeFee: e.target.value})}
//                 className="border p-2 rounded"
//                 placeholder="Office Fee"
//               />
//               <input
//                 type="number"
//                 value={agreement.sellingPrice}
//                 onChange={(e) => setAgreement({...agreement, sellingPrice: e.target.value})}
//                 className="border p-2 rounded"
//                 placeholder="Selling Price"
//               />
//             </div>
//             <button onClick={updateAgreementInfo} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
//               Update Agreement
//             </button>
//           </div>

//           {/* Linked Service Details */}
//           {serviceData && (
//             <div className="bg-white shadow rounded p-4">
//               <div className="flex justify-between items-center mb-3">
//                 <h3 className="font-bold text-lg">Linked {agreement.serviceType} Details</h3>
//                 <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
//                   {renderServiceLabel(serviceData)}
//                 </span>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-3">
//                 {getServiceFields().map((field) => (
//                   <div key={field} className="flex flex-col">
//                     <label className="text-sm text-gray-600 mb-1 capitalize">{field}</label>
//                     {field.includes("Date") ? (
//                       <input
//                         type="date"
//                         name={field}
//                         value={serviceData[field]?.split('T')[0] || ""}
//                         onChange={handleServiceChange}
//                         className="border p-2 rounded"
//                       />
//                     ) : field === "ownershipType" ? (
//                       <select
//                         name={field}
//                         value={serviceData[field] || "Buug"}
//                         onChange={handleServiceChange}
//                         className="border p-2 rounded"
//                       >
//                         <option value="Buug">Buug</option>
//                         <option value="Kaarka">Kaarka</option>
//                       </select>
//                     ) : field === "SaamiPercentage" ? (
//                       <input
//                         type="number"
//                         step="0.01"
//                         name={field}
//                         value={serviceData[field] || ""}
//                         onChange={handleServiceChange}
//                         className="border p-2 rounded"
//                         placeholder={field}
//                       />
//                     ) : (
//                       <input
//                         name={field}
//                         value={serviceData[field] || ""}
//                         onChange={handleServiceChange}
//                         className="border p-2 rounded"
//                         placeholder={field}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>
              
//               <div className="flex gap-2">
//                 <button onClick={updateServiceData} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
//                   Update {agreement.serviceType}
//                 </button>
//                 <button onClick={() => deleteService(serviceData._id)} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
//                   Delete {agreement.serviceType}
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Buyer Information Table */}
//           {agreement.buyer && (
//             <PersonInformationTable person={agreement.buyer} type="Buyer" />
//           )}

//           {/* Seller Information Table */}
//           {agreement.seller && (
//             <PersonInformationTable person={agreement.seller} type="Seller" />
//           )}

//           {/* Witnesses */}
//           <div className="bg-white shadow rounded p-4">
//             <h3 className="font-bold mb-3">Witnesses</h3>
//             <div className="mb-3">
//               <div className="flex gap-2">
//                 <input
//                   value={newWitness}
//                   onChange={(e) => setNewWitness(e.target.value)}
//                   className="border p-2 flex-1 rounded"
//                   placeholder="New Witness Name"
//                 />
//                 <button onClick={addWitness} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
//                   Add Witness
//                 </button>
//               </div>
//             </div>
            
//             {agreement.witnesses?.length > 0 ? (
//               <div className="space-y-2">
//                 {agreement.witnesses.map((w, i) => (
//                   <div key={i} className="flex justify-between items-center border-b pb-2">
//                     <span>{w}</span>
//                     <button onClick={() => deleteWitness(i)} className="text-red-600 hover:text-red-800">
//                       Delete
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 italic">No witnesses added yet</p>
//             )}
            
//             <button onClick={downloadWord} className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded w-full">
//               Download Agreement (Word)
//             </button>
//           </div>
//         </div>

//         {/* RIGHT SIDEBAR */}
//         <div className="space-y-6">
//           {/* Services List */}
//           <div className="space-y-6">
//   {/* Linked Service */}
//   <div className="bg-white shadow rounded p-4">
//     <div className="flex justify-between items-center mb-3">
//       <h3 className="font-bold">{agreement.serviceType} Service</h3>
//       {!serviceData ? (
//   <button 
//     onClick={() => {
//       resetServiceForm();
//       setIsEditMode(false);
//       setShowServiceModal(true);
//     }} 
//     className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
//   >
//     + Add New
//   </button>
// ) : (
//   <span>
    
//   </span>
// )}

//     </div>
    
  
//   </div>
// </div>


          
//         </div>
//       </div>

//       {/* Service Add/Edit Modal */}
//       {renderServiceModal()}
//     </div>
//   );
// };

// export default ViewAgreementDetails;


