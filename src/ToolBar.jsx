import React from 'react'
import { Select, MenuItem, Tooltip } from '@material-ui/core'
import { BlockPicker } from 'react-color'
import { Icon } from '../components.jsx'
import classNames from 'classnames'

function Code() {
  return (
    <div className="d-flex flex-items-center mr-3 cursor-pointer">
      <Tooltip title="显示源码">
        <Icon>code</Icon>
      </Tooltip>
    </div>
  )
}

function Link() {
  return (
    <div className="d-flex flex-items-center mr-3">
      <Tooltip title="超链接">
        <Icon>link</Icon>
      </Tooltip>
    </div>
  )
}

function FontSize() {
  return (
    <div className="d-flex flex-items-center mr-3">
      <Select value={0}>
        <MenuItem value={0} disabled>
          <Icon className="ml-1">format_size</Icon>&nbsp;字号
        </MenuItem>
        <MenuItem value={10}>10px</MenuItem>
        <MenuItem value={12}>12px</MenuItem>
        <MenuItem value={14}>14px</MenuItem>
        <MenuItem value={16}>16px</MenuItem>
      </Select>
    </div>
  )
}

function FormatBold({ value, editor }) {
  console.log(value.activeMarks)
  return (
    <div
      onClick={() => {
        editor.toggleMark('bold')
      }}
      className={classNames({
        'd-flex flex-items-center mr-3': true,
        'text-gray-dark': value.activeMarks.some(mark => mark.type === 'bold')
      })}
    >
      <Tooltip title="加粗">
        <Icon className="ml-1">format_bold</Icon>
      </Tooltip>
    </div>
  )
}

function FormatItalic({ value, editor }) {
  return (
    <div
      onClick={() => {
        editor.toggleMark('italic')
      }}
      className={classNames({
        'd-flex flex-items-center mr-3': true,
        'text-gray-dark': value.activeMarks.some(mark => mark.type === 'italic')
      })}
    >
      <Tooltip title="斜体">
        <Icon className="ml-1">format_italic</Icon>
      </Tooltip>
    </div>
  )
}

class ColorPicker extends React.Component {
  state = {
    showPicker: false,
    selectedColor: '#000'
  }

  togglePicker = () => {
    this.setState(state => ({
      showPicker: !state.showPicker
    }))
  }

  handlePickerChange = (color, event) => {
    this.setState({
      selectedColor: color.hex
    })
  }

  render() {
    const { showPicker, selectedColor } = this.state
    return (
      <div className="d-flex flex-items-center mr-3 position-relative user-select-none">
        <div className="d-flex flex-items-center" onClick={this.togglePicker}>
          <Icon className="ml-1">color_lens</Icon>
          <div
            style={{
              border: '1px solid #333',
              padding: '2px 5px'
            }}
            className="ml-1"
          >
            <div
              style={{
                backgroundColor: selectedColor,
                width: 30,
                height: 10
              }}
            />
          </div>
        </div>

        {showPicker && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 99
            }}
            onClick={this.togglePicker}
          />
        )}
        {showPicker && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 4px)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 999,
              boxShadow:
                '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
            }}
          >
            <BlockPicker
              color={selectedColor}
              colors={['#00b4cc', 'red', '#333', '#666', '#999']}
              onChange={this.handlePickerChange}
            />
          </div>
        )}
      </div>
    )
  }
}

class UploadImage extends React.Component {
  render() {
    return (
      <div className="d-flex flex-items-center mr-3">
        <Tooltip title="上传图片">
          <Icon className="ml-1">image</Icon>
        </Tooltip>
      </div>
    )
  }
}

function FormatListBulleted() {
  return (
    <div className="d-flex flex-items-center mr-3">
      <Tooltip title="无序列表">
        <Icon className="ml-1">format_list_bulleted</Icon>
      </Tooltip>
    </div>
  )
}

function FormatListNumbered() {
  return (
    <div className="d-flex flex-items-center mr-3">
      <Tooltip title="有序列表">
        <Icon className="ml-1">format_list_numbered</Icon>
      </Tooltip>
    </div>
  )
}

class ToolBar extends React.Component {
  render() {
    const { value, editor } = this.props
    return (
      <div
        className="text-gray pb-2 mb-3 d-flex user-select-none"
        style={{ borderBottom: '2px solid #eee' }}
      >
        <Code value={value} />
        <Link />
        <FontSize />
        <FormatBold value={value} editor={editor} />
        <FormatItalic value={value} editor={editor} />
        <ColorPicker />
        <UploadImage />
        <FormatListBulleted />
        <FormatListNumbered />
      </div>
    )
  }
}

export { ToolBar }
