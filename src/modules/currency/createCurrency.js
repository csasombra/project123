import CURRENCY from 'src/currency.js'
var currencies = []
var options = []
CURRENCY.currency.map(item => {
  var object = {
    label: item.long_name,
    value: item.long_name
  }
  options.push(object)
})
export default {
  id: 'createCurrency',
  size: 'modal-md',
  title: 'Add Currency',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Currency',
    variable: 'currency',
    value: null,
    required: true,
    id: 'type',
    type: 'select_specified',
    options: currencies
  }],
  route: 'payloads/create',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: {
    column: 'created_at',
    value: 'desc'
  },
  params: []
}
