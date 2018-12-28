import React from 'react'
import { Value } from 'slate'
import Html from 'slate-html-serializer'
import json from './value.json'

const rules = [
  {
    // 块级反序列化
    deserialize(el, next) {
      const tagName = el.tagName.toLowerCase()
      switch (tagName) {
        case 'p': {
          return {
            object: 'block',
            type: 'paragraph',
            data: {
              className: el.getAttribute('class')
            },
            nodes: next(el.childNodes)
          }
        }
        case 'ul': {
          return {
            object: 'block',
            type: 'bulleted-list',
            nodes: next(el.childNodes)
          }
        }
        case 'ol': {
          return {
            object: 'block',
            type: 'numbered-list',
            nodes: next(el.childNodes)
          }
        }
        case 'li': {
          return {
            object: 'block',
            type: 'list-item',
            nodes: next(el.childNodes)
          }
        }
      }
    },

    // 块级序列化
    serialize(obj, children) {
      if (obj.object === 'block') {
        switch (obj.type) {
          case 'paragraph': {
            return <p className={obj.data.get('className')}>{children}</p>
          }
          case 'block-quote': {
            return <blockquote>{children}</blockquote>
          }
        }
      }
    }
  },
  {
    // 内联反序列化
    deserialize(el, next) {
      const tagName = el.tagName.toLowerCase()
      switch (tagName) {
        case 'span': {
          return {
            object: 'text',
            type: 'text-blue',
            nodes: next(el.childNodes)
          }
        }
      }
    },
    // 内联序列化
    serialize(obj, children) {
      if (obj.object === 'mark') {
        switch (obj.type) {
          case 'bold': {
            return (
              <strong className={obj.data.get('className')}>{children}</strong>
            )
          }
          case 'italic': {
            return <i>{children}</i>
          }
          case 'code': {
            return <code>{children}</code>
          }
        }
      }
    }
  }
]

export const html = new Html({ rules })
