import React from 'react'
import ReactDOM from 'react-dom'
import { Editor } from 'slate-react'
import { Value } from 'slate'
import { ToolBar } from './ToolBar.jsx'

import './styles.css'

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text:
                  '日前，ImmunoGen公司宣布该公司的在研抗体药物偶联物(antibody drug conjugate, ADC) mirvetuximab soravtansine在与默沙东(MSD)的抗PD-1疗法pembrolizumab联合治疗对铂类疗法产生抗性的上皮性卵巢癌(epithelial ovarian cancer, EOC)的临床1b/2期试验中获得积极疗效和耐受性数据。这一临床数据已经在三月24-27日在新奥尔良举行的妇科肿瘤学会(Society of Gynecologic Oncology)年会上发布。'
              }
            ]
          }
        ]
      }
    ]
  }
})

// Define a React component renderer for our code blocks.
function CodeNode(props) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: initialValue,

      toolBar: {}
    }
  }

  onChange({ value }) {
    this.setState({
      value
    })
  }

  ref = editor => {
    this.editor = editor
  }

  // Add a `renderNode` method to render a `CodeNode` for code blocks.
  renderNode = (props, editor, next) => {
    switch (props.node.type) {
      case 'code':
        return <CodeNode {...props} />
      default:
        return next()
    }
  }

  renderMark = (props, editor, next) => {
    const { children, mark, attributes } = props

    switch (mark.type) {
      case 'bold': {
        return <strong {...attributes}>{children}</strong>
      }
      case 'italic': {
        return <i {...attributes}>{children}</i>
      }

      default: {
        return next()
      }
    }
  }

  onKeyDown(event, editor, next) {
    if (event.key != '`' || !event.ctrlKey) return next()

    event.preventDefault()

    // Determine whether any of the currently selected blocks are code blocks.
    const isCode = editor.value.blocks.some(block => block.type == 'code')

    // Toggle the block type depending on `isCode`.
    editor.setBlocks(isCode ? 'paragraph' : 'code')
  }

  render() {
    return (
      <div className="p-3 mx-2 bg-white">
        <ToolBar editor={this.editor} value={this.state.value} />
        <Editor
          ref={this.ref}
          value={this.state.value}
          onChange={this.onChange.bind(this)}
          onKeyDown={this.onKeyDown.bind(this)}
          renderNode={this.renderNode.bind(this)}
          renderMark={this.renderMark}
        />
      </div>
    )
  }
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
