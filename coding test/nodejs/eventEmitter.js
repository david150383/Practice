const EventEmitter = require("events");
//const xyz = require("events"); not required to use same name
const emitter = new EventEmitter();

//Listen to an event
emitter.on("message", (data) => {
  console.log("Data recieved", data);
});

//Emit an event
emitter.emit("message", "Hello");
