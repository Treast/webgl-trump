module.exports = {
    rooms: [],
    create: function () {
        const id = this.rooms.length;
        this.rooms[id] = {};
        return id;
    }
};