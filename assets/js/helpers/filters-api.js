export default class json_API {
  constructor(){
  }
  remove(formHash, filter) {
    var toDel = JSON.stringify({
      hashform: formHash,
      name: filter.name
    });
    return $.ajax({
      type: "POST",
      url: "?m=filters/filters_del",
      data: JSON.stringify({ toDel }),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
    }).then(res=>res.data);
  }

  list(formHash) {
    return $.getJSON("?m=filters/filters_list&hash=" + formHash).then(res=>res.data);
  }

  save(data) {
    return $.ajax({
        type: "POST",
        url: "?m=filters/filters_add",
        data: JSON.stringify({ toSave: data }),
        contentType: "application/json; charset=utf-8",
        dataType: "json"
      })
      .then(res=>res.data);
  }

  edit(data) {
    return $.ajax({
        type: "POST",
        url: "?m=filters/filters_edit",
        data: JSON.stringify({ toSave: data }),
        contentType: "application/json; charset=utf-8",
        dataType: "json" });
  }
}