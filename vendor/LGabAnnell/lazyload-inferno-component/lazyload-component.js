"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var inferno_create_element_1 = require("inferno-create-element");
var inferno_component_1 = require("inferno-component");
/** @internal
    * Function pretty much copied from infernojs - Route.ts
  */
function rest(object, excluded) {
    var t = {};
    for (var p in object) {
        if (excluded.indexOf(p) < 0) {
            t[p] = object[p];
        }
    }
    return t;
}
var LazyLoader = /** @class */ (function (_super) {
    __extends(LazyLoader, _super);
    function LazyLoader(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {
            child: null
        };
        _this.context = context;
        _this.lazyLoad = props.lazyLoad;
        _this.children = props.children;
        _this.loadComponent = _this.loadComponent.bind(_this);
        return _this;
    }
    LazyLoader.prototype.loadComponent = function (componentName, props) {
        var finalProps;
        if (!props) {
            finalProps = rest(this.props, ["lazyLoad", "children"]);
        }
        else {
            finalProps = Object.assign({}, props, rest(this.props, ["lazyLoad", "children"]));
        }
        this.setState({
            child: inferno_create_element_1.default(componentName, finalProps, this.children)
        });
    };
    LazyLoader.prototype.componentWillMount = function () {
        this.lazyLoad(this.loadComponent, { props: this.props, router: this.context.router });
    };
    LazyLoader.prototype.render = function () {
        return this.state.child ? this.state.child : null;
    };
    return LazyLoader;
}(inferno_component_1.default));
exports.default = LazyLoader;
