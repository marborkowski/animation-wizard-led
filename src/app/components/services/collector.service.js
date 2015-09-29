export default class CollectorService {
    constructor() {
        'ngInject';

        var collector = {
            frames: [],
            selected: 0
        };

        return collector;
    }
}
