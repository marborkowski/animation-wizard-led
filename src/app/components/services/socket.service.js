export default class SocketService {
    constructor($rootScope, $log) {
        'ngInject';

        var socket = io.connect('http://127.0.0.1:8080', {
            reconnect: true
        });

        socket.on('connect', () => {
            $log.info('Init socket.io connection...');
        });

        socket.on('disconnect', () => {
            $log.info('Disconnecting with socket.io service...');
        });

        // TODO Add method to remove all listeners.
        // TODO Clean up the code.
        return {
            on: function(eventName, callback) {
                socket.on(eventName, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    }
}
