import React, {Component} from 'react'
import ColorPicker from 'react-color-picker'
import bind from 'lodash/function/bind'
import map from 'lodash/collection/map'

const namespace = 'shadowPlayground'

const fontFamilies = {
    serif: ['Times', 'Times New Roman', 'Georgia', 'serif']
  , sansserif: ['Verdana', 'Arial', 'Helvetica', 'sans-serif']
  , monospace: ['Lucida Console', 'Courier', 'monospace']
  , cursive: ['cursive']
  , fantasy: ['fantasy']
}

export default class View extends Component {
  constructor () {
    super()

    this.state = {
      text: 'Text Shadow Playground'
      , shadow: {
        color: '#000'
        , offsetX: '0.1em'
        , offsetY: '0.1em'
        , blurRadius: '0.1em'
      }
      , style: {
        color: '#000'
        , backgroundColor: '#FFF'
        , fontFamily: fontFamilies.serif
      }
      , activeColor: 'style.color'
    }

    this.setShadow()
  }

// helpers
  setShadow () {
    let {shadow} = this.state
    let {style} = this.state

    style.textShadow = `${shadow.offsetX} ${shadow.offsetY} ${shadow.blurRadius} ${shadow.color}`

    this.setState({style})
  }

// on change methods
  onTextChange (e) {
    let text = e.target.value

    if (!text.length) {
      text = 'Text Shadow Playground'
    }

    this.setState({text})
  }

  onStyleChange (e) {
    var value = e.target.value
      , name = e.target.name
      , style = this.state.style

    style[name] = fontFamilies[value]
    this.setState({style})
  }
  onShadowChange (field, value) {
    const {shadow} = this.state
    // colorpicker sends string, others send event
    if (field !== 'color') {
      value = value.target.value + 'em'
    }

    shadow[field] = value
    this.setState({shadow})
    this.setShadow()
    console.log(this.state)
  }

  onColorDrag (color) {
    let {activeColor} = this.state
    let styleOrShadow = activeColor.split('.')[0]
    let attr = activeColor.split('.')[1]

    let subState = this.state[styleOrShadow]
    subState[attr] = color

    this.setState(subState)

    if (styleOrShadow === 'shadow') {
      this.setShadow()
    }
  }

  onClickColor (field) {
    this.setState({activeColor: field})
  }


// subviews
  fontRadioButtons () {
    var self = this
    return map(fontFamilies, function (_fonts, family){
      return (
        <label
          className={`${namespace}-fontInput`}
          style={{fontFamily: family}}>
          <input
            type="radio"
            name="fontFamily"
            value={family}
            onChange={self.onStyleChange.bind(self)}
          >
            {family}
          </input>
        </label>
        )
    })
  }

  colorBtn (label, color) {
      let attrs = color.split('.')
      let style = {
        backgroundColor: this.state[attrs[0]][attrs[1]]
      }

      let className = `${namespace}-colorBlock`
      if (color === this.state.activeColor) {
        className += ' active'
      }

      return <div
                className={className}
                onClick={this.onClickColor.bind(this, color)}>
                <span style={style}></span>
                {label}
              </div>
  }

  render () {
    return (<div className={namespace}>
      <div  className={`${namespace}-demo`}>
        <h1 style={this.state.style}>{this.state.text}</h1>
      </div>

      <input
        className={`${namespace}-textInput`}
        onChange={bind(this.onTextChange, this)}
        type="text"
        placeholder="Your Text Here"/>

      <div className={`${namespace}-fontStyles`}>
        <div className={`${namespace}-fonts`}>
          <label className={`${namespace}-label--section`}>Font Family</label>
            {this.fontRadioButtons.call(this)}
        </div>

        <div>
          <label className={`${namespace}-label--section`}>
            Text Shadow Properties (em)
          </label>
          <div className={`${namespace}-shadows`}>
            <label>Offset-X
            <input
              onChange={bind(this.onShadowChange, this, 'offsetX')}
              type="number"
              min="-5"
              max="5"
              step="0.01"
              defaultValue="0.1"
              name="offsetX" />
            </label>

            <label>Offset-Y
            <input
              onChange={bind(this.onShadowChange, this, 'offsetY')}
              type="number"
              min="-5"
              max="5"
              step="0.01"
              defaultValue="0.1"
              name="offsetY" />
            </label>

            <label>Blur Radius
              <input
                onChange={bind(this.onShadowChange, this, 'blurRadius')}
                type="number"
                min="0"
                max="5"
                step="0.01"
                defaultValue="0.1"
                name="blurRadius" />
            </label>
          </div>
        </div>

        <div>
          <label className={`${namespace}-label--section`}>Colors</label>
          <div className={`${namespace}-colors`}>

            <div className={`${namespace}-colorLabels`}>
              {this.colorBtn.call(this, 'Text', 'style.color')}
              {this.colorBtn.call(this, 'Background', 'style.backgroundColor')}
              {this.colorBtn.call(this, 'Shadow', 'shadow.color')}
            </div>

            <ColorPicker
              defaultValue={this.state.style.color}
              onDrag={this.onColorDrag.bind(this)}/>
          </div>
        </div>

      </div>

      <div className={`${namespace}-code`}>
        <h3>Generated CSS</h3>
        <pre><code>{JSON.stringify(this.state.style, null, 2)}</code></pre>
      </div>
    </div>)
  }
}
