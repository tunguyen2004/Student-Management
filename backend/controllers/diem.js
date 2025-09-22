const pool = require("../config/db");

exports.addScore = async (req, res) => {
  try {
    const { hoc_sinh_id, mon_hoc, hoc_ky, diem } = req.body;
    await pool.query(
      "INSERT INTO diem (hoc_sinh_id, mon_hoc, hoc_ky, diem) VALUES (?, ?, ?, ?)",
      [hoc_sinh_id, mon_hoc, hoc_ky, diem]
    );
    res.status(201).json({ message: "Thêm điểm thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getByHocSinh = async (req, res) => {
  try {
    const { hoc_sinh_id } = req.params;
    const [rows] = await pool.query(
      "SELECT * FROM diem WHERE hoc_sinh_id = ?",
      [hoc_sinh_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};
