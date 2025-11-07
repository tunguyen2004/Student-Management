// const { User } = require('../models');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// exports.register = async (req, res) => {
//   const { username, password, full_name, role, email } = req.body;

//   // Input validation
//   if (!username || !password || !full_name || !role) {
//     return res.status(400).json({ msg: 'Please provide username, password, full_name, and role' });
//   }

//   try {
//     let user = await User.findOne({ where: { username } });

//     if (user) {
//       return res.status(400).json({ msg: 'Username already exists' });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = await User.create({
//       username,
//       password: hashedPassword,
//       full_name,
//       role,
//       email, // email is optional based on your SQL
//     });

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: 3600 },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

// exports.login = async (req, res) => {
//   const { username, password } = req.body;

//   // Input validation
//   if (!username || !password) {
//     return res.status(400).json({ msg: 'Please provide username and password' });
//   }

//   try {
//     let user = await User.findOne({ where: { username } });

//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Update last_login timestamp
//     user.last_login = new Date();
//     await user.save();

//     const payload = {
//       user: {
//         id: user.id,
//         role: user.role,
//       },
//     };

//     jwt.sign(
//       payload,
//       process.env.JWT_SECRET,
//       { expiresIn: 3600 },
//       (err, token) => {
//         if (err) throw err;
//         res.json({ token });
//       }
//     );
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// };

const { User, Teacher } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const {
    username,
    password,
    full_name,
    role,
    email,
    phone,
    address,
    date_of_birth,
    gender,
  } = req.body;

  // Input validation
  if (!username || !password || !full_name || !role) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng cung cấp username, password, full_name và role",
    });
  }

  // Validate role
  if (!["admin", "teacher"].includes(role)) {
    return res.status(400).json({
      success: false,
      error: "Role phải là admin hoặc teacher",
    });
  }

  try {
    // Check if username already exists
    let user = await User.findOne({ where: { username } });
    if (user) {
      return res.status(400).json({
        success: false,
        error: "Username đã tồn tại",
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: "Email đã được sử dụng",
        });
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = await User.create({
      username,
      password: hashedPassword,
      full_name,
      role,
      email: email || null,
      phone: phone || null,
      address: address || null,
      date_of_birth: date_of_birth || null,
      gender: gender || null,
      is_active: true,
      last_login: null,
    });

    // If role is teacher, create teacher record
    if (role === "teacher") {
      // Generate teacher code (you might want a better logic for this)
      const teacherCount = await Teacher.count();
      const teacherCode = `GV${String(teacherCount + 1).padStart(3, "0")}`;

      await Teacher.create({
        user_id: user.id,
        teacher_code: teacherCode,
        specialization: req.body.specialization || null,
        degree: req.body.degree || null,
        start_date: req.body.start_date || new Date(),
      });
    }

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" }, // Changed to 1 hour
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return res.status(500).json({
            success: false,
            error: "Lỗi tạo token",
          });
        }

        // Return user info without password
        const userResponse = {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          is_active: user.is_active,
        };

        res.json({
          success: true,
          message: "Đăng ký thành công",
          token,
          user: userResponse,
        });
      }
    );
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Input validation
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng cung cấp username và password",
    });
  }

  try {
    // Find user with related teacher info
    let user = await User.findOne({
      where: { username },
      include: [
        {
          model: Teacher,
          attributes: ["id", "teacher_code", "specialization"],
        },
      ],
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Username hoặc password không đúng",
      });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(400).json({
        success: false,
        error: "Tài khoản đã bị vô hiệu hóa",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Username hoặc password không đúng",
      });
    }

    // Update last_login timestamp
    user.last_login = new Date();
    await user.save();

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) {
          console.error("JWT Error:", err);
          return res.status(500).json({
            success: false,
            error: "Lỗi tạo token",
          });
        }

        // Prepare user response
        const userResponse = {
          id: user.id,
          username: user.username,
          role: user.role,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          is_active: user.is_active,
          last_login: user.last_login,
          teacher_info: user.Teacher
            ? {
                id: user.Teacher.id,
                teacher_code: user.Teacher.teacher_code,
                specialization: user.Teacher.specialization,
              }
            : null,
        };

        res.json({
          success: true,
          message: "Đăng nhập thành công",
          token,
          user: userResponse,
        });
      }
    );
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Input validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Mật khẩu mới phải có ít nhất 6 ký tự",
    });
  }

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Người dùng không tồn tại",
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: "Mật khẩu hiện tại không đúng",
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Teacher,
          include: [
            {
              model: Class,
              as: "homeroom_class",
              attributes: ["id", "class_code", "class_name", "grade"],
            },
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Người dùng không tồn tại",
      });
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

exports.updateProfile = async (req, res) => {
  const { full_name, email, phone, address, date_of_birth, gender } = req.body;

  try {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Người dùng không tồn tại",
      });
    }

    // Check if email is being used by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          error: "Email đã được sử dụng bởi người dùng khác",
        });
      }
    }

    // Update user profile
    await user.update({
      full_name: full_name || user.full_name,
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
      date_of_birth: date_of_birth || user.date_of_birth,
      gender: gender || user.gender,
    });

    // Get updated user data without password
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: { user: updatedUser },
    });
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({
      success: false,
      error: "Lỗi server",
    });
  }
};

exports.logout = async (req, res) => {
  // Since JWT is stateless, logout is handled on client side by removing token
  // But we can implement token blacklisting if needed

  res.json({
    success: true,
    message: "Đăng xuất thành công",
  });
};
