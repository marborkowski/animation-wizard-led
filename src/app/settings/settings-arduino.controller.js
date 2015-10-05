export default class SettingsArduinoController {
    constructor(Socket) {
        'ngInject';

        var arduino = this;

        arduino.Socket = Socket;

        arduino.actions = {
            lights: {
                light1: function() {
                    arduino.Socket.emit('led:matrix', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]);
                },
                light2: function() {
                    arduino.Socket.emit('led:matrix', [0,1]);
                }
            }
        };
    }
}