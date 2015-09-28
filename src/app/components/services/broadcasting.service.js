export default class BroadcastingFactory {
    constructor() {
        'ngInject';

        var events = {
            frame: 'frame'
        };

        var broadcast = {
            frame: {
                new: events.frame + ':new'
            }
        };

        return broadcast;
    }
}
