import queryString from 'query-string'

export default (location, props) => {
  if (location) {
    return queryString.parse(location.search)
  } else if (props) {
    if (props.location) {
      return queryString.parse(props.location.search)
    }
  }
  return new Error('No location or properties given')
}
