import CustomNodeIframe from "../Nodes/Custom.js";
import '../../css/dist/output.css'
import ReactFlow, { Background,
                    applyNodeChanges,
                    ReactFlowProvider,
                    addEdge,
                    updateEdge,
                    applyEdgeChanges,
                    Controls,
                    MarkerType
                    } from 'react-flow-renderer';
import React ,{ useState, useCallback, useRef, useEffect } from 'react';
import Navbar from '../Navagation/navbar';
import CustomEdge from '../Edges/Custom'
import CustomLine from "../Edges/CustomLine.js";
import { useThemeDetector } from '../../helper/visual'
import {CgMoreVerticalAlt} from 'react-icons/cg'
import {BsFillEraserFill} from 'react-icons/bs' 
import {FaRegSave} from 'react-icons/fa'
import ProxmoxVM from '../Proxmox/proxmox.js';
import EmbedNode from "../Nodes/EmbedNode.js"; 

const NODE = {
    custom : CustomNodeIframe,
    proxmoxVM: ProxmoxVM,
    embed: EmbedNode, 
  }

const EDGE = {
    custom : CustomEdge
}


export default function ReactEnviorment() {

    const [theme, setTheme] = useState(useThemeDetector)
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([])
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const reactFlowWrapper = useRef(null);
    const [tool, setTool] = useState(false)
    const [showProxmoxForm, setShowProxmoxForm] = useState(false);

    const deleteNodeContains = useCallback((id) => setNodes((nds) => nds.filter(n => !n.id.includes(`${id}-`))), [setNodes]);
    const deleteEdge = useCallback((id) => setEdges((eds) => eds.filter(e => e.id !== id)), [setEdges]);
    const deleteNode = useCallback((id) => setNodes((nds) => nds.filter(n => n.id !== id)), [setNodes]);

    useEffect(() => {
      const restore = () => {
        const flow = JSON.parse(localStorage.getItem('flowkey'));
        
        if(flow){
          const updatedNodes = flow.nodes.map((nds) => ({ ...nds, data: { ...nds.data, delete: deleteNode }}));
          const updatedEdges = flow.edges.map((eds) => ({ ...eds, data: { ...eds.data, delete: deleteEdge }}));
          setNodes(updatedNodes || []);
          setEdges(updatedEdges || []);
        }
      }
      restore();
    },[deleteNode, deleteEdge]);

    const onNodesChange = useCallback(
      (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
      [setNodes]
    );
  
    const onEdgesChange = useCallback(
      (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
      [setEdges]
    );

    const onEdgeUpdate = useCallback(
      (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
      [setEdges]
    );

    const onConnect = useCallback(
      (params) => {
        setEdges((els) => addEdge({...params, type: "custom", animated : true, style : {stroke : "#00FF4A", strokeWidth : "6"}, markerEnd: {type: MarkerType.ArrowClosed, color : "#00FF4A"}, data : { delete : deleteEdge}}, els))
        fetch("http://localhost:2000/api/append/connection", {method : "POST", mode : 'cors', headers : { 'Content-Type' : 'application/json' }, body: JSON.stringify({"source": params.source, "target" : params.target})}).then( res => {
          console.log(res)
        }).catch(error => {
          console.log(error)
        })
      },
      [setEdges, deleteEdge]
    );

    const onDragOver = useCallback((event) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    }, []);

    const onSave = useCallback(() => {
      if (reactFlowInstance) {
        const flow = reactFlowInstance.toObject();
        alert("The current nodes have been saved into the localstorage 💾")
        localStorage.setItem('flowkey', JSON.stringify(flow));
        var labels = [];
        var colour = [];
        var emoji = [];
        flow.nodes.forEach((node) => {
          if (!labels.includes(node.data.label)) {
            colour.push(node.data.colour);
            emoji.push(node.data.emoji);
            labels.push(node.data.label);
          }
        });
        localStorage.setItem('colour', JSON.stringify(colour));
        localStorage.setItem('emoji', JSON.stringify(emoji));
      }
    }, [reactFlowInstance]);

    const onErase = useCallback(() => {
      const flow = localStorage.getItem("flowkey")
      if (reactFlowInstance && flow){
        alert("The current nodes have been erased from the localstorage")
        localStorage.removeItem("flowkey")
        localStorage.removeItem('colour')
        localStorage.removeItem('emoji')
      }
    },[reactFlowInstance]);

    const onDrop = useCallback(
      (event) => {
        event.preventDefault();

        if(event.dataTransfer.getData('application/reactflow')  !== ""){
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          const type = event.dataTransfer.getData('application/reactflow');
          const item  = JSON.parse(event.dataTransfer.getData('application/item'));
          const style = JSON.parse(event.dataTransfer.getData('application/style'));
          if (typeof type === 'undefined' || !type) {
            return;
          }
    
          const position = reactFlowInstance.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          });

          let newNode;
          if (type === 'embed') {
            newNode = {
              id: `embed-${nodes.length + 1}`,
              type: 'embed',
              position,
              data: { url: item.url, width: item.width, height: item.height },
            };
          } else if (type === 'customProxmox') {
            newNode = {
                id: `proxmox-vm-${nodes.length + 1}`,
                type: 'customProxmox',
                position,
                data: { vmAddress: item.vmAddress },
            };
          } else {
            newNode = {
              id: `${item.name}-${nodes.length+1}`,
              type,
              position,
              dragHandle : `#draggable`,
              data: { label: `${item.name}`, host : `${item.host}`, colour : `${style.colour}`, emoji : `${style.emoji}`, delete : deleteNode },
            };
          }
  
          if (newNode) {
            setNodes((nds) => nds.concat(newNode));
          }
      }
      },
      [reactFlowInstance, nodes, deleteNode]);

    const addProxmoxVMNode = (vmAddress) => {
        const newNode = {
            id: `proxmox-vm-${nodes.length + 1}`,
            type: 'proxmoxVM',
            position: { x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight },
            data: { vmAddress },
        };
        setNodes((nds) => nds.concat(newNode));
        setShowProxmoxForm(false);
    };

    return (
      <div className={`${theme ? "dark" : ""}`}>          
        <div className={` absolute text-center ${tool ? "h-[203.3333px]" : "h-[41px]"} overflow-hidden w-[41px] text-4xl top-4 right-5 z-50 cursor-default select-none bg-white dark:bg-stone-900 rounded-full border border-black dark:border-white duration-500`}  >
          <CgMoreVerticalAlt className={` text-black dark:text-white ${tool ? "-rotate-0 mr-auto ml-auto mt-1" : " rotate-180 mr-auto ml-auto mt-1"} duration-300`} onClick={() => setTool(!tool)}/>
          <h1 title={theme ? 'Dark Mode' : 'Light Mode'} className={`p-4 px-1 pb-0 ${tool ? "visible" : "invisible"} text-3xl`} onClick={() => setTheme(!theme)} >{theme  ? '🌙' : '☀️'}</h1> 
          <FaRegSave title="Save" className={`mt-6 text-black dark:text-white ${tool ? "visible" : " invisible"} ml-auto mr-auto `} onClick={() => onSave()}/> 
          <BsFillEraserFill title="Erase" className={`mt-6 text-black dark:text-white ml-auto mr-auto ${tool ? "visible" : " invisible"} `} onClick={() => onErase()}/>
        </div>
        {showProxmoxForm && (
            <form onSubmit={(e) => {
                e.preventDefault();
                addProxmoxVMNode(e.target.vmAddress.value);
            }} className="absolute top-10 left-10 z-50">
                <input name="vmAddress" type="text" placeholder="Enter Proxmox VM Address" required className="p-2"/>
                <button type="submit" className="p-2 bg-blue-500 text-white">Add VM</button>
            </form>
        )}
        <button onClick={() => setShowProxmoxForm(true)} className="absolute top-10 right-10 z-50 p-2 bg-green-500 text-white">Add Proxmox VM</button>
        <div className={`flex h-screen w-screen ${theme ? "dark" : ""} transition-all`}>    
          <ReactFlowProvider>
          <Navbar onDelete={deleteNodeContains} colour={JSON.parse(localStorage.getItem('colour'))} emoji={JSON.parse(localStorage.getItem('emoji'))}/>
            <div className="h-screen w-screen" ref={reactFlowWrapper}>
              <ReactFlow nodes={nodes} edges={edges} nodeTypes={NODE} edgeTypes={EDGE} onNodesChange={onNodesChange} onNodesDelete={deleteNode} onEdgesChange={onEdgesChange} onEdgeUpdate={onEdgeUpdate} onConnect={onConnect} onDragOver={onDragOver} onDrop={onDrop} onInit={setReactFlowInstance} connectionLineComponent={CustomLine} fitView>
                <Background variant='dots' size={1} className=" bg-white dark:bg-neutral-800"/>
                <Controls/>
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </div>
    );
  }
