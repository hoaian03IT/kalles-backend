const { UserModel, RefreshTokenModel } = require("../models");
const { generateAccessToken, generateRefreshToken } = require("../../utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const os = require("os");
const hostname = os.hostname();

const femaleAvatar = `${hostname}:${process.env.POST}/static/default/images/avatar-default-image-female.png`;
const maleAvatar = `${hostname}:${process.env.POST}/static/default/images/avatar-default-image-male.png`;

class Auth {
    async signUp(req, res) {
        try {
            const { firstName, lastName, email, password, gender } = req.body;

            const hasExistedUser = await UserModel.findOne({ email });
            if (hasExistedUser) return res.status(400).json({ message: "User already exists" });

            const hashPassword = await bcrypt.hash(password, saltRounds);

            const newUser = await UserModel.create({
                firstName,
                lastName,
                email,
                password: hashPassword,
                gender,
                avatar: `http://${gender === "female" ? femaleAvatar : maleAvatar}`,
            });

            // generate new tokens
            const refreshToken = generateRefreshToken(newUser._id);
            const accessToken = generateAccessToken(newUser._id);

            // save refresh token as cookie
            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 3600000), // 30 days
            });

            await RefreshTokenModel.create({ token: refreshToken });

            res.status(200).json({
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                avatar: newUser.avatar,
                phoneNumber: newUser.phoneNumber,
                token: accessToken,
                gender,
                message: "Sign up successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }
    async signIn(req, res) {
        try {
            const { email, password } = req.body;

            const hasExistedUser = await UserModel.findOne({ email });
            if (!hasExistedUser) {
                return res.status(400).json({ message: "Email or password is wrong" });
            }

            const isMatchPW = await bcrypt.compare(password, hasExistedUser.password);
            if (!isMatchPW) {
                return res.status(400).json({ message: "Email or password is wrong" });
            }

            const refreshToken = generateRefreshToken(hasExistedUser._id);
            const accessToken = generateAccessToken(hasExistedUser._id);

            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: new Date(Date.now() + 30 * 24 * 3600000), // 30 days
            });

            await RefreshTokenModel.create({ token: refreshToken });

            res.status(200).json({
                firstName: hasExistedUser.firstName,
                lastName: hasExistedUser.lastName,
                email: hasExistedUser.email,
                avatar: hasExistedUser.avatar,
                phoneNumber: hasExistedUser.phoneNumber,
                gender: hasExistedUser.gender,
                token: accessToken,
                message: "Sign in successfully",
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async signOut(req, res) {
        try {
            const refreshToken = req.cookies["refresh-token"];
            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized 1" });
            }
            const hasExistedRefreshToken = await RefreshTokenModel.findOne({ token: refreshToken });
            if (!hasExistedRefreshToken) {
                return res.status(401).json({ message: "Unauthorized 2" });
            }
            await RefreshTokenModel.deleteOne({ token: refreshToken });

            res.status(200).json({ message: "Sign out successfully" });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }

    async refreshToken(req, res) {
        try {
            const refreshToken = req.cookies["refresh-token"];

            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized 1" });
            }

            const hasExistedRefreshToken = await RefreshTokenModel.findOne({ token: refreshToken });
            if (!hasExistedRefreshToken) {
                return res.status(401).json({ message: "Unauthorized 2" });
            }

            await RefreshTokenModel.deleteOne({ token: refreshToken });

            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
                if (err) return res.status(401).json({ message: "Unauthorized 3" });

                const newRefreshToken = generateRefreshToken(user._id);
                const accessToken = generateAccessToken(user._id);

                await RefreshTokenModel.create({ token: newRefreshToken });

                res.cookie("refresh-token", newRefreshToken, {
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    httpOnly: true,
                    secure: true,
                });
                res.status(200).json({ token: accessToken });
            });
        } catch (error) {
            res.status(500).json({ message: "Internal server error." });
        }
    }
}

module.exports = new Auth();
