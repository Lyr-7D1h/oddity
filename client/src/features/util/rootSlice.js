import importerRedux from '../../../module_loader_imports/redux'
import { createSlice } from '@reduxjs/toolkit'

const rootSlice = createSlice({
  name: 'root',
  reducers: {
    rootReset(state) {
      const importedKeys = importerRedux.reducers.map((reducer) => reducer[0])
      const updatedKeys = Object.keys(state).filter(
        (key) => -1 !== importedKeys.indexOf(key)
      )

      updatedKeys.forEach((key) => {
        state[key] = undefined
      })
    },
  },
})

export const { rootReset } = rootSlice.actions

export default rootSlice.reducer
