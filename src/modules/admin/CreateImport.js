export default {
  id: 'importDataFromGoogleSheet',
  size: 'modal-md',
  title: 'Import Data From Google Sheet',
  background: null,
  inputs: [{
    row: 'full',
    label: 'Sheet ID',
    variable: 'sheet_id',
    placeholder: 'Enter Sheet ID',
    value: null,
    required: true,
    id: 'sheet_id',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }, {
    row: 'full',
    label: 'Sheet Index',
    variable: 'sheet_index',
    placeholder: 'Enter Sheet Name Index (e.g.Sheet1!A2:H)',
    value: null,
    required: true,
    id: 'sheet_index',
    type: 'input',
    inputType: 'text',
    validation: {
      size: 1,
      type: 'text'
    }
  }],
  route: 'spread_sheets/retrieve_delivery_fee',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: []
}
