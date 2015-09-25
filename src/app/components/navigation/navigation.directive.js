/**
 * https://github.com/grevory/angular-local-storage
 */
class NavigationDirective {
    constructor() {
        'ngInject';

        let postLink = function(scope, el, attr, navigation, $timeout) {
            // TODO
        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/navigation/navigation.html',
            controller: NavigationController,
            controllerAs: 'navigation',
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class NavigationController {
    constructor($rootScope, $timeout, $scope, localStorageService, $log) {
        'ngInject';

        /**
         * Inject the necessary angular dependencies.
         */
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.localStorageService = localStorageService;

        this.constants = {
            _version: 1,
            storage: {
                settings: 'settings'
            },
            css: {
                classes: {},
                selectors: {
                    stage: 'section.stage'
                }
            }
        };

        /**
         * Try to set the current settings regarding to the local storage data.
         * @type {*|{matrix: {size: {vertical: number, horizontal: number}}}}
         */
        let savedSettings = this.localStorageService.get(this.constants.storage.settings);
        if(savedSettings !== null && savedSettings.hasOwnProperty('_version') && savedSettings._version !== this.constants._version) {
            savedSettings = null;
        }

        this.matrix = [];

        this.settings = savedSettings || {
            matrix: {
                size: {
                    vertical: 20,
                    horizontal: 20
                }
            },
            _version: this.constants._version
        };

        // TODO Create 'Watcher' object ... new Watcher(a,b,c)
        this.watchers = [
            {
                model: 'navigation.settings',
                type: '$watch',
                listener: (newValue, oldValue) => {
                    if(angular.isDefined(newValue) && newValue !== null) {
                        this.localStorageService.set(this.constants.storage.settings, this.settings);
                        this.matrix.length = 0;
                        for(let i = 0; i <= this.settings.matrix.size.vertical; i++) {
                            let row = [];

                            for(let i = 0; i <= this.settings.matrix.size.horizontal; i++) {
                                row.push(0);
                            }

                            this.matrix.push(row);
                        }

                        this.$rootScope.matrix = angular.copy(this.matrix);
                    }
                }
            }
        ];

        this.registerWatchers(this.watchers);

    }


    /**
     * Register the specify watcher collection.
     * @param collection
     */
    registerWatchers(collection) {

        if(!collection instanceof Array) {
            throw new TypeError('Collection is not an Array.');
        }

        collection.forEach(watcher => {
                if(!watcher instanceof Object) {
                    throw new Error('Watcher must be an Object.');
                }

                if(!this.$scope[watcher.type]) {
                    throw new Error('Uknown watcher: ' + watcher.type);
                }

                if(!watcher.model || typeof watcher.model !== 'string') {
                    throw new TypeError('Model must be a string.');
                }

                if(!watcher.listener || !watcher.listener instanceof Function) {
                    throw new TypeError('Listener must be a function.');
                }

                this.addWatcher(
                    this.$scope[watcher.type](watcher.model, watcher.listener, true)
                );
        });
    }

    /**
     * Add single 'watcher' record.
     * @param watcher
     */
    addWatcher(watcher)
    {
        this._watchers = this._watchers || [];
        this._watchers.push(watcher);
    }


}

export default NavigationDirective;
