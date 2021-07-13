export default{
  toCSV(data, userData, dateCreated, type){
    var tempvar = []
    if(type === 'all_users'){
      tempvar.push(this.createObj(data, []))
      data.body.forEach(item => {
        var tempObj = {}
        data.headers.forEach(headerElem => {
          tempObj[headerElem.label] = item[headerElem.name]
        })
        tempvar.push(tempObj)
      })
    }
    return tempvar
  },
  createObj(data, array){
    var tempObj = {}
    for(let count = 0; count < data.headers.length; count++){
      var value = ''
      if(array[count] !== undefined){
        value = array[count]
      }
      tempObj[data.headers[count].label] = value
    }
    return tempObj
  }
}
