/**
 * https://github.com/grevory/angular-local-storage
 */
class DrawerDirective {
    constructor() {
        'ngInject';

        // TODO Possibility to re-edit the previous frames..
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
    constructor($rootScope, $timeout, $scope, $log, $element, Broadcast, Collector, Socket) {
        'ngInject';

        var _self = this;

        this.$log = $log;
        this.$element = $element[0];
        this.$timeout = $timeout;
        this.$rootScope = $rootScope;
        this.$scope = $scope;
        this.Broadcast = Broadcast;
        this.Collector = Collector;
        this.Socket = Socket;

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
                        stroke: '#fff'
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

                    this.$log.debug('mouseleave');
                    this.states.mouseDown = false;

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

        this.$rootScope.$on(this.Broadcast.frame.selected, function(additional, index) {
            _self.$log.info('Selected frame is %s', index);
            _self.loadShape(_self.Collector.frames[index])
        });

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

        this.Collector.frames[this.Collector.selected].setCoordinates(position, this.Collector.tools.selectedIndex);

        var inLedStrip = _.pluck(this.Collector.frames[this.Collector.selected].getCoordinates(), 'inLed').sort(
            function(a, b){
                return a - b;
            }
        );

        if(this._pixels) {
            this._pixels.length = 0;
        }
        this._pixels = this.pixels = inLedStrip;

        this.drawPixel(position);
    }

    loadShape(frame) {
        this.$log.info('Drawing the basic shape...');

        var _self = this;

        /**
         * Get LED array from current frame's object.
         * @type {Array.<T>}
         */
        var inLedStrip = _.pluck(this.Collector.frames[this.Collector.selected].getCoordinates(), 'inLed').sort(
            function(a, b){
                return a - b;
            }
        );

        /**
         * Clear collection.
         */
        if(this._pixels) {
            this._pixels.length = 0;
        }

        /**
         * Clear stage before
         * drawing shape.
         */
        _self.clearDrawer();

        /**
         * Draw shape - pixel by pixel.
         */
        this.Collector.frames[this.Collector.selected].getCoordinates().forEach(function(cr) {
            _self.drawPixel(cr, false, true);
        });


        /**
         * Set up new 'pixels' collection.
         * @type {Array.<T>}
         * @private
         */
        this._pixels = this.pixels = inLedStrip;
    }

    /**
     * Draw grid as a background.
     */
    drawBackground() {

        /**
         * Where to start drawing.
         * @type {{top: number, left: number}}
         */
        var position = {
            top: 0,
            left: 0
        };

        /**
         * Calculating the count of cells & rows.
         * @type {number}
         */
        var cells = Math.round(this.constants.drawer.width / this.constants.drawer.led.width);
        var rows = Math.round(this.constants.drawer.height / this.constants.drawer.led.height);

        var block = 0;

        for(var a = 0; a < rows; a++) {
            for(var i = 0; i < cells; i++) {
                let index = (i % 2);
                this.canvas.background.context.fillStyle = this.constants.drawer.led.color.empty;
                this.canvas.background.context.rect(position.left, position.top, this.constants.drawer.led.width, this.constants.drawer.led.height);
                this.canvas.background.context.lineWidth = 1;
                this.canvas.background.context.strokeStyle = this.constants.drawer.led.color.stroke;
                this.canvas.background.context.fill();
                this.canvas.background.context.stroke();

                this.canvas.background.context.closePath();
                this.canvas.background.context.beginPath();

                position.left += this.constants.drawer.led.width;
                block++;
            }

            position.left = 0;
            position.top += this.constants.drawer.led.height;
        }
    }
    clearDrawer() {
        this.canvas.layer.context.clearRect(0, 0, this.canvas.layer.width, this.canvas.layer.height);
    }
    drawPixel(coordinates, isEmpty, skipTool) {


        // TODO Possibility to draw in different colors (for RGB LED strips).

        if(!coordinates) {
            return;
        }

        console.log('drawing: %O', coordinates);

        // TODO performance tests
        //this.Socket.emit('led:matrix', this._pixels);

        coordinates = coordinates || [];
        isEmpty = isEmpty || false;
        skipTool = skipTool || false;


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

        if(this.Collector.tools.selectedIndex === 0 || skipTool) {
            this.canvas.layer.context.fillStyle = this.constants.drawer.led.color.active;
            this.canvas.layer.context.rect(left, top, this.constants.drawer.led.width, this.constants.drawer.led.height);
            this.canvas.layer.context.lineWidth = 1;
            this.canvas.layer.context.strokeStyle = this.constants.drawer.led.color.stroke;
            this.canvas.layer.context.fill();
            this.canvas.layer.context.stroke();
        } else {
            this.canvas.layer.context.clearRect(left, top, this.constants.drawer.led.width, this.constants.drawer.led.height);
        }

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