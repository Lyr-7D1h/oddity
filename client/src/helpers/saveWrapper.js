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
      const [initialValues, setInitialValues] = useState(
        props.initialValues || null
      )

      console.log(id)
      if (!id && props.name) {
        id = props.name
      } else if (!id) {
        console.error('No id set')
      }

      /**
       * callback: callback for a promise
       * resolve and reject as parameters
       */
      props.setSaveHandler = (callback) => {
        // prevent multiple call
        if (!saveHandler) {
          saveHandler = callback
        } else {
          saveHandler = callback
          console.warn(`${id}: Save Handler already set`)
        }
      }

      props.setResetHandler = (callback) => {
        if (!resetHandler) {
          resetHandler = callback
        } else {
          resetHandler = callback
          console.warn(`${id}: Reset Handler already set`)
        }
      }

      // only if saveHandler is defined
      // when this is called the component is registered
      props.setHasChanges = () => {
        if (!saveHandler) {
          console.error(
            `${id}: Trying to call setHasChanges but no saveHandler has been set`
          )
          return
        }

        if (!resetHandler) {
          console.error(
            `${id}: Trying to call setHasChanges but no resetHandler has been set`
          )
          return
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
            new Promise(saveHandler)
              .then((newInitialValues) => {
                hasChanges = false
                setInitialValues(newInitialValues)
                dispatch(removeCaller(id))
              })
              .catch((err) => {
                console.log(err.message)
                console.error(`Error in saveHandler for ${id}`, err)
                notificationHandler.error('Could not save changes', err.message)
                dispatch(setCallerError(id))
              })
          }
        }
      }, [saveAttempt, dispatch, initialValues])

      return <Component {...props} />
    }
  )
}
