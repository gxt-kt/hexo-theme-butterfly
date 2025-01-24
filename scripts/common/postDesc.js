'use strict'

const { stripHTML, truncate } = require('hexo-util')

// Truncates the given content to a specified length, removing HTML tags and replacing newlines with spaces.
// 改成下面的用来修复修改标题带入内容的bug
const truncateContent = (content, length) => {
  // 移除所有 <style> 标签及其内容
  const contentWithoutStyles = content.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/g, '');
  // 移除 <span class="heading-prefix"> 中的内容（即额外添加的 # 前缀）
  const contentWithoutPrefix = contentWithoutStyles.replace(/<span class="heading-prefix">#+<\/span>/g, '');
  // 移除其他 HTML 标签
  const strippedContent = stripHTML(contentWithoutPrefix);
  // 截取内容并替换换行符
  return truncate(strippedContent, { length, separator: ' ' }).replace(/\n/g, ' ');
}

// Generates a post description based on the provided data and theme configuration.
const postDesc = (data, hexo) => {
  const { description, content, postDesc } = data

  if (postDesc) return postDesc

  const { length, method } = hexo.theme.config.index_post_content

  if (method === false) return

  let result
  switch (method) {
    case 1:
      result = description
      break
    case 2:
      result = description || truncateContent(content, length)
      break
    default:
      result = truncateContent(content, length)
  }

  data.postDesc = result
  return result
}

module.exports = { truncateContent, postDesc }
