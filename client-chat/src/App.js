import './App.css';
import React, {useState} from "react";

const ws = new WebSocket(`ws://${window.location.hostname}:6060`);

function App() {
    const [clients, setClients] = useState([]);
    const [serverMessages, setServerMessages] = useState([]);
    const [allClientsMessages, setAllClientsMessages] = useState([]);
    const [currentClientMessages, setCurrentClientMessages] = useState([]);
    const [currentClient, setCurrentClient] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');

    let messagesEnd;

    function handleSubmit() {
        const message = {
            msg: currentMessage,
            id: currentClient
        }

        setAllClientsMessages(oldAllClientsMessages =>
            [...oldAllClientsMessages, {
                senderId: currentClient,
                msg: currentMessage,
                by: 'You'
            }]
        );

        ws.send(JSON.stringify(message));
    }

    function setClient(id) {
        setCurrentClient(id);
    }

    React.useEffect(() => {
        setCurrentClientMessages(allClientsMessages.filter(msg => msg.senderId === currentClient));
        currentClient && messagesEnd.scrollIntoView();
    }, [allClientsMessages, currentClient, messagesEnd])

    React.useEffect(() => {
        ws.onmessage = (data) => {
            const message = JSON.parse(data.data);
            const {type, msg, senderId} = message;

            if (type === 'serverMessage') {
                setServerMessages(oldServerMessages => [...oldServerMessages, msg]);
            } else if (type === 'clients') {
                setClients(msg);
            } else if (type === 'message') {
                setAllClientsMessages(oldClientsMessages => [...oldClientsMessages, {
                    senderId: senderId,
                    msg: msg,
                    by: 'Guest'
                }]);
            }
        }
    });

    const clientsList = clients.map(client =>
        <div key={client.id} className="container row client-div" onClick={() => setClient(client.id)}>
            <div className="color-dot" style={{backgroundColor: `#${client.color}`}}></div>
            <h5 className="col">{client.id}</h5>
        </div>
    );

    const serverMessagesList = serverMessages.map((serverMessage, id) =>
        <div key={id} className="row">{serverMessage}</div>
    );

    const messages = currentClientMessages.map((currentClientMessage, id) =>
        <div key={id} className="row">{currentClientMessage.by + ': ' + currentClientMessage.msg}</div>
    );

    const currentChat = currentClient && (
        <div id="chats" className="col container">
            <h6>Conversation with: {currentClient}</h6>
            <div className="row container" id="chat">
                <div className="col">
                    {messages}
                    <div ref={(el) => {
                        messagesEnd = el
                    }}></div>
                </div>
            </div>
            <form id="msgForm" className="row" onSubmit={
                event => {
                    event.preventDefault();
                    handleSubmit();
                    setCurrentMessage("")
                }
            }>
                <input type="text"
                       id="inputBox"
                       placeholder="Send message..."
                       value={currentMessage}
                       onChange={(event) => setCurrentMessage(event.target.value)}/>
            </form>
        </div>
    );

    return (
        <main className="pb-3">
            <h1>PZSSI Chat</h1>
            <div className="container">
                <div className="row">
                    <div id="clients" className="col-5 container">
                        {clientsList}
                    </div>
                    {currentChat}
                </div>
                <div className="row">
                    <div id="empty-col" className="col-5"></div>
                    <div id="server-messages" className="col container">
                        {serverMessagesList}
                    </div>
                </div>
            </div>
        </main>
    );
}

export default App;
