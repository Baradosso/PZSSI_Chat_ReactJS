import React, { useState } from "react";

function Chat({currentClient, currentChat, handleSubmit}) {
    
    const [value, setValue] = useState("");
        
    const handleChange = (event) => {   
         setValue(event.target.value);  
    }

    let messages;
    currentChat && (messages = currentChat.map(message => <div key={message} id="chatMessages">{message}</div>));

    return(
        currentClient &&
        (<div id="chats" className="col container">
            <h6>Conversation with: {currentClient}</h6>
            <div className="row" id="chat">
                {messages}
            </div>
            <form id="msgForm" className="row" onSubmit={
                    event => {
                        event.preventDefault(); 
                        handleSubmit(value);
                        setValue("");
                    }
                }>
            
                <input type="text" 
                        id="inputBox" 
                        placeholder="Send message..." 
                        value={value}
                        onChange={handleChange}/>
            </form>
        </div>)
    );
}

export default Chat;