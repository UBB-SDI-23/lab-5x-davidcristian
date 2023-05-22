using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;

namespace StoreAPI.Middleware
{
    public class ChatMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ConcurrentDictionary<string, WebSocket> _sockets = new();

        public ChatMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (!context.WebSockets.IsWebSocketRequest) return;

            var socket = await context.WebSockets.AcceptWebSocketAsync();
            var socketId = Guid.NewGuid().ToString();

            _sockets.TryAdd(socketId, socket);

            while (socket.State == WebSocketState.Open)
            {
                var message = await ReceiveMessage(socket);
                if (message != null)
                {
                    Console.WriteLine($"Received message: {message} from socket {socketId}");
                    await BroadcastMessage(message, socketId);
                }
            }

            // Remove the closed socket from the dictionary
            WebSocket dummy;
            _sockets.TryRemove(socketId, out dummy!);

            await _next(context);
        }

        private async Task<string> ReceiveMessage(WebSocket socket)
        {
            var buffer = new ArraySegment<byte>(new byte[4096]);
            var received = await socket.ReceiveAsync(buffer, CancellationToken.None);
            var message = Encoding.UTF8.GetString(buffer.Array!, 0, received.Count);
            return message;
        }

        private async Task BroadcastMessage(string message, string senderSocketId)
        {
            foreach (var socketPair in _sockets)
            {
                if (socketPair.Key == senderSocketId) continue;
                if (socketPair.Value.State != WebSocketState.Open) continue;

                Console.WriteLine($"Sending message: {message} to socket {socketPair.Key}");

                var buffer = Encoding.UTF8.GetBytes(message);
                await socketPair.Value.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }

    }

}
