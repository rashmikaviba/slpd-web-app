import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "src/environments/environment";
import { MasterDataService } from "../master-data.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WebSocketService {
  private socket: Socket;
  constructor(private masterData: MasterDataService) {
    const SERVER_URL = environment.apiURL;
    this.socket = io(SERVER_URL, {
      query: {
        userWithRoleId: `${this.masterData.Role}-${this.masterData.ClientId}`,
      },
      autoConnect: true,
      transports: ["websocket"],
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }

  // Listen to an event from the server
  listen(event: string, isNotify = false): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(event, (data) => {
        if (isNotify) {
          let audio = new Audio("assets/sound/not-sound.wav");
          audio.play();
        }
        subscriber.next(data);
      });

      // Cleanup when unsubscribed
      return () => {
        this.socket.off(event);
      };
    });
  }

  disconnect() {
    this.socket.disconnect();
  }
}
