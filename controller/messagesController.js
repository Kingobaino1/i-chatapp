import Message from '../model/messageModel.js';

const addMessage = async(req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if(data) {
      return res.status(200).json({
        message: 'Message was added successfully',
      })
    };
    return res.json({ message: 'Message was not added to the database'});
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

};

const getMessages = async(req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await Message.find({
      users: {
        $all: [from, to]
      }
    }).sort({ updatedAt: 1 })
    const projectedMsgs = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      }
    });
    res.json(projectedMsgs);
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }

};

export {
  addMessage,
  getMessages,
}
