export default class FrameFactory {
    constructor() {
        'ngInject';

        var Frame = function(id, holder) {

            if(!id) {
                throw new Error('You must define an unique ID as a first attribute!');
            }

            if(!holder) {
                throw new Error('You must define a holder as a second attribute!');
            }

            if(typeof id !== 'string') {
                throw new TypeError('ID need to be a string!');
            }

            if(typeof holder !== 'string') {
                throw new TypeError('Holder need to be a string!');
            }

            this.id = id;
            this.holder = document.querySelector(holder);
            this.LEDArray = [];

            if(this.holder === null) {
                throw new Error('Could not find DOM element: ' + holder);
            }

            this.profile1 = 'marcin';
            //this.addCanvas();
        };

        Frame.prototype.setLEDArray = function(collection) {
            this.LEDArray.length = 0;
            this.LEDArray = collection;
        };

        Frame.prototype.getLEDArray = function() {
            return this.LEDArray;
        };

        Frame.prototype.getProfiler = function() {
            console.log(this.profile1);

        };

        return Frame;
    }
}
