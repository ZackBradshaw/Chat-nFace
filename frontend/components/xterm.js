   import React, { useEffect, useRef } from 'react';
   import { Terminal } from 'xterm';
   import 'xterm/css/xterm.css';

   const TerminalComponent = ({ socket }) => {
     const terminalRef = useRef(null);

     useEffect(() => {
       const terminal = new Terminal();
       terminal.open(terminalRef.current);
       socket.on('data', data => {
         terminal.write(data);
       });

       return () => socket.off('data');
     }, [socket]);

     return <div ref={terminalRef} />;
   };

   export default TerminalComponent;