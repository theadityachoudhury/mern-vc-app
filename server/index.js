const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        method: ['GET', 'POST']
    }
});

app.use(cors({
    credentials: true,
    origin: ['https://mlsa.unknownclub.me', 'http://localhost:3000', 'https://registrations-mlsa.vercel.app','https://mern-vc-szl54n0g6-adityasubham03.vercel.app'],
}));

app.get('/', (req, res) => {
    res.send('Welcome to HomePage');
});

io.on('connection', (socket) => {

    socket.emit('me', socket.id);
    console.log(socket);
    console.log(socket.id);

    socket.on('disconnect', (socket) => {
        console.log(socket);
    });

    socket.on('calluser', ({ userToCall, signalData, from, name }) => {
        io.to(userToCall).emit('calluser', { signal: signalData, from, name })
    });

    socket.on('answercall', (data) => {
        io.to(data.to).emit('callaccepted', data.signal);
    });
});

const port = process.env.PORT || 5050;
server.listen(port, () => {
    console.log(`Server is running at: http://localhost:${port}/`)
})
