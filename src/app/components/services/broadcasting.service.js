export default class BroadcastingService {
    constructor() {
        'ngInject';

        var events = {
            frame: 'frame',
            animation: 'animation'
        };

        var broadcast = {
            frame: {
                new: events.frame + ':new',
                selected: events.frame + ':selected'
            },
            animation: {
                play: events.animation + ':play'
            }
        };

        return broadcast;
    }
}
