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
    placeholder: 'Enter Sheet Index',
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
  route: 'delivery_fees/import_from_google_sheet',
  button: {
    left: 'Cancel',
    right: 'Submit'
  },
  sort: null,
  params: []
}
