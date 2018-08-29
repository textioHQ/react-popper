import React, { Component, PureComponent, Children, createElement } from 'react'
import ReactDOM from 'react-dom'
import { Manager, Target, Popper, Arrow } from '../src/react-popper'
import PopperJS from 'popper.js'

import './main.scss'

const Background = () => (
  <div style={{
    backgroundColor: `green`,
    position: `absolute`,
    top: 0,
    zIndex: 1,
    width: `100%`,
    height: `100%`,
  }}></div>
)

class Text extends Component {
    constructor(props) {
        super(props);

        this.state = {
            text: 'hi'
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
              text:
                "a lot of text. a lot of text. a lot of text.a lot of text.a lot of text. a lot of text. a lot of text. a lot of text.a lot of text.a lot of text. a lot of text. a lot of text. a lot of text.a lot of text.a lot of text."
            });
        }, 2000)
    }

    componentDidUpdate() {
      console.log('text updated')
    }
   
    render() {
      console.log('render text')
        return <div style={{color: `black`}}>{this.state.text}</div>
    }
}

class TextWrap extends Component {
  componentDidUpdate() {
    console.log('textwrap updated')
    this.props.onUpdate();
  }

  componentDidMount() {
    console.log('textwrap did mount')

    // React.Children.map(this.props.children, (child) => {
    //   console.log('child', child)
    // })
  }

  shouldComponentUpdate() {
    console.log("shouldComponentUpdate");
    return true;
  }

  render() {
    console.log("render textwrap");
    return (
      <div >
        {this.props.children}
      </div>
    )
  }
}

class App extends Component {
  state = {
    placement: 'top',
    height: 0,
    width: 0,
  }

  refHandlers = {
    popper: (ref) => this.popper = ref
  }

  componentDidMount() {
    this.onTextUpdate();
  }

  onTextUpdate = () => {
    console.log('ontextupdate')
    const height = this.popper && this.popper.clientHeight;
    const width = this.popper && this.popper.clientWidth;
    if(height && height !== this.state.height) {
      this.setState({
        height,
        width,
      })
    }
    // if (this.popper) console.log('this.popper', this.popper.clientHeight)
  }

  render() {
    const modifiers = {
      computeStyle: {
        x: 'top'
      },
      updateBackground: {
        enabled: true,
        fn: (data) => {
          console.log('updateBackground')
          const height = data.offsets.popper.height;
          const width = data.offsets.popper.width;

          if (
            height !== this.state.height ||
            width !== this.state.width
          ) {
            this.setState({
              height,
              width,
            });
          }

          return data;
        }
      }
    };

    const { placement } = this.state
    return (
      <div style={{
        marginTop: 400,
        marginLeft: 200,
      }}>
        <Manager>
          <Target style={{ width: 120, height: 120, background: 'red' }}>
            Box
          </Target>
          <Popper
            className="popper"
            placement={placement}
            modifiers={modifiers}
            innerRef={this.refHandlers.popper}
          >
            {({ popperProps, restProps, scheduleUpdate }) => {
              const style = {
                ...popperProps.style,
                background: `blue`
              };
              return (
                <div {...popperProps} {...restProps} style={style}>
                <TextWrap onUpdate={this.onTextUpdate} >
                      {this.props.children}
                      <Arrow className="popper__arrow" />
                      <Background />
                  </TextWrap>
                </div>
            )}}
          </Popper>
        </Manager>
      </div>
    )
  }
}

ReactDOM.render(<App children={<Text />} />, document.getElementById('app'))
