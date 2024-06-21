"use client"


import { useState } from 'react';

function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [phoneError, setPhoneError] = useState("");

    const validateName = (name) => {
        if (!name) {
            return "โปรดกรอกชื่อ";
        }
        return "";
    };

    const validateEmail = (email) => {
        if (!email.includes('@')) {
            return "อีเมลต้องมี '@' เช่น gipine@gmail.com";
        }
        if (!email.includes('.')) {
            return "อีเมลต้องมี '.' เช่น gipine@gmail.com";
        }
        return "";
    };

    const validatePassword = (password) => {
        if (!password) {
            return "โปรดกรอกรหัสผ่าน";
        }
        return "";
    };

    const validateConfirmPassword = (confirmPassword, password) => {
        if (!confirmPassword) {
            return "โปรดยืนยันรหัสผ่าน"
        }
        
        if (confirmPassword !== password) {
            return "รหัสผ่านไม่ตรงกัน";
        }
        return "";
    };

    const validatePhone = (phone) => {
        let regex = /^[a-zA-Zก-ฮ]+$/;
        if (regex.test(phone) || !phone)
            return "โปรดกรอกเบอร์โทร";
        if (phone.length < 10)
            return "โปรดกรอกเลขเบอร์โทรให้ครบถ้วน"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, password);
        const phoneError = validatePhone(phone);

        if (nameError || emailError || passwordError || confirmPasswordError || phoneError) {
            setNameError(nameError);
            setEmailError(emailError);
            setPasswordError(passwordError);
            setConfirmPasswordError(confirmPasswordError);
            setPhoneError(phoneError);
            return;
        }

        // Clear errors
        setNameError("");
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setPhoneError("");
        // Proceed with the form submission
        console.log('Form is valid. Submit the form.');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        switch (name) {
            case 'name':
                setName(value);
                setNameError(validateName(value));
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
        <div className='top-container'>
            <p>Register</p>
            <div className='mt-[50px]'>
                <form onSubmit={handleSubmit} noValidate>
                    
                    <label className='label'>ชื่อ</label>
                    <div className='input-position'>
                        <input
                            onChange={handleChange}
                            value={name}
                            className="input-box p-2  w-[500px] h-15"
                            type="text"
                            name="name"
                            placeholder="กรอกชื่อ"
                            required

                        />
                            {nameError && <div className="input-error">{nameError}</div>}           
                    </div>


                    <label className='label'>อีเมล</label>
                    <div className='input-position'>
                    <input
                        onChange={handleChange}
                        value={email}
                        className="input-box p-2  w-[500px] h-15"
                        type="email"
                        name="email"
                        placeholder="กรอกอีเมล"
                        required
                    />
                    {emailError && <div className="input-error">{emailError}</div>}
                    </div>



                    <label className='label'>รหัสผ่าน</label>
                    <div className='input-position'>
                    <input
                        onChange={handleChange}
                        value={password}
                        className="input-box p-2  w-[500px] h-15"
                        type="password"
                        name="password"
                        placeholder="กรอกรหัสผ่าน"
                        required
                    />
                    {passwordError && <div className="input-error">{passwordError}</div>}                        
                    </div>


                    <label className='label'>ยืนยันรหัสผ่าน</label>
                    <div className='input-position'>
                    <input
                        onChange={handleChange}
                        value={confirmPassword}
                        className="input-box p-2  w-[500px] h-15"
                        type="password"
                        name="confirmPassword"
                        placeholder="ยืนยันรหัสผ่าน"
                        required
                    />
                    {confirmPasswordError && <div className="input-error">{confirmPasswordError}</div>}                        
                    </div>


                    <label className='label'>เบอร์โทร</label>
                    <div className='input-position'>
                    <input
                        onChange={handleChange}
                        value={phone}
                        className="input-box p-2  w-[500px] h-15"
                        type="tel"
                        name="phone"
                        placeholder="กรอกเบอร์โทร"
                        maxlength="10"
                        required
                    />
                    {phoneError && <div className="input-error">{phoneError}</div>}                        
                    </div>


                    <button className="bg-[#4EAC14] text-white p-2 my-2 rounded w-[75px]" type="submit"> สมัคร </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;