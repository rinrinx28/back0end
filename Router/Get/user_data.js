const express = require("express");
const router = express.Router();
const fs = require("fs");

const getDataWithMonth = router.get(
  "/getLuong/:id/:month",
  async (req, res) => {
    //Check Request
    if (!req.params.month && !req.params.id)
      return res.status(404).json({
        message: "Error",
        Error: "Xin vui lòng kiểm tra lại tháng or lỗi Mã NV",
      });
    // check File;
    if (!fs.existsSync(`./luong-json/luong-nv-${req.params.month}.json`))
      return res
        .status(404)
        .json({ message: "Error", Error: "Data Luong không tồn tại" });
    const luong_file = fs.readFileSync(
      `./luong-json/luong-nv-${req.params.month}.json`,
      "utf-8",
    );
    // Filter Data In File Luong Allow Month;
    const luong = JSON.parse(luong_file);
    const nv = luong.filter(
      (v) => v["mã số nv"].split(" ").join("") === req.params.id,
    );
    return res.status(200).json({ message: "Success", data: nv });
  },
);

module.exports = {
  getDataWithMonth,
};
