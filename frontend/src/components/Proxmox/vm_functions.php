<?php
require 'vendor/autoload.php';

use ProxmoxVE\Proxmox;
use GuzzleHttp\Client;

function PreviewVnc($vmID, $nodeid) {
    // pass in the vmid and nodeid from the functions above
    $node = $nodeid;
    $vmid = $vmID;

    // set up the proxmox creds and login
    $credentials = [
        'hostname' => 'proxmox-domain', // Also can be an IP
        'username' => 'api',
        'password' => 'password',
    ];

    $host = $credentials['hostname'];

    $proxmox = new Proxmox($credentials);

    if ($login = $proxmox->login()) {
      
        $ticket = $login->getTicket();
    
        $config = $proxmox->create("/nodes/$node/qemu/$vmid/vncproxy", [
            'websocket' => 1, // Start websocket proxy
        ]);


        $websock = $proxmox->get("/nodes/$node/qemu/$vmid/vncwebsocket", [
 
            'vncticket' => $config['data']['ticket'],
            'port' => $config['data']['port']
        ]);



        $src_href = 'https://'.$host.':8006/?console=kvm&novnc=1&node='.$node.'&resize=1&vmid='.$vmid.'&path=api2/json/nodes/'.$node.'/qemu/'.$vmid.'/vncwebsocket/port/'.$config['data']['port'].'"/vncticket/"'.$ticket;
        echo '<iframe src="'.$src_href.'" frameborder="0" scrolling="no" width="100%" height="100%"></iframe>';
    }
}

?>