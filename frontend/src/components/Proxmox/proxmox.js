import React, { useEffect, useRef, useState } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import socket from './socket';

const ProxmoxVM = ({ vmAddress }) => {
    const terminalRef = useRef(null);
    const terminal = useRef(new Terminal());
    const [vncUrl, setVncUrl] = useState('');

    useEffect(() => {
        terminal.current.open(terminalRef.current);
        terminal.current.writeln('Connecting to VM...');

        // Emitting to fetch VM data as before
        socket.emit('fetchVmData', { vm_address: vmAddress });

        // Listening for VM data to write to the terminal
        socket.on('vmData', (data) => {
            terminal.current.writeln(data);
        });

        // Fetching VNC URL from your server
        // This assumes you have an endpoint that returns the noVNC URL for a given VM
        fetch(`/api/getVncUrl?vmAddress=${vmAddress}`)
            .then(response => response.json())
            .then(data => {
                setVncUrl(data.vncUrl);
            });

        return () => {
            socket.off('vmData');
            terminal.current.dispose();
        };
    }, [vmAddress]);

    return (
        <div>
            <div ref={terminalRef} />
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
