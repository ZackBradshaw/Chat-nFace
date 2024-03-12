   const WebSocket = require('ws');
   const { fetchVmData } = require('./proxmoxService');

   const wss = new WebSocket.Server({ port: 8080 });

   wss.on('connection', function connection(ws) {
     ws.on('message', async function incoming(message) {
       console.log('received: %s', message);
       // Assuming message contains the action to fetch VM data
       if (message === 'fetchVmData') {
         const data = await fetchVmData();
         ws.send(JSON.stringify(data));
       }
     });
   });

   console.log('WebSocket server started on port 8080');