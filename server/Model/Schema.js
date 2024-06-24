const express = require('express');
const mongoose = require('mongoose');


const postSchema =new mongoose.Schema({

    roomId : {
        type : String,
        required : true,
        unique :true
    },

    messages: [
        {
          msg: {
            type: String,
            required: true,
          },
          socketId: 
            {
              type: String,
              required: true,
            },
            username:{
              type: String,
              required: true,
            },
        },
      ],
    
});

const Chats = mongoose.model('Chats',postSchema);

module.exports= Chats