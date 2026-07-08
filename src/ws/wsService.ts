import WebSocket from 'ws';

interface rawMessage {
  notification?: boolean;
  type: string;
  data: any;
} 

export class WSService {
  private socket: WebSocket | null = null;

  constructor() {
    this.connect();
  }

  private connect() {
    console.log("WSService connect");
    if (!process.env.CHATSERVER_URL) {
      console.warn("CHATSERVER_URL is not defined. WebSocket integration is disabled.");
      return;
    }

    this.socket = new WebSocket(process.env.CHATSERVER_URL);

    this.socket.addEventListener("open", (event) => {
      console.log("WebSocket connection established!");
    });
    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed");
      this.socket = null;
      setTimeout(() => {
        this.connect();
      }, 5000);
    });
    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error.error);
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
