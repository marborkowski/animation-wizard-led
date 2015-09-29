/**
 * https://github.com/grevory/angular-local-storage
 */
class PreviewDirective {
    constructor() {
        'ngInject';

        var postLink = function (scope, element, attr, prev) {

        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/preview/preview.html',
            controller: PreviewController,
            controllerAs: 'prev',
            scope: {
                open: '=',
                fps: '='
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class PreviewController {
    constructor($rootScope, $timeout, $scope, $log, $element, Broadcast) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.Broadcast = Broadcast;

        this.domElements = {};
        this.constants = {
            fps: this.fps || 25,
            css: {
                classes: {
                    hide: 'hide'
                },
                selectors: {
                    frames: 'div.directive-frames canvas',
                    body: 'div.modal-body'
                }

            }
        };

        this.interval = null;

        this.$rootScope.$on(this.Broadcast.animation.play, function () {
            _self.$log.info('Playing...');
            _self.open = true;
            _self.setUpAnimation();
        });

    }

    setUpAnimation() {
        // TODO Make the canvas wider and more well-fitting.

        var _self = this;

        _self.domElements.frames = document.querySelectorAll(_self.constants.css.selectors.frames);
        _self.domElements.body = _self.$element.querySelector(_self.constants.css.selectors.body);

        /**
         * Clear the current preview set.
         * @type {string}
         */
        _self.domElements.body.innerHTML = '';

        /**
         * Copy and paste the all available frames.
         * @type {number}
         */
        var i = 0;
        for(var frame in _self.domElements.frames) {
            if(_self.domElements.frames.hasOwnProperty(frame)) {

                let element = _self.domElements.frames[frame];
                let context = element.getContext('2d');

                /**
                 * Copy data from the given frame.
                 * @type {ImageData}
                 */
                let basicData = context.getImageData(0, 0, element.width, element.height);

                let prevFrame = document.createElement('canvas');
                let prevFrameContext = prevFrame.getContext('2d');

                prevFrame.setAttribute('width', element.width);
                prevFrame.setAttribute('height', element.height);

                /**
                 * We want to init our preview with the first
                 * frame visible and the other not.
                 */
                if(i > 0) {
                    prevFrame.classList.add(this.constants.css.classes.hide);
                }

                /**
                 * Paste data into the new <canvas> element.
                 */
                prevFrameContext.putImageData(basicData, 0, 0);

                /**
                 * Append <canvas> frame to our preview area.
                 */
                _self.domElements.body.appendChild(prevFrame);

                i++;
            }
        }

        setTimeout(function () {
            /**
             * When DOM is ready, we can start animate our work.
             */
            _self.play();
        });
    }

    play() {
        var _self = this;

        var frames = this.domElements.body.querySelectorAll('canvas');
        var currentIndex = 0;
        var previousIndex = 0;

        /**
         * Show next frame.
         */
        var changeFrame = function() {
            if(previousIndex >= 0) {
                frames[previousIndex].classList.add(_self.constants.css.classes.hide);
            }

            frames[currentIndex].classList.remove(_self.constants.css.classes.hide);

            _self.$log.debug('Frame %d of %d', currentIndex + 1, frames.length);

            previousIndex = currentIndex;
            currentIndex++;

            if(currentIndex >= frames.length) {
                currentIndex = 0;
            }
        };

        /**
         * Convert FPS to milliseconds.
         * @type {number|*}
         */
        let speed = 1000 / this.constants.fps;

        /**
         * Run interval.
         * @type {number|*}
         */
        this.interval = setInterval(function() {
            changeFrame();
        }, speed);

        /**
         * Change first frame immediately.
         */
        changeFrame();
    }
    stop() {
        clearInterval(this.interval);
        this.interval = null;
    }

    close() {
        this.stop();
        this.open = false;
    }
}

export default PreviewDirective;
