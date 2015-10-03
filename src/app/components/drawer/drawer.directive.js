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
            drawer.setCanvas(body.querySelector(drawer.constants.css.selectors.canvasMain), body.querySelector(drawer.constants.css.selectors.canvasBackground));

            /**
             * Fill canvas with empty points.
             */
            drawer.newFrame();

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
                mousePosition: '=mousePosition',
                pixels: '=pixels',
                canvas: '=canvas'
            },
            link: postLink,
            bindToController: true
        };

        return directive;
    }
}

class DrawerController {
    constructor($rootScope, $timeout, $scope, $log, $element, Broadcast, Collector) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.Broadcast = Broadcast;
        this.Collector = Collector;

        this.canvas = {
            background: {},
            layer: {}
        };

        this.constants = {
            drawer: {
                width: 0,
                height: 0,
                led: {
                    width: 25,
                    height: 25,
                    color: {
                        active: 'red',
                        empty: '#f8f8f8',
                        stroke: '#f0f0f0'
                    }
                }
            },
            css: {
                selectors: {
                    canvasMain: 'canvas.main',
                    canvasBackground: 'canvas.background',
                    drawer: 'div.directive-drawer'
                }
            }
        };

        this.states = {
            mouseDown: false
        };

        this.events = [
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mousedown',
                listener: event => {
                    this.$log.debug('mousedown');
                    var _self = this;
                    $timeout(function() {
                        "use strict";
                        _self.states.mouseDown = true;

                        _self.setPixel({
                            inLed: _self.mousePosition.LEDIndex,
                            inArray: _self.mousePosition.position,
                            real: _self.mousePosition.real
                        });
                    });

                }
            },
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mouseup',
                listener: event => {
                    this.$log.debug('mouseup');
                    this.states.mouseDown = false;
                }
            },
            {
                selector: this.constants.css.selectors.canvasMain,
                event: 'mouseleave',
                listener: event => {

                    // TODO I'm still not sure if it should work like that...

                    /*this.$log.debug('mouseleave');
                    this.states.mouseDown = false;

                    $timeout(function() {
                        _self.mousePosition = {};
                    });*/
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
                        parcelX = prevLast + (cells - parcelX);
                    } else {
                        parcelX = parcelX + prevLast - 1;
                    }

                    var _mousePosition = {
                        real: {
                            cell: _parcelX,
                            row: _parcelY
                        },
                        LEDIndex: parcelX,
                        position: position
                    };


                    if(!_.isEqual(_self.mousePosition, _mousePosition)) {
                        $timeout(function () {
                            _self.$log.info('LED Index: %d, Position: %d', parcelX, position);
                            _self.mousePosition = _mousePosition;

                            if(_self.states.mouseDown) {
                                _self.setPixel({
                                    inLed: _self.mousePosition.LEDIndex,
                                    inArray: _self.mousePosition.position,
                                    real: _self.mousePosition.real
                                });
                            }
                        });
                    }
                }
            }
        ];

        this.$rootScope.$on(this.Broadcast.frame.new, function() {
            _self.$log.info('New frame.');
        });

        this.$scope.$watch(this.Collector.selected, function() {
            console.log('selected');
        }, true);
    }

    setCanvas(drawLayer, background) {

        this.$log.info('Setting up canvas...');

        this.canvas.layer = drawLayer;
        this.canvas.layer.context = drawLayer.getContext('2d');

        this.canvas.background = background;
        this.canvas.background.context = background.getContext('2d')

        /**
         * Set canvas to be equal to the drawer holder width and height.
         */
        this.canvas.layer.setAttribute('width', this.constants.drawer.width);
        this.canvas.layer.setAttribute('height', this.constants.drawer.height);

        this.canvas.background.setAttribute('width', this.constants.drawer.width);
        this.canvas.background.setAttribute('height', this.constants.drawer.height);

        this.drawBackground();

    }

    newFrame() {
        if(this._coordinates) {
            this._coordinates.length = 0;
        } else {
            this._coordinates = [];
        }

        this.drawPixel();
    }

    setPixel(position) {
        this._coordinates = this._coordinates || [];
        var find =  _.findWhere(this._coordinates, position);

        if(find) {
            this._coordinates = _.without(this._coordinates, find);
        } else {
            this._coordinates.push(position);
        }

        var pixels = _.pluck(this._coordinates, 'inArray').sort(
            function(a, b){
                return a - b;
            }
        );

        var inLedStrip = _.pluck(this._coordinates, 'inLed').sort(
            function(a, b){
                return a - b;
            }
        );

        if(this._pixels) {
            this._pixels.length = 0;
        }
        this._pixels = this.pixels = inLedStrip;

        this.Collector.frames[this.Collector.selected].setLEDArray(this._pixels.slice(0));

        this.drawPixel(position);
    }

    loadShape() {
        this.$log.info('Drawing the basic shape...');
        this.drawPixel([0,40,80,39,79,119,78,77,117,157,197,237,238,239,199,159,1,2,42,82,81]);
    }

    drawBackground() {
        var top = 0;
        var left = 0;

        var cells = Math.round(this.constants.drawer.width / this.constants.drawer.led.width);
        var rows = Math.round(this.constants.drawer.height / this.constants.drawer.led.height);

        var block = 0;

        for(var a = 0; a < rows; a++) {
            for(var i = 0; i < cells; i++) {
                let index = (i % 2);
                this.canvas.background.context.fillStyle = this.constants.drawer.led.color.empty;
                this.canvas.background.context.rect(left, top, this.constants.drawer.led.width, this.constants.drawer.led.height);
                this.canvas.background.context.lineWidth = 1;
                this.canvas.background.context.strokeStyle = this.constants.drawer.led.color.stroke;
                this.canvas.background.context.fill();
                this.canvas.background.context.stroke();

                this.canvas.background.context.closePath();
                this.canvas.background.context.beginPath();

                left += this.constants.drawer.led.width;
                block++;
            }
            left = 0;
            top += this.constants.drawer.led.height;
        }
    }
    drawPixel(coordinates, isEmpty) {

        // TODO Possibility to draw in different colors (for RGB LED strips).

        if(!coordinates) {
            return;
        }

        coordinates = coordinates || [];
        isEmpty = isEmpty || false;


        /**
         * Calculating real x/y position in pixels.
         * @type {number}
         */
        let left = (coordinates.real.cell - 1) * this.constants.drawer.led.width;
        let top = (coordinates.real.row - 1) * this.constants.drawer.led.height;

        /**
         * Drawing our pixel point.
         * @type {string}
         */
        this.canvas.layer.context.fillStyle = this.constants.drawer.led.color.active;
        this.canvas.layer.context.rect(left, top, this.constants.drawer.led.width, this.constants.drawer.led.height);
        this.canvas.layer.context.lineWidth = 1;
        this.canvas.layer.context.strokeStyle = this.constants.drawer.led.color.stroke;
        this.canvas.layer.context.fill();
        this.canvas.layer.context.stroke();

        this.canvas.layer.context.closePath();
        this.canvas.layer.context.beginPath();

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