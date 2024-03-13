from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import socket
import argparse
# import importlib
# import asyncio 
# from multiprocessing import Process
import gradio as gr
import requests

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

def portConnection(port : int):
    s = socket.socket(
        socket.AF_INET, socket.SOCK_STREAM)
            
    result = s.connect_ex(("localhost", port))
    if result == 0: return True
    return False


global visable
global process_map
visable = []
process_map = {}

@app.route("/")
def Root():
    return jsonify({"message" :"everything is up amd running... 🚀",})

# def IS_STREAMABLE():
#     pass

# async def subprocess(metadata):
#     # fetch the module
    
#     try :
#         DONT_LISTEN_TO = ['GradioModule', 'register']
#         mode = importlib.import_module(metadata)
#         fn, names = [], []
#         for fn_key in dir(mode):
#             # print(fn_key, type(getattr(mode, fn_key)))
#             attr = getattr(mode, fn_key)
#             # p = print(dir(attr)) if fn_key == "Hello_World" else None
#             if callable(attr) and not fn_key.startswith("__") and  "__decorator__" in dir(attr) and attr.__decorator__ == "__gradio__":
#                 fn.append((getattr(mode, fn_key)))
#                 names.append(getattr(mode, fn_key)().__name__)
#         print(fn, names)
#     except Exception as e:
#         print(e) 
#         raise e 
    
    
#     asyncio.create_task(src.resources.module.tabularGradio(fn, names, listen=2000, metadata=metadata, name=metadata.split('.')[-1]))
#     return 

# @app.route("/api/append/module" , methods=["POST"])
# def append_module():

#     current = request.json
#     # task_cb = Process(target=subprocess, args=(current['module'],))
#     asyncio.run(subprocess(current['module']))
#     # run module until 
#     return jsonify({"executed" : True,
#                     "process" : "ended" })



@app.route("/api/append/port" , methods=["POST"])
def append_port():
    current = request.json
    visable.append(current)
    return jsonify({"executed" : True})

@app.route("/api/append/connection", methods=["POST"])
def append_connection():
    current = request.json
    return jsonify({"executed" : True})

@app.route("/api/remove/port" , methods=["POST"])
def remove_port():
    current = request.json
    print(current)
    visable.remove(current)
    return jsonify({"executed" : True,
                    "ports" : current['port']})


# @app.route("/api/remove/module" , methods=["POST"])
# def remove_module():
#     current = request.json
   
#     visable.remove(current)
#     process_map[current["kwargs"]["metadata"]].terminate()
#     return jsonify({"executed" : True,
#                     "ports" : current['port']})

@app.route("/api/open/ports", methods=["GET"])
def open_ports():
    # Assuming 'visable' is a list of open ports information
    return jsonify(visable)

## Proxmox API

@app.route('/api/addProxmoxVM', methods=['POST'])
def add_proxmox_vm():
    data = request.json
    # Placeholder for saving or processing Proxmox VM data
    # This should include logic to handle the data received from the frontend
    return jsonify({"status": "VM added"}), 200

@app.route('/api/getVncUrl', methods=['GET'])
def get_vnc_url():
    vm_address = request.args.get('vmAddress')
    # Placeholder for fetching VNC URL based on VM address
    # This should include logic to retrieve the VNC URL for the specified VM
    vnc_url = "https://example.com/vnc/" + vm_address  # Example VNC URL
    return jsonify({"vncUrl": vnc_url})

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('fetchVmData')
def handle_fetch_vm_data(data):
    # Fetch VM data from Proxmox using the provided VM address
    # The actual fetching should be adapted to match your Proxmox setup and API
    try:
        vm_data = requests.get(f"http://{data['vm_address']}/api2/json", verify=False)  # Example request
        emit('vmData', vm_data.json())
    except requests.exceptions.RequestException as e:
        print(f"Error fetching VM data: {e}")
        emit('vmData', {'error': 'Failed to fetch VM data'})

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0')

## Gradio API
if __name__ == "__main__":

    parser = argparse.ArgumentParser()
    parser.add_argument("-p", "--port", help="location of flask api port on local host", default=5000)
    args = parser.parse_args()
    app.run(host="0.0.0.0", port=args.port, debug=True)

   

