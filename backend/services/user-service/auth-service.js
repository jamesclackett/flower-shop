const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt()
    password = await bcrypt.hash(password, salt); 
    return password;
}
    
const validatePassword = async (password, storedPassword) => {
    return await bcrypt.compare(password, storedPassword).then(res => res);
}


module.exports = {encryptPassword, validatePassword};
