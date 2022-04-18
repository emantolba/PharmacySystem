//web SQL

var name1 = document.getElementById("name");
var id1 = document.getElementById("id");
var sec2 = document.getElementById("sec2");
var sec3 = document.getElementById("sec3");
var items1 = document.getElementById("items");
var tableData = document.getElementById("tabledata");
var itemId = document.getElementById("item_id");
var itemName = document.getElementById("itme_name");
var itemPrice = document.getElementById("item_price");
var itemQuantity = document.getElementById("item_quantity");
var addBtn = document.getElementById("add");
var saveBtn = document.getElementById("update");
var video = document.querySelector("#videoElement");
var canvas = document.getElementById("canvas");
var photo = document.getElementById("photo");
var takePhoto = document.getElementById("takePhoto");
var sec4 = document.getElementById("sec4");
var url;
var flag = 0;
var data;
var date1;
date1 = new Date();
date1 =
  date1.getUTCFullYear() +
  "-" +
  ("00" + (date1.getUTCMonth() + 1)).slice(-2) +
  "-" +
  ("00" + date1.getUTCDate()).slice(-2) +
  " " +
  ("00" + date1.getUTCHours()).slice(-2) +
  ":" +
  ("00" + date1.getUTCMinutes()).slice(-2) +
  ":" +
  ("00" + date1.getUTCSeconds()).slice(-2);
console.log(date1);
var db = openDatabase(
  "pharmacy",
  "1.0",
  "pharmacy manager DB",
  5 * 1024 * 1024
);

function opencam() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (err0r) {
        console.log("Something went wrong!");
      });
  }
}

// var dateNow = new Date();
// console.log(dateNow);
db.transaction(function (tx) {
  tx.executeSql(
    "create table if not exists users (id int primary key,name varchar(200) )",
    null,
    function (tx, result) {
      tx.executeSql("insert into users (id,name) values (?,?)", [1, "admin"]);
    },
    function (tx, error) {
      console.log(error);
    }
  );
  tx.executeSql(
    "create table if not  exists  Invoice (date DATETIME primary key ,cutomerName varchar(200) ,type varchar(20), items varchar(200) , quantity varchar(100))",
    null,
    function (tx, result) {},
    function (tx, error) {
      console.log(error);
    }
  );
  tx.executeSql(
    "create table if not exists items (id int primary key,name varchar(200) , price int, quantity int,url varchar(2000))",
    null,
    function (tx, result) {},
    function (tx, error) {
      console.log(error);
    }
  );
});

