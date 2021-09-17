import CURRENCY from 'src/currency.js'
let currency = CURRENCY.currency.map(item => {
  return {
    label: item.long_name,
    value: item.initial
  }
})
export default {
  id: 'modalCurrencyk',
  size: 'modal-md',
  title: 'Add Currency',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Currency',
    variable: 'currency',
    value: null,
    required: true,
    id: 'currency',
    type: 'select_specified',
    options: currency
  }],
  route: 'payloads/create_currency',
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
