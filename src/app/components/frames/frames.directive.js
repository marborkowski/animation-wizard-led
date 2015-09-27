/**
 * https://github.com/grevory/angular-local-storage
 */
class FramesDirective {
    constructor() {
        'ngInject';

        let postLink = function (scope, element, attr, frames) {

        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/frames/frames.html',
            controller: FramesController,
            controllerAs: 'frames',
            scope: {
                selected: '@selected',
                source: '=source'
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class FramesController {
    constructor($rootScope, $timeout, $scope, $log, $element, Frame) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;
        this.Frame = Frame;

        this.constants = {
           css: {
               selectors: {
                   directive: 'div.directive-frames',
                   body: 'div.directive-frames div.panel-body'
               },
               classes: {

               }
           }
        };

        this.addFrame();
    }

    addFrame() {
        var uniqueId = 'frame' + Date.now();
        this._frames = this._frames || [];

        this._frames.push(
            new this.Frame(uniqueId, this.constants.css.selectors.body)
        );

        this.applyPreview();
    }

    applyPreview() {
        this.$log.info('Applying preview to frame %s.', this.selected);
        this._frames[this.selected].applyPreview(this.source.background);
    }
}

export default FramesDirective;
