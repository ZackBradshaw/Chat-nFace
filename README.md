![Chat'nFace Banner](images/chatty.png)


## What Is Chat'nFace
**Chat'nFace is a web application designed to enhance the user experience of Gradio apps by providing a chat interface. It allows users to configure, suggest, and use Gradio apps through natural language processing (NLP), making it more accessible and interactive.**

## Table Of Contents 📚
 - [**Introduction**](#introduction-)
 - [**Features**](#features-)
 - [**Installation**](#installation-)
 - [**Usage**](#usage-)
 - [**Support and Contribution**](#support-and-contribution-)
 - [**License**](#license-)

## Introduction 🏛️
Chat'nFace is an innovative interface that integrates with Gradio applications to offer a conversational approach to interacting with machine learning models. It leverages NLP to understand user queries and provide appropriate responses, facilitating a more intuitive way to explore and utilize Gradio apps.

## Features 🌐
- **NLP-Driven Chat Interface**: Engage with Gradio apps using natural language commands.
- **Dynamic Configuration**: Easily configure Gradio app settings through the chat interface.
- **Interactive Suggestions**: Receive suggestions and guidance on how to use Gradio apps effectively.
- **Seamless Integration**: Designed to work harmoniously with existing Gradio interfaces.

## Proxmox VMs and Clusters Integration via xterm.js

Chat'nFace now supports interacting with Proxmox VMs and clusters directly through an xterm.js terminal interface. This feature allows users to view and manage their VMs and clusters within the Chat'nFace application.

### Setup and Configuration

#### Frontend

1. Ensure `xterm.js` and `xterm-addon-fit` are installed in your project.
2. Integrate the `TerminalComponent` into your application where you want the terminal to appear.

#### Backend

1. Set up a WebSocket server that the frontend can connect to for real-time data streaming.
2. Implement Proxmox API integration in your backend service. This will involve authenticating with your Proxmox server and fetching or sending data as needed.

- **xterm.js**: [xterm.js Documentation](https://xtermjs.org/docs/)

- **Proxmox API**: [Proxmox API Documentation](https://pve.proxmox.com/pve-docs/api-viewer/index.html)

### Usage

To use the Proxmox integration, navigate to the terminal within Chat'nFace and enter your commands. The terminal will communicate with your Proxmox server, allowing you to manage your VMs and clusters directly from the Chat'nFace interface.

### Support

For support with the Proxmox integration, please join our Discord community or contact us directly through the provided channels.
## Installation 🛠️
To get started with Chat'nFace, clone the repository and follow the setup instructions provided in the documentation.

## Usage 🖥️
Once installed, you can start Chat'nFace and interact with your Gradio apps through the chat interface. Type in your requests or commands, and the system will process and execute them, providing a smooth and engaging user experience.

## Support and Contribution 🤝
For any inquiries or bug reports, please reach out through the provided Discord server or contact Luca Vivona directly. Contributions to the project are welcome; please refer to the contribution guidelines for more information.

## License 📄
Chat'nFace is released under the MIT License. For more details, see the LICENSE file in the repository.

![Chat'nFace Interface](images/chatnface_interface.png)

Join our Discord community for support and to discuss further development of Chat'nFace:

