/**
 * https://github.com/grevory/angular-local-storage
 */
class DrawerDirective {
    constructor() {
        'ngInject';

        let postLink = function (scope, element, attr, drawer) {

            /**
             * Reference to the directive's top DOM level.
             */
            let body = element[0];

            /**
             * Reference to the main holder.
             * @type {Element}
             */
            let drawerHolder = document.querySelector(drawer.constants.css.selectors.drawer);

            /**
             * Save current width and height.
             * @type {number}
             */
            drawer.constants.drawer.width = drawerHolder.clientWidth;
            drawer.constants.drawer.height = drawerHolder.clientHeight;

            /**
             * Set canvas references.
             */
            drawer.setCanvas(body.querySelector(drawer.constants.css.selectors.canvasMain));

            /**
             * Fill canvas with empty points.
             */
            drawer.drawShape();

            /**
             * Register events.
             */
            drawer.registerEvents(drawer.events);
        };

        let directive = {
            restrict: 'E',
            templateUrl: 'app/components/drawer/drawer.html',
            controller: DrawerController,
            controllerAs: 'drawer',
            scope: {
                mousePosition: '=mousePosition'
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class DrawerController {
    constructor($rootScope, $timeout, $scope, $log, $element) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;

        this.canvas = {};

        this.constants = {
            drawer: {
                width: 0,
                height: 0,
                led: {
                    width: 25,
                    height: 25,
                    color: {
                        active: 'orange',
                        empty: '#f8f8f8',
                        stroke: '#f0f0f0'
                    }
                }
            },
            css: {
                selectors: {
                    canvasMain: 'canvas.main',
                    drawer: 'div.directive-drawer'
                }
            }
        };

        this.events = [
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mousedown',
                listener: event => {
                    this.$log.debug('mousedown');
                    this.setPixel({
                        inLed: _self.mousePosition.LEDIndex,
                        inArray: _self.mousePosition.position
                    });
                }
            },
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mouseup',
                listener: event => {
                    this.$log.debug('mouseup');
                }
            },
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mouseleave',
                listener: event => {
                    this.$log.debug('mouseleave');
                    $timeout(function() {
                        _self.mousePosition = {};
                    });
                }
            },
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mousemove',
                listener: event => {
                    var cells = Math.round(this.constants.drawer.width / this.constants.drawer.led.width);
                    var rows = Math.round(this.constants.drawer.height / this.constants.drawer.led.height);

                    var parcelX = Math.ceil(event.layerX / this.constants.drawer.led.width) || 1;
                    var parcelY = Math.ceil(event.layerY / this.constants.drawer.led.height) || 1;

                    var _parcelX = parcelX;
                    var _parcelY = parcelY;

                    var position = _parcelX + ((_parcelY - 1) * cells) - 1;

                    this.$log.info('Real x: %d, y: %d', parcelX, parcelY);

                    var prevY = parcelY - 1;
                    var prevLast = prevY * cells;

                    if(parcelY % 2 == 0) {
                        parcelX = prevLast + (cells - parcelX) + 1;
                    } else {
                        parcelX = parcelX + prevLast - 1;
                    }

                    this.$log.info('LED Index: %d, Position: %d', parcelX, position);

                    $timeout(function() {
                        _self.mousePosition = {
                            real: {
                                cell: _parcelX,
                                row: _parcelY
                            },
                            LEDIndex: parcelX,
                            position: position
                        };
                    });
                }
            }
        ];
    }

    setCanvas(canvas) {

        this.$log.info('Setting up canvas...');

        this.canvas.background = canvas;
        this.canvas.context = canvas.getContext('2d');

        /**
         * Set canvas to be equal to the drawer holder width and height.
         */
        this.canvas.background.setAttribute('width', this.constants.drawer.width);
        this.canvas.background.setAttribute('height', this.constants.drawer.height);
    }

    setPixel(position) {
        /*
        {
            inLed:0,
            inArray:0
        }
        */
        this._coordinates = this._coordinates || [];
        var find =  _.findWhere(this._coordinates, position);

        if(find) {
            this._coordinates = _.without(this._coordinates,find);
        } else {
            this._coordinates.push(position);
        }

        this.drawPixels(_.pluck(this._coordinates, 'inArray'));
    }

    drawShape() {
        this.$log.info('Drawing the basic shape...');
        this.drawPixels([0,40,80,39,79,119,78,77,117,157,197,237,238,239,199,159,1,2,42,82,81]);
    }

    drawPixels(coordinates) {
        coordinates = coordinates || [];

        this.$log.info('Drawing pixels... [coordinates: %O]', coordinates);

        if(!coordinates instanceof Array) {
            throw new TypeError('Coordinates should be in Array format.');
        }

        var top = 0;
        var left = 0;

        var cells = Math.round(this.constants.drawer.width / this.constants.drawer.led.width);
        var rows = Math.round(this.constants.drawer.height / this.constants.drawer.led.height);

        var block = 0;

        for(var a = 0; a < rows; a++) {
            for(var i = 0; i < cells; i++) {
                let index = (i % 2);

                this.canvas.context.fillStyle = coordinates.indexOf(block) >= 0 ? this.constants.drawer.led.color.active : this.constants.drawer.led.color.empty;
                this.canvas.context.rect(left, top, this.constants.drawer.led.width, this.constants.drawer.led.height);
                this.canvas.context.lineWidth = 1;
                this.canvas.context.strokeStyle = this.constants.drawer.led.color.stroke;
                this.canvas.context.fill();
                this.canvas.context.stroke();

                this.canvas.context.closePath();
                this.canvas.context.beginPath();

                left += this.constants.drawer.led.width;
                block++;
            }
            left = 0;
            top += this.constants.drawer.led.height;
        }

    }

    /**
     * Register events.
     * @param collection
     */
    registerEvents(collection) {

        this.$log.info('Registering events...');

        var properties = {
            selector: 'selector',
            event: 'event',
            listener: 'listener'
        };

        if(!collection instanceof Array) {
            throw new TypeError('Collection is not an Array.');
        }

        collection.forEach(event => {
            for(let property in properties) {
                if(!event.hasOwnProperty(property)) {
                    throw new Error('Unable to read property: ' + property);
                }
            }

            this.$log.info('-> %s', event[properties.event]);
            document.querySelector(event[properties.selector]).addEventListener(event[properties.event], event[properties.listener], false);

            this.addEvent(event);
        });
    }

    /**
     * Unregister events.
     */
    unregisterEvents() {
        this._events = this._events || [];

        this._events.forEach(event => {
            document.querySelector(event.selector).removeEventListener(event.event, event.listener);

            /**
             * Delete reference to the object.
             * @type {null}
             */
            event = null;
        });

        this._events.length = 0;
    }

    /**
     * Add single 'event' record.
     * @param event
     */
    addEvent(event)
    {
        this._events = this._events || [];
        this._events.push(event);
    }
}

export default DrawerDirective;
