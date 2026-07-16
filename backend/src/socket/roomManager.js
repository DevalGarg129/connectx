class roomManager{
    constructor(){
        this.activeRooms = new Map();
    }

    createRoom(roomId){
        if(!this.activeRooms.has(roomId)){
            this.activeRooms.set(roomId, new Map());
        }
        return this.activeRooms.get(roomId);
    }

    getRoom(roomId){
        return this.activeRooms.get(roomId);
    }

    roomExists(roomId){
        return this.activeRooms.has(roomId);
    }

    addUser(roomId, socket, user){
        const room = this.createRoom(roomId);
        room.set(socket.id, {
            socketId: socket.id,
            userId: user.id,
            username: username.user
        });
    }

    removeUser(roomId, socketId){
        const room = this.activeRooms.get(roomId);
        if(!room) return null;
        const user = room.get(socketId);

        room.delete(socketId);
        if(room.size == 0){
            this.activeRooms.delete(roomId);
        }
        return user;
    }

    getUsers(roomId){
        const room = this.activeRooms.get(roomId);
        if(!room) return [];
        return Array.from(room.values());
    }

    getUser(roomId, socketId){
        const room = this.activeRooms.get(roomId);
        if(!room) return null
        return room.get(socketId);
    }

    roomSize(roomId){
        const room = this.activeRooms.get(roomId);
        if(!room) return 0;
        return room.size();
    }

    deleteRoom(roomId){
        this.activeRooms.delete(roomId);
    }

    getAllRooms(){
        return this.activeRooms;
    }
}
export default new roomManager();