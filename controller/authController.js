const STATUS = require("../constant");
const bcrypt = require("bcrypt");
const db = require("../config/connectDB");
const otpGenerator = require('otp-generator')

const { generateUUID } = require("../config/generateUUID");
const { sendVerificationEmail } = require("../config/sendMail");
require("dotenv").config();

async function handleCreateNewUser(req, res) {
    const { first_name, last_name, gender, email, role, password } = req.body;
    const user_role = role ? role: "user";
    try {

        if(!first_name || !last_name || !gender || !email || !password) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
        
        if (existingUser.length > 0) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Email already exists" });
        }

        // Create a UUID and Hash the password
        const uuid = await generateUUID(user_role);
        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(password, salt)

        if(!hash) {
            return res.status(STATUS.INTERNAL_SERVER_ERROR).json({ message: "Please try again later" });
        }

        // Insert the user into the database
        const sql = `INSERT INTO users (user_sid, first_name, last_name, email, gender, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(sql, [uuid, first_name, last_name, email, gender, user_role, hash]);

        if (result.affectedRows === 0) {
            return res.status(STATUS.BAD_REQUEST).json({ error: 'User not found' });
        }

        // Generate OTP and insert into auth table
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const sqlAuth = `INSERT INTO auth (user_sid, otp) VALUES (?, ?)`;
        await db.query(sqlAuth, [uuid, otp]);

        // Send verification email
        await sendVerificationEmail(email, otp);

        return res.status(STATUS.CREATED).json({ message: 'User Created', userId: uuid });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

module.exports = {
    handleCreateNewUser,
}