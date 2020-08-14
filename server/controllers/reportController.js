const Report = require("../schema/reportSchema");
const User = require("../schema/userSchema");

exports.createNewReport = async (req, res) => {
  try {
    const newReport = new Report({
      userTo: req.body.userTo,
      userFrom: req.body.userFrom,
      title: req.body.title,
      desc: req.body.desc,
    });
    await newReport.save();
    console.log(newReport);
    const reportAddToUser = {
      id_report: newReport._id,
      title: newReport.title,
    };
    await User.updateOne(
      { _id: req.body.userTo },
      { $push: { reports: reportAddToUser } }
    );
    res.status(200).json({ message: "Udało dodać się zgłoszenie!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
