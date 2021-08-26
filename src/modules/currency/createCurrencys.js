import CURRENCY from 'src/currency.js'
let currency = CURRENCY.currency.map(item => {
  return {
    label: item.long_name,
    value: item.long_name
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
    id: 'type',
    type: 'select_currency',
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
