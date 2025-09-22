const pool = require("../config/db");

exports.getAll = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM hocsinh");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.create = async (req, res) => {
  try {
    const { ho_ten, lop } = req.body;
    await pool.query("INSERT INTO hocsinh (ho_ten, lop) VALUES (?, ?)", [
      ho_ten,
      lop,
    ]);
    res.status(201).json({ message: "Thêm học sinh thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { ho_ten, lop } = req.body;
    await pool.query("UPDATE hocsinh SET ho_ten = ?, lop = ? WHERE id = ?", [
      ho_ten,
      lop,
      id,
    ]);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM hocsinh WHERE id = ?", [id]);
    res.json({ message: "Xóa thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
