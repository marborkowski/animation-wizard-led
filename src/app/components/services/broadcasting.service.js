export default class BroadcastingFactory {
    constructor() {
        'ngInject';

        var events = {
            frame: 'frame',
            animation: 'animation'
        };

        var broadcast = {
            frame: {
                new: events.frame + ':new'
            },
            animation: {
                play: events.animation + ':play'
            }
        };

        return broadcast;
    }
}
