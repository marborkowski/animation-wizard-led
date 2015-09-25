class NavigationDirective {
  constructor () {
    'ngInject';

    let directive = {
      restrict: 'E',
      templateUrl: 'app/components/navigation/navigation.html',
      controller: NavigationController,
      controllerAs: 'navigation',
      bindToController: true
    };

    return directive;
  }
}

class NavigationController {
  constructor ($rootScope, $timeout) {
    'ngInject';
    $timeout(function() {
      $rootScope.intValue = 123;
    }, 4000);

    // "this.creation" is avaible by directive option "bindToController: true"

  }
}

export default NavigationDirective;
