export default class SettingsArduinoController {
    constructor(Socket) {
        'ngInject';

        var arduino = this;

        arduino.Socket = Socket;

        arduino.actions = {
            lights: {

            }
        };
    }
}