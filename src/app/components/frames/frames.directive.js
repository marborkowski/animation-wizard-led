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
                mousePosition: '=mousePosition'
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class FramesController {
    constructor($rootScope, $timeout, $scope, $log, $element) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;

    }

    setFrame(frame) {

    }
}

export default FramesDirective;
