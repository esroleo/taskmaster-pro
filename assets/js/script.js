var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  //debugger;
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item list-group-flush");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });

    // P code to be edited //

   $(".list-group").on("click", "p", function() {
    console.log("<p> was clicked");
    console.log(this);
    var text = $(this)
    .text()
    .trim();
    var textInput = $("<textarea>")
    .addClass("form-control")
    .val(text);
    // replace (this) which is a p element with the form of bootstrap called form-control
    $(this).replaceWith(textInput); // You have to click to becomo editable
    textInput.trigger("focus"); // Once the p is replaced with form and clicked, it will be highlighted
    console.log(text);
  });


  $(".list-group").on("blur", "textarea", function() {
    // get the textarea's current value/text
    var text = $(this)
    .val()
    .trim();

    // get the parent ul's id attribute
    var status = $(this)
    .closest(".list-group")
    .attr("id")
    .replace("list-", "");

    // get the task's position in the list of other li elements
    var index = $(this)
    .closest(".list-group-item")
    .index();
    console.log("I am inside blur");

    tasks[status][index].text = text; // tasks.ToDo[0].text = "Text variable"
    saveTasks();

    
    // recreate p element
    var taskP = $("<p>")
    .addClass("m-1")
    .text(text);

    // replace textarea with p element
    $(this).replaceWith(taskP);
      });

    // Date code to be edited //

    // due date was clicked
  $(".list-group").on("click", "span", function() {
    // get current text
    var date = $(this)
      .text()
      .trim();

    // create new input element
    var dateInput = $("<input>")
      .attr("type", "text")
      .addClass("form-control")
      .val(date);

    // swap out elements
    $(this).replaceWith(dateInput);

    // automatically focus on new element
    dateInput.trigger("focus");


  });

  // Date code to be edited and change back to date //

  // value of due date was changed
  $(".list-group").on("blur", "input[type='text']", function() {
    // get current text
    var date = $(this)
      .val()
      .trim();

    // get the parent ul's id attribute
    var status = $(this)
      .closest(".list-group")
      .attr("id")
      .replace("list-", "");

    // get the task's position in the list of other li elements
    var index = $(this)
      .closest(".list-group-item")
      .index();

    // update task in array and re-save to localstorage
    tasks[status][index].date = date;
    saveTasks();

    // recreate span element with bootstrap classes
    var taskSpan = $("<span>")
      .addClass("badge badge-primary badge-pill")
      .text(date);

    // replace input with span element
    $(this).replaceWith(taskSpan);
  });




};



var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));


};




// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

  
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();

// jquery UI sortable
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  helper: "clone", // that tells jQuery to create a copy of the dragged element and move the copy
  // instead of the original. This is necessary to prevent click events from accidentally 
  //triggering on the original element.
  activate: function(event) {
    //console.log("activate", this);
  },
  deactivate: function(event) {
   // console.log("deactivate", this);
  },
  over: function(event) {
  //  console.log("over", event.target);
  },
  out: function(event) {
  //  console.log("out", event.target);
  },
  update: function(event) {

    // console.log($(this).children());
    //console.log("update", this);
    // loop over current set of children in sortable list
    // array to store the task data in
    var tempArr = [];

    // loop over current set of children in sortable list
    $(this).children().each(function() {
      var text = $(this)
        .find("p")
        .text()
        .trim();

      var date = $(this)
        .find("span")
        .text()
        .trim();

      // add task data to the temp array as an object
      tempArr.push({
        text: text,
        date: date
      });
    });

    // trim down list's ID to match object property
    var arrName = $(this)
    .attr("id")
    .replace("list-", "");

    // update array on tasks object and save
    tasks[arrName] = tempArr;
    saveTasks();

    console.log(tempArr);

  }
});