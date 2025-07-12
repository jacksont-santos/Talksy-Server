import WebSocket from 'ws';

interface rawMessage {
  notification?: boolean;
  type: string;
  data: any;
} 

export class WSService {
  private socket: WebSocket;
    // private wss = new WebSocketServer({});

  constructor() {
    console.log("WSService constructor")
    this.socket = new WebSocket(process.env.CHATSERVER_URL);

    this.socket.addEventListener("open", (event) => {
      console.log("WebSocket connection established!");
    });

    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  public async sendMessage(rawMessage: rawMessage): Promise<{success: boolean}> {
    return new Promise((resolve) => {
      const message = JSON.stringify(rawMessage);
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(message);
        resolve({success: true});
      } else {
        console.error("WebSocket connection is not open.");
        resolve({success: false});
      };
    });
  }
}
