export function validateName(name){
    if (!name) {
        return "โปรดกรอกชื่อ";
    }
    return "";
};

export function validateEmail(email){
   let regex = /^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/;
    if(regex.test(email) == false) {
        return "โปรดกรอกอีกเมลให้ถูกต้อง"
    }
    if (!email.includes('@')) {
        return "อีเมลต้องมี '@' เช่น gipine@gmail.com";
    }
    if (!email.includes('.')) {
        return "อีเมลต้องมี '.' เช่น gipine@gmail.com";
    }
    return "";
};

export function validatePassword(password){
    if (!password) {
        return "โปรดกรอกรหัสผ่าน";
    }
    return "";
};

export function validateConfirmPassword(confirmPassword, password){
    if (!confirmPassword) {
        return "โปรดยืนยันรหัสผ่าน"
    }
    
    if (confirmPassword !== password) {
        return "รหัสผ่านไม่ตรงกัน";
    }
    return "";
};

export function validatePhone(phone){
    let regex = /^[a-zA-Zก-ฮ]+$/;
    const checkChar = (phone) => {
        for (let i = 0; i < phone.length; i++) {
            // Check if the character is alphanumeric
            if (/[a-zA-Zก-ฮ]/.test(phone[i])) {
                return true; // Return true if any character is a letter
            }
        }
        return false; // Return false if no alphabetic character is found            
    } 
    if (checkChar(phone)==true) {
        return "เบอร์โทรไม่สามารถมีตัวอักษร"
    }
    if (!phone) {
        return "โปรดกรอกเบอร์โทร 10 หลัก"
    } 

    if (regex.test(phone) || !phone) {
        return "โปรดกรอกเบอร์โทร";            
    }
    if (phone.length < 10) {
        return "โปรดกรอกเลขเบอร์โทรให้ครบถ้วน 10 หลัก"            
    }
    return "";
};