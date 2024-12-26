"use client"
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
    validateConfirmPassword,
    validateEmail,
    validateName,
    validatePassword,
    validatePhone
} from '../../components/formValidation';

export default function RegisterPage() {
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [phone, setPhone] = useState("");
   const [firstNameError, setFirstNameError] = useState("");
   const [lastNameError, setLastNameError] = useState("");
   const [emailError, setEmailError] = useState("");
   const [passwordError, setPasswordError] = useState("");
   const [confirmPasswordError, setConfirmPasswordError] = useState("");
   const [phoneError, setPhoneError] = useState("");
   const [identifier, setIdentifier] = useState('')
   const [successMessage, setSuccessMessage] = useState("");
   const [error, setError] = useState("");
   const router = useRouter();

   const handleSubmit = async (e) => {
       e.preventDefault();
       const fullName = `${firstName} ${lastName}`.trim();

       const nameError = validateName(fullName);
       const emailError = validateEmail(email);
       const passwordError = validatePassword(password);
       const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
       const phoneError = validatePhone(phone);

       if (firstNameError || lastNameError || emailError || passwordError || confirmPasswordError || phoneError) {
           setFirstNameError(firstName ? "" : "กรุณากรอกชื่อ");
           setLastNameError(lastName ? "" : "กรุณากรอกนามสกุล");
           setEmailError(emailError);
           setPasswordError(passwordError);
           setConfirmPasswordError(confirmPasswordError);
           setPhoneError(phoneError);
           return;
       }

       setFirstNameError("");
       setLastNameError("");
       setEmailError("");
       setPasswordError("");
       setConfirmPasswordError("");
       setPhoneError("");

       try {
           const res = await fetch('/api/auth/register', {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify({ name: fullName, email, password, phone }),
           });

           const data = await res.json();
            //เมื่อสมัครสมาชิกผ่าน จะ แสดงข้อความสำเร็จ ล้าง error แล้วล็อคอินเข้าระบบอัตโนมัติ
           if (res.ok) {
               setSuccessMessage('สมัครสมาชิกสำเร็จ');
               setError('');
               setIdentifier(email);
               
               const result = await signIn('credentials',{
                redirect: false,
                identifier: email,  // Use email as the identifier for login
                password,
              })

                window.location.href = '/'; // Redirect to the home page after login

           } else {
               setSuccessMessage('');
               setError(data.error || 'เกิดข้อผิดพลาดระหว่างการสมัครสมาชิก');
           }
       } catch (error) {
           setError('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
       }
   };

   const handleChange = (e) => {
       const { name, value } = e.target;

       switch (name) {
           case 'firstName':
               setFirstName(value);
               setFirstNameError(value ? "" : "กรุณากรอกชื่อ");
               break;
           case 'lastName':
               setLastName(value);
               setLastNameError(value ? "" : "กรุณากรอกนามสกุล");
               break;
           case 'email':
               setEmail(value);
               setEmailError(validateEmail(value));
               break;
           case 'password':
               setPassword(value);
               setPasswordError(validatePassword(value));
               break;
           case 'confirmPassword':
               setConfirmPassword(value);
               setConfirmPasswordError(validateConfirmPassword(value, password));
               break;
           case 'phone':
               setPhone(value);
               setPhoneError(validatePhone(value));
               break;
           default:
               break;
       }
   };

   return (
       <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
           <div className="sm:mx-auto sm:w-full sm:max-w-md">
              
               <h2 className="mt-6 text-center text-3xl text-[#4eac14] ">
                   สมัครสมาชิก
               </h2>
           </div>

           <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
               <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                   <form onSubmit={handleSubmit} noValidate className="space-y-6">
                       <div className="flex space-x-4">
                           <div className="w-1/2">
                               <label className="block text-sm font-medium text-gray-700">
                                   ชื่อ <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="firstName"
                                   value={firstName}
                                   onChange={handleChange}
                                   className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                       firstNameError ? 'border-red-500' : ''
                                   }`}
                                   required
                               />
                               {firstNameError && <p className="mt-2 text-sm text-red-600">{firstNameError}</p>}
                           </div>

                           <div className="w-1/2">
                               <label className="block indent-2 text-sm font-medium text-gray-700">
                                   นามสกุล <span className="text-red-500">*</span>
                               </label>
                               <input
                                   type="text"
                                   name="lastName"
                                   value={lastName}
                                   onChange={handleChange}
                                   className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                       lastNameError ? 'border-red-500' : ''
                                   }`}
                                   required
                               />
                               {lastNameError && <p className="mt-2 text-sm text-red-600">{lastNameError}</p>}
                           </div>
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700">
                               อีเมล <span className="text-red-500">*</span>
                           </label>
                           <input
                               type="email"
                               name="email"
                               value={email}
                               onChange={handleChange}
                               className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                   emailError ? 'border-red-500' : ''
                               }`}
                               required
                           />
                           {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700">
                               รหัสผ่าน <span className="text-red-500">*</span>
                           </label>
                           <input
                               type="password"
                               name="password"
                               value={password}
                               onChange={handleChange}
                               className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                   passwordError ? 'border-red-500' : ''
                               }`}
                               required
                           />
                           {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700">
                               ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                           </label>
                           <input
                               type="password"
                               name="confirmPassword"
                               value={confirmPassword}
                               onChange={handleChange}
                               className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                   confirmPasswordError ? 'border-red-500' : ''
                               }`}
                               required
                           />
                           {confirmPasswordError && <p className="mt-2 text-sm text-red-600">{confirmPasswordError}</p>}
                       </div>

                       <div>
                           <label className="block text-sm font-medium text-gray-700">
                               เบอร์โทร <span className="text-red-500">*</span>
                           </label>
                           <input
                               type="tel"
                               name="phone"
                               value={phone}
                               onChange={handleChange}
                               maxLength={10}
                               className={`mt-1 block indent-2 w-full rounded-3xl p-1 border border-gray-400  shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${
                                   phoneError ? 'border-red-500' : ''
                               }`}
                               required
                           />
                           {phoneError && <p className="mt-2 text-sm text-red-600">{phoneError}</p>}
                       </div>

                       {successMessage && (
                           <div className="rounded-md bg-green-50 p-4">
                               <div className="flex">
                                   <div className="flex-shrink-0">
                                       <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                       </svg>
                                   </div>
                                   <div className="ml-3">
                                       <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                   </div>
                               </div>
                           </div>
                       )}

                       {error && (
                           <div className="rounded-md bg-red-50 p-4">
                               <div className="flex">
                                   <div className="flex-shrink-0">
                                       <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                           <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                       </svg>
                                   </div>
                                   <div className="ml-3">
                                       <p className="text-sm font-medium text-red-800">{error}</p>
                                   </div>
                               </div>
                           </div>
                       )}

                       <div className="flex justify-center">
                           <button
                               type="submit"
                               className="w-full md:w-1/2 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                           >
                               สมัครสมาชิก
                           </button>
                       </div>
                   </form>
               </div>
           </div>
       </div>
   );
}