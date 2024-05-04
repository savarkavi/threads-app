import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const getMessages = async (req, res) => {
  try {
  } catch (error) {}
};

export const sendMessage = async (req, res) => {
  try {
    const { recieverId } = req.params;
    const senderId = req.user._id;
    const { message } = req.body;

    const newMessage = await new Message({
      sender: senderId,
      reciever: recieverId,
      message,
    }).save();

    let existingConversation = await Conversation.findOne({
      participants: { $all: [senderId, recieverId] },
    });

    if (existingConversation) {
      existingConversation.messages.push(newMessage._id);
    } else {
      const newConversation = await new Conversation({
        participants: [senderId, recieverId],
        messages: [newMessage._id],
      }).save();
    }

    res.status(201).json({ message: "message sent", newMessage });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
