export default (actionToDispatch, originalAction) => {
  if (process.env.NODE_ENV === 'production') {
    return actionToDispatch
  }
  return {
    ...actionToDispatch,
    meta: {
      ...actionToDispatch.meta,
      origin: originalAction
    }
  }
}
