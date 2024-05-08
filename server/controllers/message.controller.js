import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getRecieverSocketId, io } from "../socket/socket.js";

export const getMessages = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    }).populate({ path: "messages" });

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;

    const savedMessage = await new Message({
      sender: senderId,
      reciever: recieverId,
      message,
    }).save();

    let existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (existingConversation) {
      existingConversation.messages.push(savedMessage._id);
      await existingConversation.save();
    } else {
      const savedConversation = await new Conversation({
        participants: [senderId, recieverId],
        messages: [savedMessage._id],
      }).save();
    }

    const newMessage = await Message.findById(savedMessage._id)
      .select("-__v")
      .populate({ path: "sender", select: "-password -__v" })
      .populate({ path: "reciever", select: "-password -__v" });

    const recieverSocketId = getRecieverSocketId(recieverId);

    io.to(recieverSocketId).emit("newMessage", newMessage);

    res.status(201).json({ message: "message sent", newMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
