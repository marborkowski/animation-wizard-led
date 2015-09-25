function config ($logProvider, localStorageServiceProvider) {
  'ngInject';

  $logProvider.debugEnabled(true);

  /**
   * LocalStorage service configuration
   */
  localStorageServiceProvider.setPrefix('animationWizardLed');
  localStorageServiceProvider.setStorageType('localStorage');
}

export default config;
