const app = require('express')()
const http = require('http').createServer(app)
const cors = require('cors')
const req = require('express/lib/request')
const res = require('express/lib/response')
const { Socket } = require('socket.io')
const PORT = 3000

const io = require('socket.io')(http)

app.use(cors())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
})



io.on('connection', (socket) => {
    console.log('Connection created....')

    socket.emit('welcome', `Welcome to Chat. Your ID is ${socket.id}`)

    socket.on('message', (data) => {
        const msg = {
            sender: socket.id,
            message: data
        }
        socket.broadcast.emit('newMessage', msg)
    })

    socket.on('join', (roomName) => {
        socket.join(roomName)
        const msg = {
            sender: socket.id,
            message: 'Joined successfully'
        }
        io.sockets.emit('newMessage', msg)
    })

    socket.on('room_message', (data) => {
        const msg = {
            sender: socket.id,
            message: data.message
        }
        socket.broadcast.to(data.room).emit('newMessage', msg)
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} Client Disconnected...`)
    })
})

http.listen(PORT, () => {
    console.log(`Server running at PORT ${PORT}`)
})