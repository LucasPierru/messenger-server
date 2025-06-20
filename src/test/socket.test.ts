import { io, Socket } from 'socket.io-client';
import { server } from '../server'; // Your Express server (must export http server instance)
import { createUser, createConversation } from '../models/mockHelpers';

beforeAll((done) => {
  server.listen(4001, () => {
    console.log('Socket.IO server running on port 4001');
    done();
  }
});

afterAll(() => {
  server.close(); // Clean up after tests
});

describe('Socket.IO Message Flow', () => {
  let clientSocket: Socket;

  afterEach(() => {
    if (clientSocket?.connected) clientSocket.disconnect();
  });

  it('should send and receive a message', async () => {
    const user = await createUser(); // Your test util
    const conversation = await createConversation([user._id]);

    return new Promise<void>((resolve) => {
      clientSocket = io('http://localhost:4001', {
        transports: ['websocket'],
        forceNew: true,
      });

      clientSocket.on('connect', () => {
        clientSocket.emit('join_room', conversation._id.toString());

        const testMessage = {
          conversationId: conversation._id.toString(),
          sender: {
            _id: user._id.toString(),
            name: user.name,
          },
          content: 'Hello from test!',
          createdAt: new Date().toISOString(),
        };

        clientSocket.emit('send_message', testMessage);
      });

      clientSocket.on('new_message', (msg) => {
        expect(msg.content).toBe('Hello from test!');
        expect(msg.conversationId).toBe(conversation._id.toString());
        resolve();
      });
    });
  });
});