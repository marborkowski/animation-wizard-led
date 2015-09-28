/**
 * https://github.com/grevory/angular-local-storage
 */
class PreviewDirective {
    constructor() {
        'ngInject';

        let postLink = function (scope, element, attr, frames) {

        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/preview/preview.html',
            controller: PreviewController,
            controllerAs: 'preview',
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

        this.$rootScope.$on(this.Broadcast.animation.play, function() {
            _self.$log.info('Playing...');
            _self.open = true;
        });

        // TODO Animate frames using the existing HTML elements

    }

    close() {

    }
}

export default PreviewDirective;