db.transaction(function (tx) {
  tx.executeSql(
    "select * from users",
    [],
    function (tx, results) {
      var len = results.rows.length;
      console.log(len);
    },
    null
  );
});
function showItems() {
  db.transaction(function (tx) {
    tx.executeSql(
      "select * from items ",
      null,
      function (tx, result) {
        console.log(result);
        let htmlCode = "";
        for (let i = 0; i < result.rows.length; i++) {
          let currentRecord = result.rows[i];
          htmlCode +=
            `
                  <tr>
                      <td>
                          ${currentRecord.id}
                      </td>
                      <td>
                          ${currentRecord.name}
                      </td>
                      <td>
                          ${currentRecord.price}
                      </td>
                      <td>
                          ${currentRecord.quantity}
                      </td>
                       
                      <td>
                          
                          <img src=` +
            currentRecord.url +
            `>
                      </td>
                      <td>
                          <button onclick="deleteItem(${
                            currentRecord.id
                          })" >Delete</button>
                          <button onclick='editItem(${JSON.stringify(
                            currentRecord
                          )})' >Edit</button>
                      </td>
                  </tr>
                  `;
        }
        tableData.innerHTML = htmlCode;
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
}
var arrayItems = [];
function login() {
  db.transaction(function (tx) {
    tx.executeSql(
      "select * from users",
      [],
      function (tx, results) {
        var len = results.rows.length;
        console.log(len);

        for (var i = 0; i < len; i++) {
          if (
            name1.value == results.rows.item(i).name &&
            name1.value == "admin"
          ) {
            console.log("hello admin");
            sec3.style.display = "block";
          }
          if (
            name1.value == results.rows.item(i).name &&
            parseInt(id1.value) == results.rows.item(i).id
          ) {
            sec2.style.display = "block";
            sec4.style.display = "block";
            flag = 1;
            showItems();
            showInvoice();
          }
        }
        if (!flag) {
          sec3.style.display = "block";
          sec3.innerHTML = "<div> wrong name or ID </div>";
          flag = 0;
        }
      },
      null
    );
  });
}

function addItem() {
  db.transaction(function (tx) {
    tx.executeSql(
      "insert into items (id,name,price,quantity,url) values (?,?,?,?,?)",
      [
        itemId.value * 1,
        itemName.value,
        itemPrice.value * 1,
        itemQuantity.value * 1,
        photo.src,
      ],

      function (tx, result) {
        alert("Item added successfully");
        clearItemForm();
        showItems();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
}
function editItem(item) {
  itemId.value = item.id;
  itemName.value = item.name;
  itemPrice.value = item.price;
  itemQuantity.value = item.quantity;
  photo.src = item.url;
  addBtn.style.display = "none";
  saveBtn.style.display = "block";
}
function clearItemForm() {
  itemId.value = "";
  itemName.value = "";
  itemPrice.value = "";
  itemQuantity.value = "";
}

function update() {
  db.transaction(function (tx) {
    tx.executeSql(
      "update items set  name = ? , price = ? , quantity = ? ,url = ? where id = ? ",
      [
        itemName.value,
        itemPrice.value * 1,
        itemQuantity.value * 1,
        photo.src,
        itemId.value * 1,
      ],
      function (tx, result) {
        alert("Item updated successfully");
        clearItemForm();
        showItems();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
  addBtn.style.display = "block";
  saveBtn.style.display = "none";
}
function deleteItem(id) {
  db.transaction(function (tx) {
    tx.executeSql(
      "delete from items where id = ? ",
      [id],
      function (tx, result) {
        alert("Item deleted");
        showItems();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
}

function stop(e) {
  var stream = video.srcObject;
  var tracks = stream.getTracks();

  for (var i = 0; i < tracks.length; i++) {
    var track = tracks[i];
    track.stop();
  }

  video.srcObject = null;
}
takePhoto.addEventListener(
  "click",
  function (ev) {
    takepicture();
    ev.preventDefault();
  },
  false
);
function takepicture() {
  var context = canvas.getContext("2d");
  var flag2 = 1;
  if (flag2) {
    canvas.width = 300;
    canvas.height = 300;
    context.drawImage(video, 0, 0, 300, 300);

    data = canvas.toDataURL("image/png");
    console.log(data);
    photo.setAttribute("src", data);
  } else {
    clearphoto();
  }
}

function clearphoto() {
  var context = canvas.getContext("2d");
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  data = canvas.toDataURL("image/png");
  photo.setAttribute("src", data);
}

function addUser() {
  var addUser = document.getElementById("addUser");
  addUser.style.display = "block";
}
var addUserBtn = document.getElementById("addUserBtn");
var userName;
var userId;
addUserBtn.addEventListener("click", function () {
  userName = document.getElementById("userName");
  userId = document.getElementById("userId");
  db.transaction(function (tx) {
    tx.executeSql(
      "insert into users (id,name) values (?,?)",
      [parseInt(userId.value), userName.value],
      function (tx, result) {
        alert("user added successfully");
        clearItemForm();
        showItems();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
});
var removeIdBtn = document.getElementById("removeIdBtn");
var removeId = document.getElementById("removeId");
var remove = document.getElementById("remove");
function removeUser() {
  remove.style.display = "block";
}

removeIdBtn.addEventListener("click", function () {
  db.transaction(function (tx) {
    tx.executeSql(
      "delete from users where id = ? ",
      [removeId.value],
      function (tx, result) {
        alert("Item deleted");
        showItems();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
});

var invoice = document.getElementById("invoice");
var invoiceName = document.getElementById("invoiceName");
var invoiceType = document.getElementById("invoiceType");
var invoiceItems = document.getElementById("invoiceItems");
var invoiceQuantity = document.getElementById("invoiceQuantity");

var add_invoice = document.getElementById("add_invoice");
var addInvoice1;
add_invoice.addEventListener("click", function () {
  addInvoice1 = document.getElementById("addInvoice");
  addInvoice1.style.display = "block";
  arrayItems = [];
  db.transaction(function (tx) {
    tx.executeSql("select name from items;", null, function (tx, results) {
      for (i = 0; i < results.rows.length; i++) {
        console.log(results.rows[i]);
        let currentRecord = results.rows[i].name;
        invoiceType.innerHTML +=
          `<option value= "` +
          currentRecord +
          `">` +
          currentRecord +
          `</option>`;
      }
    });
  });
});
var addAnotherItem = document.getElementById("addAnotherItem");
addAnotherItem.addEventListener("click", function () {
  arrayItems.push(invoiceType.value + ":" + invoiceQuantity.value);
  console.log(arrayItems);
});
var selectedType = document.getElementsByName("type");
var selectedTypeValue;
function addInvoice() {
  date1 = new Date();
  date1 =
    date1.getUTCFullYear() +
    "-" +
    ("00" + (date1.getUTCMonth() + 1)).slice(-2) +
    "-" +
    ("00" + date1.getUTCDate()).slice(-2) +
    " " +
    ("00" + date1.getUTCHours()).slice(-2) +
    ":" +
    ("00" + date1.getUTCMinutes()).slice(-2) +
    ":" +
    ("00" + date1.getUTCSeconds()).slice(-2);
  for (var i = 0; i < selectedType.length; i++) {
    if (selectedType[i].checked) {
      selectedTypeValue = selectedType[i].id;
    }
  }
  db.transaction(function (tx) {
    var items = "";
    var quantity = "";
    for (var i = 0; i < arrayItems.length; i++) {
      var item_name1 = arrayItems.toString().split(",")[i].split(":")[0];
      var item_quantity1 = Number(
        arrayItems.toString().split(",")[i].split(":")[1]
      );

      items += item_name1 + ",";

      quantity += item_quantity1 + ",";
    }
    tx.executeSql(
      "insert into Invoice (date ,cutomerName,type, items , quantity ) values (?,?,?,?,?)",
      [date1, invoiceName.value, selectedTypeValue, items, quantity],

      function (tx, result) {
        alert("Item added successfully");
        //clearItemForm();
        changeinItems();
        showInvoice();
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
    items = "";
    quantity = "";
  });
  addInvoice1.style.display = "none";
}
function showInvoice() {
  db.transaction(function (tx) {
    tx.executeSql(
      "select * from Invoice ",
      null,
      function (tx, result) {
        console.log(result);
        let htmlCode = "";
        for (let i = 0; i < result.rows.length; i++) {
          let currentRecord = result.rows[i];

          htmlCode += `
                  <tr>
                      <td>
                          ${currentRecord.date}
                      </td>
                      <td>
                          ${currentRecord.cutomerName}
                      </td>
                      <td>
                          ${currentRecord.type}
                      </td>
                      <td>
                          ${currentRecord.items}
                      </td>
                      <td>
                      ${currentRecord.quantity}
                      </td>
                  </tr>
                  `;
        }
        invoice.innerHTML = htmlCode;
      },
      function (tx, err) {
        console.log(err);
        alert(err.message);
      }
    );
  });
}
var firstQuantity;
function changeinItems() {
  console.log(arrayItems);
  for (var i = 0; i < selectedType.length; i++) {
    if (selectedType[i].checked) {
      selectedTypeValue = selectedType[i].id;
    }
  }

  if (selectedTypeValue == "buy") {
    db.transaction(function (tx) {
      for (var i = 0; i < arrayItems.length; i++) {
        var item_name = arrayItems.toString().split(",")[i].split(":")[0];
        var item_quantity = Number(
          arrayItems.toString().split(",")[i].split(":")[1]
        );
        tx.executeSql(
          "update items set quantity = (select quantity from items  where name=?) + ? where name = ? ",
          [item_name, item_quantity, item_name],
          function (tx, result) {
            alert("Item updated successfully changed");
            showItems();
          },
          function (tx, err) {
            console.log(err);
            alert(err.message);
          }
        );
      }
    });
  } else {
    db.transaction(function (tx) {
      for (var i = 0; i < arrayItems.length; i++) {
        var item_name = arrayItems.toString().split(",")[i].split(":")[0];
        var item_quantity = Number(
          arrayItems.toString().split(",")[i].split(":")[1]
        );
        tx.executeSql(
          "update items set quantity = (select quantity from items  where name=?) - ? where name = ? ",
          [item_name, item_quantity, item_name],
          function (tx, result) {
            alert("Item updated successfully changed");

            showItems();
          },
          function (tx, err) {
            console.log(err);
            alert(err.message);
          }
        );
      }
    });
  }
}
