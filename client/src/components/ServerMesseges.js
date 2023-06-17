function ServerMessages({serverMessages}) {
    const messages = serverMessages.map(message => <div className="row">{message}</div>);
    return(
        <div id="server-messages" className="col container">
            {messages}
        </div>
    );
}

export default ServerMessages;