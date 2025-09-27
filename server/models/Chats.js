import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
  _id: {
    type: String,
    require: true,
  },
  messages: {
    type: Array,
  }
});

const Chats = mongoose.model("chats", chatSchema);
export default Chats;