import { createElement } from "inferno-create-element";
import { Component } from "inferno";

/** @internal 
	* Function pretty much copied from infernojs - Route.ts
  */
function rest(object, excluded) {
  const t = {};
  for (let p in object) {
    if (excluded.indexOf(p) < 0) {
      t[p] = object[p];
    }
  }
  return t;
}

export default class LazyLoader extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      child: null
    };
    this.context = context;
    this.lazyLoad = props.lazyLoad;
    this.children = props.children;
    this.loadComponent = this.loadComponent.bind(this);
  }

  loadComponent(componentName, props) {
    let finalProps;
    if (!props) {
      finalProps = rest(this.props, ["lazyLoad", "children"]);
    } else {
      finalProps = Object.assign({}, props, rest(this.props, ["lazyLoad", "children"]));
    }

    this.setState({
      child: createElement(componentName, finalProps, this.children)
    });
  }

  componentWillMount() {
    this.lazyLoad(this.loadComponent, {props: this.props, router: this.context.router});
  }

  render() {
    return this.state.child ? this.state.child : null;
  }
}
