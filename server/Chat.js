const express = require('express');
const Chats = require('./Model/Schema');
const Chat = async (req, res) => {
    const { RoomId } = req.params;
  try {
    const room = await Chats.findOne({ roomId: RoomId });
    if (room && room.messages) {
      res.json(room.messages);
    } else {
      res.json([]); // Return an empty array if no messages are found
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

module.exports = Chat