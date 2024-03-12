   const axios = require('axios');

   const PROXMOX_API_URL = 'https://your-proxmox-server:8006/api2/json';
   const AUTH_TOKEN = 'PVEAPIToken=yourToken';

   async function fetchVmData() {
     try {
       const response = await axios.get(`${PROXMOX_API_URL}/nodes/yourNode/qemu`, {
         headers: { Authorization: AUTH_TOKEN },
       });
       return response.data;
     } catch (error) {
       console.error('Error fetching VM data from Proxmox:', error);
       return null;
     }
   }

   module.exports = { fetchVmData };