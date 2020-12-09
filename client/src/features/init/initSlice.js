import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import requester from 'Helpers/requester'
import importedModules from '../../../module_loader_imports/modules'

export const fetchInit = createAsyncThunk('init/fetchInit', async () => {
  const init = await requester.get('init')
  init.modules = init.modules
    .filter(
      (mod) =>
        importedModules[mod.name] && importedModules[mod.name].routes.length > 0
    )
    .map((mod) => {
      let routes = importedModules[mod.name].routes
      mod.routes = routes.map((route) => route.path)

      return mod
    })
  return init
})

const initSlice = createSlice({
  name: 'init',
  initialState: { status: 'idle' },
  reducers: {
    updateConfig(state, payload) {
      state.config = payload
    },
    updateModuleRoute: {
      reducer(state, { payload }) {
        state.modules = state.modules.map((mod) => {
          if (mod.id === payload.id) {
            mod.route = payload.route
          }
          return mod
        })
      },
      prepare(id, route) {
        return {
          payload: { id, route },
        }
      },
    },
    enableModule(state, action) {
      const modName = action.payload.name
      const modId = action.payload.id
      if (state.modules.some((mod) => mod.id === modId)) {
        return state
      }
      if (!importedModules[modName]) {
        return state
      }
      state.modules.push(action.payload)
    },
    disableModule(state, action) {
      const disableId = action.payload.id
      state.modules = state.modules.filter((mod) => mod.id !== disableId)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInit.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(fetchInit.rejected, (state, action) => {
      state.error = action.payload
      state.status = 'failed'
    })
    builder.addCase(fetchInit.fulfilled, (state, action) => {
      console.log(action)
      state = action.payload
      state.status = 'idle'
      return state
    })
  },
})

export const {
  disableModule,
  enableModule,
  updateModuleRoute,
  updateConfig,
} = initSlice.actions

export default initSlice.reducer
