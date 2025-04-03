const STATUS = require("../constant");
const bcrypt = require("bcrypt");
const db = require("../config/connectDB");
const otpGenerator = require('otp-generator')

const { generateUUID, generateToken } = require("../config/generateUUID");
const { sendVerificationEmail } = require("../config/sendMail");
require("dotenv").config();

async function handleCreateNewUser(req, res) {
    const { first_name, last_name, gender, email, role, password, confirm_password } = req.body;
    const user_role = role ? role: "customer";
    try {

        if(!first_name || !last_name || !gender || !email || !password) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
        }

        // Check if email already exists
        const [existingUser] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Email already exists" });
        }

        if(password !== confirm_password) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Password does not match" });
        }

        // Create a UUID and Hash the password
        const uuid = await generateUUID(user_role);
        const token = await generateToken();
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

        const getUserSQL = `SELECT user_sid, first_name, last_name, email, gender, role FROM users WHERE user_sid = ?`;
        const [userData] = await db.query(getUserSQL, [uuid]);

        // Generate OTP and insert into auth table
        const otp = await otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const sqlAuth = `INSERT INTO auth (user_sid, otp, token) VALUES (?, ?, ?)`;
        await db.query(sqlAuth, [uuid, otp, token]);

        // Send verification email
        await sendVerificationEmail(email, otp, token);
        userData[0].token = token;

        return res.status(STATUS.CREATED).json({ message: 'User Created Successfully', data: userData[0] });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function handleLoginUser(req, res) {
    const { email, role, password } = req.body;

    try {
        if (!email || !password || !role) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
        }

        // Check if user exists
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(STATUS.NOT_FOUND).json({ message: "Email/Password does not match!" });
        }

        // Check if user role matches
        if(user[0].role !== role) {
            return res.status(STATUS.UNAUTHORIZED).json({ message: "You are not allowed to login from here" });
        }

        const [auth] = await db.query("SELECT * FROM auth WHERE user_sid = ?", [user[0].user_sid]);

        // Check if user is verified
        if(!auth[0].verified_email) {
            return res.status(STATUS.UNAUTHORIZED).json({ message: "Please verify your email" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(STATUS.UNAUTHORIZED).json({ message: "Email/Password does not match!" });
        }

        const result = user.map(({ password, id, created_at, updated_at, ...rest }) => rest);
        return res.status(STATUS.OK).json({ message: "Login successful", data: result });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function handleVerifyUser(req, res) {
    const { otp } = req.body;
    const { token } = req.query

    try {
        if (!token) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Link is expired" });
        }
        if (!otp) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "All fields are required" });
        }

        // Check if OTP matches
        const [auth] = await db.query("SELECT * FROM auth WHERE token = ? AND verified_at IS NULL", [token]);

        if (auth.length === 0) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Please try again!" });
        }

        if (auth[0].otp !== otp) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Invalid Otp" });
        }

        const date = new Date().toISOString().slice(0, 19).replace("T", " ")

        // Update verified_email to true
        const sql = `UPDATE auth SET verified_email = ?, verified_at = ? WHERE token = ?`;
        await db.query(sql, [true, date, token]);

        return res.status(STATUS.NO_CONTENT).json({ message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function handleVerifyToken(req, res) {
    const { token } = req.query

    try {
        if (!token) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Link is not valid" });
        }

        // Check if token exists
        const [auth] = await db.query("SELECT user_sid FROM auth WHERE token = ? AND verified_at IS NULL", [token]);

        if (auth.length === 0) {
            return res.status(STATUS.BAD_REQUEST).json({ message: "Email Already verified!" });
        }

        return res.status(STATUS.NO_CONTENT).json({ message: "Token is valid" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    handleCreateNewUser,
    handleLoginUser,
    handleVerifyUser,
    handleVerifyToken
}