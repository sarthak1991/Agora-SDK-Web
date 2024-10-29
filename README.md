# This project is still WIP. Please use appropriate caution when using this as a template. Reach out to the maintainer for help. 

# Agora Video Call Project

Demo for a web-based video calling application using the Agora RTC SDK for video and
audio communications and the Agora Signaling SDK for messaging.


## Run Locally

### Please note: The project is written in plain HTML and CSS but it is scaffolded with [Vite](Vitejs.dev) - ie, it does need a server to run Javascript Modules which are installed.

### Clone the project

```bash
  git clone https://github.com/sarthak1991/agora-test
```

### Go to the project directory

```bash
  cd Agora-SDK-Web
```

### Install dependencies

```bash
  npm install
```
or 
```bash
 yarn install
```

### Start the server




```bash
  npm run start
```
 or 

```bash
  yarn start
```



## Requirements
To run this project, you should have the following on your computer

- npm - to run project and install dependencies. (Node Package Manager. Comes packaged with NodeJS Runtime)
- A browser. To view the demo. (Any broser of choice. I used Firefox Developer Edition while making/testing this)
- An Agora Account on the [Agora console](https://console.agora.io)

## Setup 

### Setup An Agora Account

- Go to [Agora console](https://console.agora.io) and make an account. 
![image](assets/CreateProject.png "Create Project on the Agora Console")

- Enable and copy the Primary Certificate (This would be used later to enable a token based auth on your project )

- Similary, copy and save your App Id

## Components and SDKs used

### Agora RTC SDK: 
- Used to enable real time Audio and Video between two clients [as described here](https://docs.agora.io/en/video-calling/get-started/get-started-sdk?platform=web)

- You need to set up an authentication server to generate your own secure tokens [as described here](https://docs.agora.io/en/video-calling/get-started/authentication-workflow?platform=web)

## Tech Stack

**Client:** HTML5, CSS3, TailwindCSS, Javascript as modules

**Server:** Nodejs, Expressjs + npm.

**Libraries:** AgoraRTC sdk Verion 4.20.0, Agora Signaling SDK Version 1.5.1 available for download [here](https://docs-beta.agora.io/en/sdks?platform=web). 

*Note: The SDKs are installed as packages using the npm package manager so you wont find downloaded SDKs in this project.*


## Author

- [@sarthak1991](https://www.github.com/sarthak1991)



