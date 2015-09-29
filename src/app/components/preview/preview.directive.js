/**
 * https://github.com/grevory/angular-local-storage
 */
class PreviewDirective {
    constructor() {
        'ngInject';

        var postLink = function (scope, element, attr, prev) {

            prev.domElements.frames = document.querySelectorAll(prev.constants.css.selectors.frames);
            prev.domElements.body = prev.$element.querySelector(prev.constants.css.selectors.body);
        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/preview/preview.html',
            controller: PreviewController,
            controllerAs: 'prev',
            scope: {
                open: '='
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

        this.$rootScope.$on(this.Broadcast.animation.play, function () {
            _self.$log.info('Playing...');
            _self.open = true;
            _self.setUpAnimation();
        });

    }

    setUpAnimation() {
        var _self = this;

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
            _self.play();
        });
    }

    play() {

    }
}

export default PreviewDirective;
