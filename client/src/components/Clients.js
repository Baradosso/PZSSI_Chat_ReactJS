import {useState} from "react";

function Clients({clients, setClient}) {
    const [clientsList, setClientsList] = useState([]);

    setClientsList(clients);

    return (
        <div id="clients" className="col-5 container">
            {
                clientsList.map(client =>
                    <div key={client.id} className="container row client-div" onClick={() => setClient(client.id)}>
                        <div className="color-dot" style={{ backgroundColor: `#${client.color}` }}></div>
                        <h5 className="col">{client.id}</h5>
                    </div>
                )
            }
        </div>
    );
}

export default Clients;