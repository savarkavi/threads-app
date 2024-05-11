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

    let saveMessage;
    let saveConversation;

    let existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (existingConversation) {
      saveMessage = await new Message({
        conversationId: existingConversation._id,
        sender: senderId,
        reciever: recieverId,
        message,
      }).save();

      existingConversation.messages.push(saveMessage._id);
      await existingConversation.save();
    } else {
      saveConversation = new Conversation({
        participants: [senderId, recieverId],
      });

      saveMessage = await new Message({
        conversationId: saveConversation._id,
        sender: senderId,
        reciever: recieverId,
        message,
      }).save();

      saveConversation.messages.push(saveMessage._id);
      await saveConversation.save();
    }

    const newConversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    })
      .populate({ path: "participants", select: "-password -__v" })
      .populate({
        path: "messages",
        select: "-__v",
        populate: { path: "sender", select: "-password -__v" },
      })
      .select("-__v");

    const newMessage = await Message.findById(saveMessage._id)
      .select("-__v")
      .populate({ path: "sender", select: "-password -__v" })
      .populate({ path: "reciever", select: "-password -__v" });

    const recieverSocketId = getRecieverSocketId(recieverId);

    io.to(recieverSocketId).emit("newMessage", newMessage);

    res
      .status(201)
      .json({ message: "message sent", newMessage, newConversation });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
