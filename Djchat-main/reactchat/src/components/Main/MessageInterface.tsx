import React from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

const socketUrl = 'ws://127.0.0.1:9000/ws/test/';

const MessageInterface: React.FC = () => {
  const [message, setMessage] = useState('');
  const [newMessage, setNewMessage] = useState<string[]>([]);

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => {
      console.log('Connected!');
    },
    onClose: () => {
      console.log('Closed!');
    },
    onError: () => {
      console.log('Error!');
    },
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      setNewMessage((prev) => [...prev, data.new_message]);
      setMessage('');
    },
  });

  return (
    <React.Fragment>
      <div>
        {newMessage.map((msg, index) => (
          <div key={index}>{msg}</div>
        ))}
      </div>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Enter a message:
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button
          type="submit"
          onClick={() => sendJsonMessage({ type: 'message', message })}
        >
          Send message
        </button>
      </form>
    </React.Fragment>
  );
};

export default MessageInterface;
