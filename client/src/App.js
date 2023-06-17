import React, { useState } from 'react';
import Clients from './components/Clients';
import Chat from './components/Chat';
import ServerMessages from './components/ServerMesseges';

const ws = new WebSocket(`ws://${window.location.hostname}:6060`);

function App() {
  const [clientsList, setClientsList] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [serverMessages, setServerMessages] = useState([]);
  const [currentClient, setCurrentClient] = useState("");

  React.useEffect(() => {
      ws.onmessage = (data) => {
        const message = JSON.parse(data.data);
        const {type, msg, senderId} =  message;
        
        if (type === 'serverMessage') {
          setServerMessages(oldServerMessages => [...oldServerMessages, msg]);
        } else if (type === 'clients') {
          setClientsList(msg);
        } else if (type === 'message') {
          setAllMessages(oldMessages => [...oldMessages, {
            senderId: senderId, 
            msg: msg,
            by: 'Guest' 
          }]);
        }
      }
  });

  function setClient(id) {
    setCurrentClient(id);
    setCurrentChat(allMessages.filter(msg => msg.senderId === currentClient));
  }

  function handleSubmit(msg) {
    const message = {
      msg: msg,
      id: currentClient
    }

    setAllMessages(oldAllMessages =>
      [...oldAllMessages, {
        senderId: currentClient,
        msg: msg,
        by: 'You'
      }]
    );

    ws.send(JSON.stringify(message));
  }

  return (
    <main role="main" className="pb-3">
      <h1>PZSSI Chat</h1>
      <div className="container"> 
        <div className="row">
          <Clients clients={clientsList} setClient={setClient} />
          <Chat currentClient={currentClient} currentChat={currentChat} handleSubmit={handleSubmit}/>
        </div>
        <div className="row">
          <div id="empty-col" className="col-5"></div>
          <ServerMessages serverMessages={serverMessages} />
        </div>
      </div>
    </main>
  );
}

export default App;