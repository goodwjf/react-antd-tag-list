import React, { Component } from 'react'
import { Tag, Input, Tooltip, Icon, Modal, Pagination } from 'antd';
import css from './index.scss'
const confirm = Modal.confirm;

let MyTag = (props) => {
  let type = props.icon.type || 'close'
  let icon = {
    'plus': {
      className: [css['my-tag'], css['tag-action']].join(' '),
      node: (<Icon type="plus" className={css['icon-action']} />)
    },
    'close': {
      className: css['my-tag'],
      node: (<Icon type="close" className={css['icon-action']} onClick={props.icon.event} />)
    }
  }
  return (
    <div 
      className={icon[type].className}
      onClick={props.onClick}
    >
      { props.children }
      { icon[type].node }
    </div>
  )
}

export default class Tasks extends Component {
  state = {
    data: this.props.data,
    tags: [],
    inputVisible: false,
    inputValue: '',
  };

  componentDidMount() {
    this.setState({tags: this.state.data})
  }

  handleClose = (e) => {
    let removedTag = e.target.parentNode.textContent
    confirm({
      title: '提示！',
      content: '确认要删除吗？',
      cancelText: '否',
      okText: '是',
      onOk: () => {
        const tags = this.state.tags.filter(tag => tag !== removedTag);
        const data = this.state.data.filter(tag => tag !== removedTag);
        this.setState({ tags, data }, () => {
          this.selectedTagNode && this.selectedTagNode.classList.add(css['tag-selected'])
        });
        this.props.onRemoved(removedTag, tags)
      }
    });
    e.stopPropagation();
  }

  handleSelected = (e) => {
    if (this.selectedTagNode) {
      this.selectedTagNode.classList.remove(css['tag-selected'])
    }
    this.selectedTagNode = e.target
    this.selectedTagNode.classList.add(css['tag-selected'])
    this.props.onSelected(this.selectedTagNode.textContent)
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let tags = state.tags;
    let data = state.data;
    if (inputValue && data.indexOf(inputValue) === -1) {
      data = [...data, inputValue];
    }
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
      this.props.onAdd(inputValue, tags)
    }
    this.setState({
      data,
      tags,
      inputVisible: false,
      inputValue: '',
    });
  }

  handleInputSearch = (e) => {
    let val = e.target.value
    let tags = this.state.data
    if (val) {
      tags = tags.filter((item) => {
        return item.indexOf(val) !== -1
      })
    }
    this.setState({tags})
  }
  searchInputRef = input => this.searchInput = input
  saveInputRef = input => this.input = input

  render() {
    const { tags, inputVisible, inputValue } = this.state
    const { width, height, pageSize, plusName } = this.props
    return (
      <div>
        <Input
          style={{ width }}
          onPressEnter={this.handleInputSearch}
          ref={this.searchInputRef}
          type="text"
          size="small"
        />
        <div className={css.box} style={{width, height}}>
          {tags.map((tag, index) => {
            const isLongTag = tag.length > 20;
            const tagElem = (
              <MyTag 
                key={tag}
                icon={{
                  type: 'close',
                  event: this.handleClose
                }}
                onClick = {this.handleSelected}
              >
                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
              </MyTag>
            );
            return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
          })}
          {inputVisible && (
            <Input
              ref={this.saveInputRef}
              type="text"
              size="small"
              value={inputValue}
              onChange={this.handleInputChange}
              onBlur={this.handleInputConfirm}
              onPressEnter={this.handleInputConfirm}
            />
          )}
          {!inputVisible && (
            <MyTag
              icon={{
                type:'plus'
              }}
              onClick={this.showInput}
            >
              {plusName}
            </MyTag>
          )}
        </div>
      </div>
    );
  }
}

