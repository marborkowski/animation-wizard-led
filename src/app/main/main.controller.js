class MainController {
    constructor($timeout, Collector) {
        'ngInject';

        var main = this;

        this.Collector = Collector;

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
        }
    }
}

export default MainController;
