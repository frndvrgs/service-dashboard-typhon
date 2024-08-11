import { FastifyInstance } from "fastify";

export const serviceRoutes = async (serviceInstance: FastifyInstance) => {
  serviceInstance.get("/ws", { websocket: true }, (socket, _request) => {
    socket.on("message", (message) => {
      const messageString = message.toString();
      const messageObject = JSON.parse(messageString);

      console.log("message received:", messageObject);
      socket.send("message received on server-side");
    });
  });
};
