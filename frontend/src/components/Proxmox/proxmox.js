import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import 'xterm/css/xterm.css';
import socket from './socket';

const ProxmoxVM = ({ vmAddress }) => {
    const terminalRef = useRef(null);
    const terminal = useRef(new Terminal());

    useEffect(() => {
        terminal.current.open(terminalRef.current);
        terminal.current.writeln('Connecting to VM...');

        socket.emit('fetchVmData', { vm_address: vmAddress });

        socket.on('vmData', (data) => {
            terminal.current.writeln(data);
        });

        return () => {
            socket.off('vmData');
            terminal.current.dispose();
        };
    }, [vmAddress]);

    return <div ref={terminalRef} />;
};

export default ProxmoxVM;
