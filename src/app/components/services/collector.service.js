export default class CollectorService {
    constructor($rootScope, Broadcast) {
        'ngInject';

        var collector = {
            frames: [],
            selected: 0,
            setSelected: function(index) {
                collector.selected = index;
                $rootScope.$emit(Broadcast.frame.selected, index);
            },
            tools: {
                types: [
                    {
                        title: 'Pen',
                        icon: 'glyphicon-pencil'
                    },
                    {
                        title: 'Eraser',
                        icon: 'glyphicon-erase'
                    }
                ],
                selectedIndex: 0 // pen
            }
        };

        return collector;
    }
}
