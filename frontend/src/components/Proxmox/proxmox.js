import React, { useEffect, useState } from 'react';
import socket from './socket';

const ProxmoxVM = ({ vmAddress }) => {
    const [vncUrl, setVncUrl] = useState('');

    useEffect(() => {
        // Emitting to fetch VM data as before
        socket.emit('fetchVmData', { vm_address: vmAddress });

        // Fetching VNC URL from your server
        // This assumes you have an endpoint that returns the noVNC URL for a given VM
        fetch(`/api/getVncUrl?vmAddress=${vmAddress}`)
            .then(response => response.json())
            .then(data => {
                setVncUrl(data.vncUrl);
            });

        return () => {
            socket.off('vmData');
        };
    }, [vmAddress]);

    return (
        <div>
            {vncUrl && (
                <iframe
                    src={vncUrl}
                    style={{ width: '100%', height: '400px', border: 'none' }}
                    title="VM noVNC View"
                ></iframe>
            )}
        </div>
    );
};

export default ProxmoxVM;
