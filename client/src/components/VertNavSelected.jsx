import React from 'react'
import { Menu, Skeleton } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'

/**
 * Verticle Navigation for custom functions on click
 * @param {Array[Object]} items - List of items
 * @param selected - Selected id
 * @param {Function} onClick - Function when item clicked
 */
export default ({ items, selected: selectedProps, onClick }) => {
  const [selected, setSelected] = useState(selectedProps)

  useEffect(() => setSelected(selectedProps), [selectedProps])

  const handleClick = (id) => {
    onClick(id)
    setSelected(id)
  }

  if (items === null) {
    return <Skeleton active />
  }

  return (
    <Menu
      className="oddity-nav"
      defaultSelectedKeys={['' + selected]}
      mode="inline"
    >
      {items.map((item, i) => (
        <Menu.Item icon={item.icon} key={'' + item.id}>
          <a onClick={() => handleClick(item.id)}>{item.name}</a>
        </Menu.Item>
      ))}
    </Menu>
  )
}
