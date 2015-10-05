class MainController {
    constructor($timeout, Collector, Socket, $scope) {
        'ngInject';

        var main = this;

        main.Collector = Collector;
        main.Socket = Socket;

        main.Socket.emit('chat message', '123');

        main.tools = [
            {
                title: 'Pen',
                icon: 'glyphicon-pencil'
            },
            {
                title: 'Eraser',
                icon: 'glyphicon-erase'
            }
        ];

        main.actions = {
            selectTool: function(index) {
                main.Collector.tools.selectedIndex = index;
            }
        };

        $scope.$on('$destroy', function() {
            // TODO Destroy socket events on exit...
        });
    }
}

export default MainController;
