import User from "../models/userModel.js";

//----------Get All DB Users---------//
const getUsers = async (_, res) => {
    try {
        const users = await User.find();
        if (!users) return res.status(400).json({
            success: false,
            message: "Users not found"
        });

        return res.status(200).json({
            success: true,
            data: users,
            message: "fetched all users successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.stack
        });
    };
};

//----------Get user with ID---------//
const getUser = async (req, res) => {
    try {
        const user = await User
            .findById(req.params.id)
            .select("-password");
        if (!user) return res.status(400).json({
            success: false,
            message: "user not found"
        });

        return res.status(200).json({
            success: true,
            data: user,
            message: "user found"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    };
};

//----------Delete user with ID---------//
const deleteUser = async (req, res) => {
    try {
        const deletedId = await User.findByIdAndDelete(req.params.id);
        if (deletedId) {
            return res.status(200).json({
                success: true,
                message: "User deleted successfully"
            });
        };
    } catch (error) {
        return res.status(500).json({
            message: "internal server error",
            error: error.message
        })
    };
};

//----------Edit user with ID---------//
const editUser = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.send(404).json({
            messege: "Invalid id"
        });
    };
    const { name, email } = req.body;

    try {
        const userId = await User.findByIdAndUpdate(id, {
            name,
            email
        });
        if (!userId) {
            return res.status(401).json({
                messege: "Unable to find userId"
            });
        };

        const fetchUser = await User.findOne({ name });
        if (!fetchUser) return null;

        return res.status(200).json({
            success: true,
            messege: `${fetchUser.name} you're details updated successfully`
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "internal server error, unable to update user",
            error: error.stack
        });
    };
};

export { getUsers, getUser, deleteUser, editUser };