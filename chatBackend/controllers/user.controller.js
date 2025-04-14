import Conversation from "../models/conversationModels.js";
import User from "../models/user.js";

export const userLogOut = async (req, res) => {
  try {
    res.cookie("token", "", {
      maxAge: 0,
    });
    res.status(200).send({ success: true, message: "User LogOut" });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};
export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserID = req.user._id;
    const user = await User.find({
      $and: [
        {
          $or: [
            { name: { $regex: ".*" + search + ".*", $options: "i" } },
            { email: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        },
        {
          _id: { $ne: currentUserID },
        },
      ],
    })
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt")
      .select("role")
      .select("profileimage");

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};


export const getCorrentChatters = async (req, res) => {
  try {
    const currentUserID = req.user._id;
    const currenTChatters = await Conversation.find({
      participants: currentUserID,
    }).sort({
      updatedAt: -1,
    });

    if (!currenTChatters || currenTChatters.length === 0)
      return res.status(200).send([]);

    const partcipantsIDS = currenTChatters.reduce((ids, conversation) => {
      const otherParticipents = conversation.participants.filter(
        (id) => id !== currentUserID
      );
      return [...ids, ...otherParticipents];
    }, []);

    const otherParticipentsIDS = partcipantsIDS.filter(
      (id) => id.toString() !== currentUserID.toString()
    );

    const user = await User.find({ _id: { $in: otherParticipentsIDS } })
      .select("-password")
      .select("-email");

    const users = otherParticipentsIDS.map((id) =>
      user.find((user) => user._id.toString() === id.toString())
    );

    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: error,
    });
    console.log(error);
  }
};