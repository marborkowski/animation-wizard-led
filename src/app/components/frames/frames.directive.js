/**
 * https://github.com/grevory/angular-local-storage
 */
class FramesDirective {
    constructor() {
        'ngInject';

        let postLink = function (scope, element, attr, frames) {
            frames.registerWatchers();
        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/frames/frames.html',
            controller: FramesController,
            controllerAs: 'frames',
            scope: {
                selected: '@selected',
                source: '=source',
                pixels: '=pixels'
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class FramesController {
    constructor($rootScope, $timeout, $scope, $log, $element, Frame, Broadcast) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;
        this.$scope = $scope;
        this.Frame = Frame;
        this.Broadcast = Broadcast;
        this.$rootScope = $rootScope

        this.states = {
            activeFrame: 0
        };

        this.constants = {
           thumb: {
             maxWidth: 300
           },
           css: {
               selectors: {
                   directive: 'div.directive-frames',
                   body: 'div.directive-frames div.panel-body'
               },
               classes: {
                   active: 'active'
               }
           }
        };

        this.addFrame();
    }

    registerWatchers() {
        this._watchers = this._watchers || [];
        var _self = this;

        var watchers = [
            {
                model: 'frames.pixels',
                type: '$watch',
                listener: function(newValue, oldValue) {
                    _self.applyPreview();
                }
            }
        ];

        watchers.forEach(watcher => {
            _self._watchers.push(
                _self.$scope[watcher.type](watcher.model, watcher.listener, true)
            );
        })
    }
    addFrame() {
        var uniqueId = 'frame' + Date.now();
        this._frames = this._frames || [];

        this._frames.push(
            new this.Frame(uniqueId, this.constants.css.selectors.body)
        );

        this.$rootScope.$broadcast(this.Broadcast.frame.new);

        this.applyPreview(uniqueId);
    }

    setActiveFrame(index) {
        this.$log.info('Active frame is %d', index);
        this.states.activeFrame = index;
        this.selected = index;
    }

    applyPreview(frameId) {
        this.$log.info('Applying preview to frame %s.', this.selected);
        var _self = this;

        frameId = frameId || _self._frames[_self.selected].id;

        setTimeout(function() {
            var baseCanvas = _self.source.background;
            var targetCanvas = document.getElementById(frameId);

            var element = targetCanvas.getContext('2d');
            var originalWidth = baseCanvas.width;
            var originalHeight = baseCanvas.height;

            var newWidth = _self.constants.thumb.maxWidth;
            var newHeight = originalHeight * newWidth / originalWidth;

            targetCanvas.setAttribute('width', newWidth);
            targetCanvas.setAttribute('height', newHeight);

            element.drawImage(baseCanvas, 0, 0, originalWidth, originalHeight, 0, 0, newWidth, newHeight);
        });
    }
}

export default FramesDirective;
