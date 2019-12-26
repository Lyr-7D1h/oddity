import React, { useState, useEffect } from 'react'
import requester from '../helpers/requester'
import notificationHandler from '../helpers/notificationHandler'
import { Button, Row, Col, Collapse, Icon, Input, Empty } from 'antd'
import HTML5Backend from 'react-dnd-html5-backend'
import { DndProvider, DragSource, DropTarget } from 'react-dnd'
import ActionPopup from './ActionPopup'

const RoutingTable = ({ config, updateConfig }) => {
  const [items, setItems] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const forumInput = React.createRef()
  let dragingIndex = -1

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await requester.get('forum/categories')
        const threads = await requester.get('forum/threads')
        setItems(
          categories.map(category => {
            category.threads = threads.filter(
              thread => thread.categoryId === category._id
            )
            return category
          })
        )
      } catch (err) {
        console.error(err)
        notificationHandler.error('Could not fetch data', err.message)
      }
    }
    fetchData()
  }, [])

  const handleSave = () => {
    const newItems = [...items]

    const categories = []
    let threads = []
    for (let i in newItems) {
      newItems[i].threads = newItems[i].threads.map(thread => {
        thread.categoryId = newItems[i]._id
        return thread
      })
      threads = threads.concat(newItems[i].threads)
      delete newItems[i].threads
      categories.push(newItems[i])
    }

    console.log(categories, threads)

    requester
      .put(`forum/categories`, categories)
      .then(categories => {
        requester
          .put('forum/threads', threads)
          .then(threads => {
            console.log(threads)
            setItems(
              categories.map(category => {
                category.threads = threads.filter(
                  thread => thread.categoryId === category._id
                )
                return category
              })
            )
            notificationHandler.success(`Updated Categories`)
            setHasChanges(false)
          })
          .catch(err => {
            notificationHandler.error('Updating failed', err.message)
          })
      })
      .catch(err => {
        notificationHandler.error('Updating failed', err.message)
      })
  }

  const handleDelete = (categoryIndex, threadIndex) => {
    const newItems = [...items]
    if (!isNaN(threadIndex)) {
      newItems[categoryIndex].threads.splice(threadIndex, 1)
    } else {
      newItems.splice(categoryIndex, 1)
    }
    setItems(newItems)
    setHasChanges(true)
  }

  const handleCreateThread = () => {
    const newItems = [...items]
    newItems.map(item => {
      if (item.name === 'Uncategorized') {
        item.threads.push({
          name: forumInput.current.state.value
        })
      }

      return item
    })
    setItems(newItems)
    setHasChanges(true)
  }
  const handleCreateCategory = () => {
    const newItems = [...items]
    newItems.push({
      name: forumInput.current.state.value,
      threads: []
    })
    setItems(newItems)
    setHasChanges(true)
  }

  const Thread = ({
    categoryIndex,
    threadIndex,
    name,
    isOver,
    connectDragSource,
    connectDropTarget,
    moveRow,
    ...restProps
  }) => {
    let { className } = restProps
    if (isOver) {
      if (threadIndex > dragingIndex) {
        className += ' oddity-dnd-downward'
      }
      if (threadIndex < dragingIndex) {
        className += ' oddity-dnd-upward'
      }
    }

    return connectDragSource(
      connectDropTarget(
        <div index={threadIndex} thread="true" className={className}>
          {name}
          <div
            onClick={() => handleDelete(categoryIndex, threadIndex)}
            className="oddity-collapse-delete"
          >
            <Icon type="delete" />
          </div>
        </div>
      )
    )
  }

  const ThreadDnD = DropTarget(
    'thread',
    {
      drop(props, monitor) {
        const sourceCategoryIndex = monitor.getItem().categoryIndex
        const sourceThreadIndex = monitor.getItem().threadIndex

        const targetCategoryIndex = props.categoryIndex
        const targetThreadIndex = props.threadIndex

        // if NOT same category return
        if (sourceCategoryIndex !== targetCategoryIndex) {
          return
        }

        // if same thread return
        if (sourceThreadIndex === targetThreadIndex) {
          return
        }

        // Time to actually perform the action
        const newItems = [...items]

        const temp = newItems[sourceCategoryIndex].threads[sourceThreadIndex]

        newItems[sourceCategoryIndex].threads[sourceThreadIndex] =
          newItems[sourceCategoryIndex].threads[targetThreadIndex]

        newItems[sourceCategoryIndex].threads[targetThreadIndex] = temp

        setItems(newItems)
        setHasChanges(true)

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().threadIndex = targetThreadIndex
      }
    },
    (connect, monitor) => ({
      connectDropTarget: connect.dropTarget(),
      isOver: monitor.isOver()
    })
  )(
    DragSource(
      'thread',
      {
        beginDrag(props) {
          dragingIndex = props.index
          return {
            categoryIndex: props.categoryIndex,
            threadIndex: props.threadIndex
          }
        }
      },
      connect => ({
        connectDragSource: connect.dragSource()
      })
    )(Thread)
  )

  const Category = ({
    index,
    name,
    isOver,
    itemType,
    connectDragSource,
    connectDropTarget,
    moveRow,
    ...restProps
  }) => {
    let { className } = restProps
    if (isOver) {
      if (itemType === 'thread') {
        className += ' oddity-dnd-select'
      } else {
        if (index > dragingIndex) {
          className += ' oddity-dnd-downward'
        }
        if (index < dragingIndex) {
          className += ' oddity-dnd-upward'
        }
      }
    }

    if (name === 'Uncategorized') {
      return (
        <div index={index} className="oddity-collapsable-disabled-header">
          {name}
        </div>
      )
    }

    return connectDragSource(
      connectDropTarget(
        <div index={index} className={className}>
          {name}

          <div
            onClick={() => handleDelete(index)}
            className="oddity-collapse-delete"
          >
            <Icon type="delete" />
          </div>
        </div>
      )
    )
  }

  const CategoryDnD = DropTarget(
    ['category', 'thread'],
    {
      drop(props, monitor) {
        const newItems = [...items]
        if (monitor.getItemType() === 'thread') {
          const categoryIndex = monitor.getItem().categoryIndex
          const threadIndex = monitor.getItem().threadIndex

          // make sure its not the same category
          if (categoryIndex === props.index) {
            return
          }

          // if dropping a thread
          const temp = newItems[categoryIndex].threads[threadIndex] // save value temporarly
          newItems[categoryIndex].threads.splice(threadIndex, 1) // remove from old category
          newItems[props.index].threads.push(temp) // add to new category
        } else {
          const hoverIndex = props.index
          const dragIndex = monitor.getItem().index

          // Don't replace items with themselves
          if (dragIndex === hoverIndex) {
            return
          }
          // if sorting a category
          const temp = newItems[hoverIndex]
          newItems[hoverIndex] = newItems[dragIndex]
          newItems[dragIndex] = temp

          // Note: we're mutating the monitor item here!
          // Generally it's better to avoid mutations,
          // but it's good here for the sake of performance
          // to avoid expensive index searches.
          monitor.getItem().index = hoverIndex
        }

        setItems(newItems)
        setHasChanges(true)
      }
    },
    (connect, monitor) => {
      return {
        connectDropTarget: connect.dropTarget(),
        itemType: monitor.getItemType(),
        isOver: monitor.isOver()
      }
    }
  )(
    DragSource(
      'category',
      {
        beginDrag(props) {
          dragingIndex = props.index
          return {
            index: props.index
          }
        }
      },
      connect => ({
        connectDragSource: connect.dragSource()
      })
    )(Category)
  )

  const uncategorizedIndex = items.findIndex(
    item => item.name === 'Uncategorized'
  )
  return (
    <>
      {hasChanges && (
        <ActionPopup>
          <div>
            <div style={{ marginBottom: 15 }}>You have unsaved changes</div>

            <Button type="oddity" onClick={handleSave} block>
              Save Changes
            </Button>
          </div>
        </ActionPopup>
      )}
      <Input ref={forumInput} placeholder="Title" />
      <Row style={{ marginBottom: '30px' }}>
        <Col span={12}>
          <Button onClick={handleCreateCategory} type="primary" block>
            Create Category
          </Button>
        </Col>
        <Col span={12}>
          <Button onClick={handleCreateThread} block>
            Create Thread
          </Button>
        </Col>
      </Row>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <Collapse defaultActiveKey={uncategorizedIndex + 1}>
            {items.map((item, i) => (
              <Collapse.Panel
                disabled={item.name === 'Uncategorized' ? true : false}
                showArrow={item.name === 'Uncategorized' ? false : true}
                className="oddity-collapsable-custom"
                header={
                  <CategoryDnD
                    index={i}
                    className="oddity-collapsable-custom-header"
                    name={item.name}
                  />
                }
                key={i + 1}
              >
                {item.threads.map((thread, j) => (
                  <ThreadDnD
                    className="oddity-thread-card"
                    categoryIndex={i}
                    threadIndex={j}
                    index={j}
                    key={j}
                    name={thread.name}
                  />
                ))}
              </Collapse.Panel>
            ))}
          </Collapse>
        </DndProvider>
      )}
    </>
  )
}

export default RoutingTable
