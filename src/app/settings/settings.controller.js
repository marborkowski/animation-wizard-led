export default class SettingsController {
    constructor($state) {
        'ngInject';

        var settings = this;

        settings.$state = $state;

        settings.tabs = {
            elements: [
                {
                    label: 'General',
                    route: 'settings.general'
                },
                {
                    label: 'Arduino',
                    route: 'settings.arduino'
                }
            ],
            selected: 0
        };

        settings.actions = {
            changeTab: (route, index) => {
                settings.$state.go(route);
                settings.tabs.selected = index;
            }
        };
    }
}