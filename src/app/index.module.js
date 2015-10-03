/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import runBlock from './index.run';

/**
 * Controllers.
 */
import MainController from './main/main.controller';
import SettingsController from './settings/settings.controller';
import SettingsArduinoController from './settings/settings-arduino.controller';
import SettingsGeneraloController from './settings/settings-general.controller';

/**
 * Directives.
 */
import NavigationDirective from '../app/components/navigation/navigation.directive';
import DrawerDirective from '../app/components/drawer/drawer.directive';
import FramesDirective from '../app/components/frames/frames.directive';
import PreviewDirective from '../app/components/preview/preview.directive';

/**
 * Services.
 */
import FrameFactory from '../app/components/services/frame.factory';
import BroadcastingService from '../app/components/services/broadcasting.service';
import CollectorService from '../app/components/services/collector.service';

angular.module('animationWizardLed', ['ngAnimate', 'ngSanitize', 'ngResource', 'ngCookies', 'LocalStorageModule', 'ui.router', 'ui.bootstrap'])
    .config(config)
    .config(routerConfig)
    .directive('navigation', () => new NavigationDirective())
    .directive('drawer', () => new DrawerDirective())
    .directive('frames', () => new FramesDirective())
    .directive('preview', () => new PreviewDirective())
    .factory('Frame',  () => new FrameFactory)
    .factory('Broadcast',  () => new BroadcastingService())
    .factory('Collector',  () => new CollectorService())
    .run(runBlock)
    .controller('MainController', MainController)
    .controller('SettingsController', SettingsController)
    .controller('SettingsArduinoController', SettingsArduinoController)
    .controller('SettingsGeneraloController', SettingsGeneraloController);