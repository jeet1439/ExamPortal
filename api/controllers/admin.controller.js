import User from "../models/user.modal.js";

// Get all students pending verification
export const getUnverifiedStudents = async (req, res) => {
  try {
    const students = await User.find({ isVerified: false });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students", error });
  }
};

// Approve a student (Set isVerified to true)
export const approveStudent = async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: "Error approving student", error });
  }
};

// Reject a student (Delete from database)
export const rejectStudent = async (req, res) => {
  try {
    const deletedStudent = await User.findByIdAndDelete(req.params.id);

    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ message: "Student rejected successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting student", error });
  }
};
