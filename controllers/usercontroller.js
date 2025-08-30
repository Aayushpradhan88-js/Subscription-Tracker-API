import User from "../models/usermodel.js";

export const getUsers = async (_, res) => {
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

export const getUser = async (req, res) => {
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

export const deleteUser = async(req, res) => {
    try {
        const deletedId = await User.findByIdAndDelete(req.parama.id);

        if(deletedId) {
            return res
                .status(200)
                .json({
                    success: true,
                    message: "User deleted successfully"
                });
        }
    } catch (error) {
        conosle.log(error.message);
        return res
        .status(500)
        .json(
            {
                message: error.message
            }
        )
    }
}