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

            if(this.holder === null) {
                throw new Error('Could not find DOM element: ' + holder);
            }

            this.profile1 = 'marcin';
            this.addCanvas();
        };

        Frame.prototype.maxWidth = 300;

        Frame.prototype.addCanvas = function() {
            var canvas = document.createElement('canvas');
            canvas.setAttribute('id', this.id);

            this.holder.appendChild(canvas);
        };

        Frame.prototype.applyPreview = function(canvas) {

            var _canvas = this.holder.querySelector('canvas');
            var element = _canvas.getContext('2d');
            var originalWidth = canvas.width;
            var originalHeight = canvas.height;

            var newWidth = this.maxWidth;
            var newHeight = originalHeight * newWidth / originalWidth;

            _canvas.width = newWidth;
            _canvas.height = newHeight;

            element.drawImage(canvas, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);

        };

        Frame.prototype.getProfiler = function() {
            console.log(this.profile1);

        };

        return Frame;
    }
}
