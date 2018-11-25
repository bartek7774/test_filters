export default class DB {

  constructor() {
    this._db = [];
  }

  _clone(src) {
    return JSON.parse(JSON.stringify(src));
  }
  
  clearAll(){
    this._db = [];
  }
  
  // { toSave:{ hashform, name, description, json } }
  save(data) {
    return new Promise((resolve, reject) => {
      try{
        const { filter, hashform } = JSON.parse(data);
          var recordToSave =
          {
            user_id: 1,
            hashform,
            name: filter.name,
            description: filter.description,
            json: filter.values,
            json_o: JSON.stringify(filter.values)
          };

          var isAlready = this._db.filter(x => x.name == recordToSave.name && x.user_id == recordToSave.user_id && x.hashForm == recordToSave.hashForm)[0];

          if (!isAlready) {
            this._db.push(recordToSave);
            resolve(recordToSave.name);
          } else {
            var ref = this._db.find(x => x.name == recordToSave.name && x.user_id == recordToSave.user_id && x.hashForm == recordToSave.hashForm);
            ref = Object.assign(ref, recordToSave);
            resolve(recordToSave.name, true);
          }
      } catch(err){
        reject(err);
      }
  
    });
  }

  edit(data) {
    return this.save(data);
  }

  // {toDel:{hashform,name}}
  remove(formHash, filter) {
    return new Promise((resolve, reject) => {
      try{
        var idx = this._db.findIndex(x => x.name == filter.name && x.user_id == 1 && x.hashform == formHash);
        if (idx != -1)
          this._db.splice(idx, 1);
        resolve(filter.name);
      }
      catch(err){
        reject(err);
      }
    });
  }

  // {} { toSave:{ hashform } } returns list of filters
  list(formHash) {
    return new Promise((resolve, reject) => {
      try{
        let list = this._clone(this._db.filter(x => x.hashform == formHash && x.user_id == 1));
        resolve(list);
      } catch(err){
        reject(err);
      }
    });
  }
}