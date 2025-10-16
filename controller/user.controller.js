import asyncHandler from "express-async-handler"
import authService from "../services/user.services.js"

// LOGIN
export const loginUser = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body, res)
  res.json(data)
})

// REGISTER
export const registerUser = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body, res)
  res.status(201).json(data)
})

// REFRESH TOKEN
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const { accessToken } = req.cookies;
  const { refreshToken } = req.body;

  const data = await authService.refreshToken({ accessToken, refreshToken }, res);
  console.log(data, "data")
  res.status(200).json(data);
});

// FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPassword(req.body, req)
  res.status(200).json(data)
})

// RESET PASSWORD
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetToken } = req.params
  const data = await authService.resetPassword(resetToken, req.body.password, res)
  res.json(data)
})

// LOGOUT
export const logoutUser = asyncHandler(async (req, res) => {
  const data = authService.logout(res)
  res.status(200).json(data)
})
