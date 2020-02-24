export default {
  'Example Module': [
    {
      path: '/sub-example',
      component: require('../../modules/example_module/client/components/Example')
    },
    {
      path: '/sub-example/:param',
      component: require('../../modules/example_module/client/components/Example')
    }
  ]
}
