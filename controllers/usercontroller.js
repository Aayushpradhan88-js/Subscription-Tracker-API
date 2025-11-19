import User from "../models/userModel.js";

const getUsers = async (_, res) => {
    try {
        const users = await User.find();
        if (!users) return res
            .status(400)
            .json({
                success: false,
                message: "Users not found"
            });

        res
            .status(200)
            .json({
                success: true,
                message: "Users found",
                data: users
            });
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        // if (!user) return res
        //     .status(400)
        //     .json({
        //         success: false,
        //         message: "user not found"
        //     });

        res
            .status(200)
            .json({
                success: true,
                message: "user found",
                data: user
            });
    }
    catch (error) {
        res
            .status(500)
            .json({
                success: false,
                message: error.message
            });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deletedId = await User.findByIdAndDelete(req.params.id);
        if (deletedId) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: "User deleted successfully"
                });
        }
    } catch (error) {
        console.log(error.message);
        return res
            .status(500)
            .json(
                {
                    message: error.message
                }
            )
    }
}

const editUser = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.send(404).json({
            messege: "Invalid id"
        })
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