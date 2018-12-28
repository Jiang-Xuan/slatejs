import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react'
import { isKeyHotkey } from 'is-hotkey'
import { Toolbar, Button, Icon } from './components'
import { htmlSourceCode } from './html-value'
import { isInFrame } from './utils'
import { html } from './serializer.jsx'

import './serializer.jsx'

import './style.css'

class Color {
  constructor(r, g, b, a = 1) {
    this.r = r
    this.g = g
    this.b = b
    this.a = a
  }
  toString() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`
  }
}

const SPEC_COLOR_RED = new Color(234, 67, 53, 1)
const SPEC_COLOR_GREEN = new Color(82, 196, 26, 1)
const SPEC_COLOR_BLUE = new Color(0, 180, 204, 1)
const SPEC_COLOR_ORANGEYELLOW = new Color(251, 192, 46, 1)

const DEFAULT_NODE = 'paragraph'

const isBoldHotkey = isKeyHotkey('mod+b')
const isItalicHotkey = isKeyHotkey('mod+i')
const isUnderlinedHotkey = isKeyHotkey('mod+u')
const isCodeHotkey = isKeyHotkey('mod+`')

class App extends React.Component {
  state = {
    value: html.deserialize(htmlSourceCode)
  }

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      // 序列化 value
      // 如果在 iframe 中, 将数据抛给父级页面
      if (isInFrame()) {
        console.log(html.serialize(htmlSourceCode))
      }
    }
    this.setState({
      value
    })
  }

  ref = editor => {
    this.editor = editor
  }

  hasMark = type => {
    const { value } = this.state

    return value.activeMarks.some(mark => mark.type === type)
  }

  hasBlock = type => {
    const { value } = this.state

    return value.blocks.some(node => node.type === type)
  }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold': {
        return <strong {...attributes}>{children}</strong>
      }
      case 'code': {
        return (
          <code
            style={{
              borderRadius: '2px',
              padding: '1px 2px',
              backgroundColor: '#ccc'
            }}
            {...attributes}
          >
            {children}
          </code>
        )
      }
      case 'italic': {
        return (
          <i style={{ fontStyle: 'italic' }} {...attributes}>
            {children}
          </i>
        )
      }
      case 'underlined': {
        return (
          <span style={{ textDecoration: 'underline' }} {...attributes}>
            {children}
          </span>
        )
      }
      case 'text-red': {
        return (
          <span
            style={{
              color: SPEC_COLOR_RED.toString()
            }}
            {...attributes}
          >
            {children}
          </span>
        )
      }

      case 'text-green': {
        return (
          <span
            style={{
              color: SPEC_COLOR_GREEN.toString()
            }}
            {...attributes}
          >
            {children}
          </span>
        )
      }

      case 'text-blue': {
        return (
          <span
            style={{
              color: SPEC_COLOR_BLUE.toString()
            }}
            {...attributes}
          >
            {children}
          </span>
        )
      }

      case 'text-orangeyellow': {
        return (
          <span
            style={{
              color: SPEC_COLOR_ORANGEYELLOW.toString()
            }}
            {...attributes}
          >
            {children}
          </span>
        )
      }

      default: {
        return next()
      }
    }
  }

  renderNode = (props, editor, next) => {
    const { attributes, children, node } = props

    switch (node.type) {
      case 'paragraph': {
        return <p {...attributes}>{children}</p>
      }
      case 'block-quote': {
        return (
          <blockquote
            style={{
              borderLeft: '2px solid #ddd',
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 10,
              color: '#aaa',
              fontStyle: 'italic'
            }}
            {...attributes}
          >
            {children}
          </blockquote>
        )
      }
      case 'heading-one': {
        return <h1 {...attributes}>{children}</h1>
      }
      case 'heading-two': {
        return <h2 {...attributes}>{children}</h2>
      }
      case 'bulleted-list': {
        return <ul {...attributes}>{children}</ul>
      }
      case 'numbered-list': {
        return <ol {...attributes}>{children}</ol>
      }
      case 'list-item': {
        return (
          <li style={{ listStylePosition: 'inside' }} {...attributes}>
            {children}
          </li>
        )
      }
      default: {
        return next()
      }
    }
  }

  render() {
    const { value } = this.state
    return (
      <div style={{ padding: 20 }}>
        <Toolbar>
          {this.renderMarkButton('bold', 'format_bold')}
          {this.renderMarkButton('italic', 'format_italic')}
          {this.renderMarkButton('underlined', 'format_underlined')}
          {this.renderMarkButton('code', 'code')}
          {this.renderMarkButton('text-red', 'format_color_text', {
            color: `rgba(${SPEC_COLOR_RED.r}, ${SPEC_COLOR_RED.g}, ${
              SPEC_COLOR_RED.b
            }, .2)`,
            activeColor: SPEC_COLOR_RED.toString()
          })}
          {this.renderMarkButton('text-green', 'format_color_text', {
            color: `rgba(${SPEC_COLOR_GREEN.r}, ${SPEC_COLOR_GREEN.g}, ${
              SPEC_COLOR_GREEN.b
            }, .2)`,
            activeColor: SPEC_COLOR_GREEN.toString()
          })}
          {this.renderMarkButton('text-blue', 'format_color_text', {
            color: `rgba(${SPEC_COLOR_BLUE.r}, ${SPEC_COLOR_BLUE.g}, ${
              SPEC_COLOR_BLUE.b
            }, .2)`,
            activeColor: SPEC_COLOR_BLUE.toString()
          })}
          {this.renderMarkButton('text-orangeyellow', 'format_color_text', {
            color: `rgba(${SPEC_COLOR_ORANGEYELLOW.r}, ${
              SPEC_COLOR_ORANGEYELLOW.g
            }, ${SPEC_COLOR_ORANGEYELLOW.b}, .2)`,
            activeColor: SPEC_COLOR_ORANGEYELLOW.toString()
          })}
          {this.renderBlockButton('paragraph', 'local_parking')}
          {this.renderBlockButton('heading-one', 'looks_one')}
          {this.renderBlockButton('heading-two', 'looks_two')}
          {this.renderBlockButton('block-quote', 'format_quote')}
          {this.renderBlockButton('numbered-list', 'format_list_numbered')}
          {this.renderBlockButton('bulleted-list', 'format_list_bulleted')}
          {this.renderBlockButton('image', 'add_a_photo')}
        </Toolbar>
        <Editor
          value={value}
          spellCheck={false}
          ref={this.ref}
          renderNode={this.renderNode}
          renderMark={this.renderMark}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
      </div>
    )
  }

  onKeyDown = (event, editor, next) => {
    let mark

    if (isBoldHotkey(event)) {
      mark = 'bold'
    } else if (isItalicHotkey(event)) {
      mark = 'italic'
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined'
    } else if (isCodeHotkey(event)) {
      mark = 'code'
    } else {
      return next()
    }

    event.preventDefault()
    editor.toggleMark(mark)
  }

  renderMarkButton = (type, icon, props = {}) => {
    const isActive = this.hasMark(type)

    return (
      <Button
        isActive={isActive}
        onMouseDown={event => this.onClickMark(event, type)}
        {...props}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  renderBlockButton = (type, icon, props = {}) => {
    let isActive = this.hasBlock(type)

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const {
        value: { document, blocks }
      } = this.state

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key)
        isActive = this.hasBlock('list-item') && parent && parent.type === type
      }
    }

    return (
      <Button
        isActive={isActive}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    )
  }

  onClickMark = (event, type) => {
    event.preventDefault()
    if (
      ['text-red', 'text-green', 'text-blue', 'text-orangeyellow'].includes(
        type
      )
    ) {
      this.editor
        .removeMark('text-red')
        .removeMark('text-green')
        .removeMark('text-blue')
        .removeMark('text-orangeyellow')

      if (this.hasMark(type)) {
        this.editor.removeMark(type)
      } else {
        this.editor.addMark(type)
      }
      return
    }
    this.editor.toggleMark(type)
  }

  onClickBlock = (event, type) => {
    event.preventDefault()

    const { editor } = this
    const { value } = editor
    const { document } = value

    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type)

      if (type === 'paragraph' && isActive) {
        const parentIsListItem = value.blocks.some(block => {
          return document.getClosest(
            block.key,
            parent => parent.type === 'list-item'
          )
        })
        if (parentIsListItem) {
          editor.unwrapBlock('paragraph')
          return
        }
      }

      const isList = this.hasBlock('list-item')
      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type)
      }
    } else {
      const isList = this.hasBlock('list-item')
      const isType = value.blocks.some(block => {
        return document.getClosest(block.key, parent => parent.type === type)
      })

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list')
        return
      } else if (isList) {
        editor.unwrapBlock(
          type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
        )

        editor.wrapBlock(type)
        return
      } else {
        editor.setBlocks('list-item').wrapBlock(type)
        return
      }
    }
  }
}

const rootElement = document.getElementById('root')

ReactDOM.render(<App />, rootElement)
