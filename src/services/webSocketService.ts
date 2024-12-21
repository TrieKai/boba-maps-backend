import WebSocket from "ws";
import { Server } from "http";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export class WebSocketService {
  private wss: WebSocket.Server;
  private clients: Map<number, WebSocket[]>;

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.clients = new Map();

    this.wss.on("connection", (ws: WebSocket, req) => {
      this.handleConnection(ws, req);
    });
  }

  private handleConnection(ws: WebSocket, req: any) {
    const token = req.url.split("token=")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      const userId = decoded.id;

      // Store client connection
      if (!this.clients.has(userId)) {
        this.clients.set(userId, []);
      }
      this.clients.get(userId)!.push(ws);

      ws.on("close", () => {
        const userConnections = this.clients.get(userId);
        if (userConnections) {
          const index = userConnections.indexOf(ws);
          if (index !== -1) {
            userConnections.splice(index, 1);
          }
          if (userConnections.length === 0) {
            this.clients.delete(userId);
          }
        }
      });

      ws.on("message", (message: string) => {
        this.handleMessage(userId, message);
      });
    } catch (error) {
      ws.close();
    }
  }

  private handleMessage(userId: number, message: string) {
    try {
      const data = JSON.parse(message);
      // Handle different message types
      switch (data.type) {
        case "ping":
          this.sendToUser(userId, { type: "pong" });
          break;
        // Add more message type handlers as needed
      }
    } catch (error) {
      console.error("Failed to handle WebSocket message:", error);
    }
  }

  public sendToUser(userId: number, data: any) {
    const userConnections = this.clients.get(userId);
    if (userConnections) {
      const message = JSON.stringify(data);
      userConnections.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(message);
        }
      });
    }
  }

  public broadcast(data: any) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
