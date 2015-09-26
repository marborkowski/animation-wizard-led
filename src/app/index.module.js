/* global malarkey:false, toastr:false, moment:false */
import config from './index.config';

import routerConfig from './index.route';

import runBlock from './index.run';
import MainController from './main/main.controller';
import NavigationDirective from '../app/components/navigation/navigation.directive';
import DrawerDirective from '../app/components/drawer/drawer.directive';
import FramesDirective from '../app/components/frames/frames.directive';

import FrameFactory from '../app/components/services/frame.factory';

angular.module('animationWizardLed', ['ngAnimate', 'ngSanitize', 'ngResource', 'ngCookies', 'LocalStorageModule', 'ui.router', 'ui.bootstrap'])
    .config(config)
    .config(routerConfig)
    .directive('navigation', () => new NavigationDirective())
    .directive('drawer', () => new DrawerDirective())
    .directive('frames', () => new FramesDirective())
    .factory('Frame',  () => new FrameFactory)
    .run(runBlock)
    .controller('MainController', MainController);