export default class CollectorService {
    constructor() {
        'ngInject';

        var collector = {
            frames: [],
            selected: 0,
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
