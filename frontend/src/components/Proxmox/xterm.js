import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import './xterm.css';

const TerminalComponent = ({ socket }) => {
    const terminalRef = useRef(null);
    useEffect(() => {
        const terminal = new Terminal();
        terminal.open(terminalRef.current);

        const ws = new WebSocket('ws://localhost:8080');
        ws.onopen = () => {
            console.log('Connected to WebSocket');
            ws.send('fetchVmData'); // Request VM data on connection
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            terminal.write(JSON.stringify(data, null, 2)); // Display VM data in terminal
        };

        return () => {
            ws.close();
            socket.off('data');
        };
    }, []);

    return <div ref={terminalRef} />;
};

export default TerminalComponent;