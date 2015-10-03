function routerConfig($stateProvider, $urlRouterProvider) {
    'ngInject';

    $urlRouterProvider.when('/settings', '/settings/general');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'app/main/main.html',
            controller: 'MainController',
            controllerAs: 'main'
        })
        .state('settings', {
            url: '/settings',
            templateUrl: 'app/settings/settings.html',
            controller: 'SettingsController',
            controllerAs: 'settings'
        })
        .state('settings.general', {
            url: '/general',
            templateUrl: 'app/settings/settings-general.html',
            controller: 'SettingsGeneraloController',
            controllerAs: 'general'
        })
        .state('settings.arduino', {
            url: '/arduino',
            templateUrl: 'app/settings/settings-arduino.html',
            controller: 'SettingsArduinoController',
            controllerAs: 'arduino'
        });

    $urlRouterProvider.otherwise('/');
}

export default routerConfig;
