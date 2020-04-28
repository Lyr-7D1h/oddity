import React, { useEffect, useState } from 'react'
import { setCaller, removeCaller, setCallerError } from 'Actions/saveActions'
import { connect } from 'react-redux'
import notificationHandler from './notificationHandler'

export default (Component, id) => {
  let saveHandler
  let resetHandler
  let hasChanges

  return connect((state) => ({ saveAttempt: state.save.saveAttempt }))(
    ({ dispatch, saveAttempt, ...props }) => {
      const [initialValues, setInitialValues] = useState(null)

      props.setSaveHandler = (promise) => {
        // prevent multiple call
        if (!saveHandler) {
          saveHandler = promise
        } else {
          console.error('Save Handler already set')
        }
      }

      props.setResetHandler = (callback) => {
        if (!resetHandler) {
          resetHandler = callback
        } else {
          console.error('Reset Handler already set')
        }
      }

      // only if saveHandler is defined
      // when this is called the component is registered
      props.setHasChanges = () => {
        if (!saveHandler) {
          return console.error(
            `${id}: Trying to call setHasChanges but no saveHandler has been set`
          )
        }

        if (!resetHandler) {
          return console.error(
            `${id}: Trying to call setHasChanges but no resetHandler has been set`
          )
        }

        if (!hasChanges) {
          hasChanges = true
          dispatch(setCaller(id))
        }
      }

      props.setInitialValues = setInitialValues

      props.initialValues = initialValues

      useEffect(() => {
        // if there is a reset and it has changes set back initialValues
        if (saveAttempt === null && hasChanges) {
          hasChanges = false
          if (resetHandler) resetHandler(initialValues)
          setInitialValues(initialValues)
        }

        if (saveAttempt > 0 && hasChanges) {
          if (!saveHandler) {
            console.error(`No save handler set for ${id}, removing caller`)
            dispatch(removeCaller(id))
          } else {
            const promise = saveHandler()
            if (promise instanceof Promise) {
              promise
                .then((newInitialValues) => {
                  hasChanges = false
                  setInitialValues(newInitialValues)
                  dispatch(removeCaller(id))
                })
                .catch((err) => {
                  console.error(`Error in saveHandler for ${id}`, err)
                  notificationHandler.error(
                    'Could not save changes',
                    err.message
                  )
                  dispatch(setCallerError(id))
                })
            } else {
              console.error(`${id}: saveHandler does not return a promise`)
            }
          }
        }
      }, [saveAttempt, dispatch, initialValues])

      return <Component {...props} />
    }
  )
}
