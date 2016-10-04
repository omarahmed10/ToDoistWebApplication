function task(id, name, date, Additional) {
    this.id = id;
    this.name = name;
    this.date = date;
    this.Additional = Additional;
}
var taskslist = [];
var inProgress = [];
var completedtask = [];
var archive = [];
var noAllTasks = 0, noCompleted = 0, noInProgress = 0, noArchived = 0;
var rowIndex;
var row_CompletedTask = [];
var index_authenticatedUser = 0;
var found = false;
function drawTable(list) {
    if (list == taskslist) {
        $('#1').addClass("active");
        $('#2').removeClass("active");
        $('#3').removeClass("active");
        $('#4').removeClass("active");
        $('.page-header').text("All Tasks");
    } else if (list == inProgress) {
        $('#2').addClass("active");
        $('#1').removeClass("active");
        $('#3').removeClass("active");
        $('#4').removeClass("active");
        $('.page-header').text("In Progress");
    } else if (list == completedtask) {
        $('#3').addClass("active");
        $('#1').removeClass("active");
        $('#2').removeClass("active");
        $('#4').removeClass("active");
        $('.page-header').text("Completed Tasks");
    } else if (list == archive) {
        $('#4').addClass("active");
        $('#1').removeClass("active");
        $('#3').removeClass("active");
        $('#2').removeClass("active");
        $('.page-header').text("Archive");
    }
    // console.log(list);
    var text = "<table id=\"AllTasks\" class=\"display\" cellspacing=\"0\" width=\"100%\">";
    text += "<thead><tr>" +
        "<th class=\"column1\">" + "<input type=\"checkbox\" name=\"vehicle\" value=\"Bike\" onclick =\"foo()\">" +
        "</th>" +
        "<th class=\"column2\">Task Name</th>" +
        "<th class=\"column3\">Task Date</th>";
    if (list == taskslist) {
        text += "<th class=\"column4\"></th>";
    }
    text += "</tr></thead><tbody>";
    // console.log(list[0]);
    // console.log(list.length);
    for (j = 0; j < list.length; j++) {
        // console.log(list[j].name+" "+list[j].date);
        text += "<tr onclick=\"getIndxex(this)\" id=\"row_" + j + "\">";
        text += "<td class=\"column1\"></td>";
        text += "<td class=\"column2\"><p>" + list[j].name + "</p></td>";
        text += "<td class=\"column3\"><p>" + list[j].date + "</p></td>";
        if (list == taskslist) {
            // console.log("Sone");
            text += "<td class=\"column4\">" +
                "<div class=\"dropdown\">" +
                "<button class=\"dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\">Task Action" +
                "<span class=\"caret\"></span>" + "</button>" +
                "<ul class=\"dropdown-menu\">" +
                "<li class=\"edit\"><a href=\"#\">Edit</a></li>" +
                "<li class=\"archived\"><a href=\"#\">Archived</a></li>" +
                "<li class=\"done\"><a href=\"#\">Mark as Done</a></li>" +
                "<li ><a class=\"delete\" href=\"#\" >Delete</a></li>" +
                "</ul></div>"
                + "</td>";
        }
        text += "</tr>";
    }
    text += "</tbody></table>";
    document.getElementById("myTable").innerHTML = text;
    $('#AllTasks').dataTable({
        paging: false,
    });
    $('.column1').css("width", "3%");
    $('.column2').css("width", "52%");
    if (list == taskslist) {
        for (var i = 0; i < taskslist.length; i++) {
            for (var j = 0; j < completedtask.length; j++) {
                if (taskslist[i] == completedtask[j]) {
                    $('#row_' + i).css("text-decoration", "line-through");
                    $('#row_' + i).css("color", "red");
                    break;
                }
            }
        }
    }
    $('#AllTasksSpan').text(noAllTasks);
    $('#CompletedSpan').text(noCompleted);
    $('#InProgressSpan').text(noInProgress);
    $('#ArchivedSpan').text(noArchived);
    // console.log(noAllTasks+" "+noCompleted+" "+noInProgress+" "+noArchived);
    $('.delete').click(confirmation);
    $('.archived').click(archiveTask);
    $('.done').click(function () {
        completed();
    });
    $('.edit').click(function () {
        editTask();
    });
    $('.btn-info').hide();
    for (var i = 0; i < taskslist.length; i++) {
        if (taskslist[i].Additional != "") {
            $("#row_" + i).attr("title", taskslist[i].Additional);
        }
    }
}
function completed() {
    var flage = 1;
    var p;
    for (p = 0; p < completedtask.length + 1; p++) {
        if (completedtask[p] == taskslist[rowIndex - 1]) {
            flage = 0;
            alert("anta a5trt al task de abl kda ya m3lm hoa l3b 3eal wla ah");
            break;
        }
    }
    if (flage == 1) {
        row_CompletedTask.push('#row_' + (rowIndex - 1));
        ++noCompleted;
        completedtask.push(taskslist[rowIndex - 1]);
        for (var i = 0; i < inProgress.length + 1; i++) {
            if (taskslist[rowIndex - 1] == inProgress[i] && i < inProgress.length) {
                --noInProgress;
                inProgress.splice(i, 1);
                break;
            }
            else if (taskslist[rowIndex - 1] == inProgress[i] && i == inProgress.length) {
                --noInProgress;
                inProgress.splice(i - 1, 1);
                break;
            }
        }
        $('#CompletedSpan').text(noCompleted);
        $('#InProgressSpan').text(noInProgress);
        drawTable(taskslist);
        $.ajax({
            url: 'http://127.0.0.1:8080/save',
            type: 'POST',
            data: {
                curr: index_authenticatedUser,
                allt: JSON.stringify(taskslist, null, 4),
                art: JSON.stringify(archive, null, 4),
                comt: JSON.stringify(completedtask, null, 4),
                prot: JSON.stringify(inProgress, null, 4)
            }
        });
    }
}
function archiveTask() {
    ++noArchived;
    archive.push(taskslist[rowIndex - 1]);
    taskslist.splice(rowIndex - 1, 1);
    --noAllTasks;
    for (var i = 0; i < inProgress.length; i++) {
        if (archive[noArchived - 1] == inProgress[i]) {
            --noInProgress;
            inProgress.splice(i, 1);
        }
    }
    drawTable(taskslist);
    $.ajax({
        url: 'http://127.0.0.1:8080/save',
        type: 'POST',
        data: {
            curr: index_authenticatedUser,
            allt: JSON.stringify(taskslist, null, 4),
            art: JSON.stringify(archive, null, 4),
            comt: JSON.stringify(completedtask, null, 4),
            prot: JSON.stringify(inProgress, null, 4)
        }
    });

}
function getIndxex(x) {
    rowIndex = x.rowIndex;
}
function confirmation() {
    var r = confirm("are you sure you want to delete this task!");
    if (r == true) {
        for (var i = 0; i < inProgress.length; i++) {
            if (taskslist[rowIndex - 1] == inProgress[i]) {
                --noInProgress;
                inProgress.splice(i, 1);
            }
        }
        taskslist.splice(rowIndex - 1, 1);
        --noAllTasks;
        drawTable(taskslist);
        $.ajax({
            url: 'http://127.0.0.1:8080/save',
            type: 'POST',
            data: {
                curr: index_authenticatedUser,
                allt: JSON.stringify(taskslist, null, 4),
                art: JSON.stringify(archive, null, 4),
                comt: JSON.stringify(completedtask, null, 4),
                prot: JSON.stringify(inProgress, null, 4)
            }
        });
    }
}
function addTask() {
    var n;
    var myDate;
    var describe;
    n = document.getElementById("taskName").value;
    myDate = document.getElementById("datepicker").value;
    describe = document.getElementById("addDescribe").value;
    if (n.toString().trim().length == 0) {
        alert("Please sir insert Task");
    }
    else {
        $('#taskName').val('');
        $('#datepicker').val('');
        $('#addDescribe').val('');
        $('#addTaskTable').hide();
        var newTask = new task(noAllTasks, n, myDate, describe);
        noAllTasks++;
        noInProgress++;
        taskslist.push(newTask);
        inProgress.push(newTask);
        drawTable(taskslist);
        $.ajax({
            url: 'http://127.0.0.1:8080/save',
            type: 'POST',
            data: {
                curr: index_authenticatedUser,
                allt: JSON.stringify(taskslist, null, 4),
                art: JSON.stringify(archive, null, 4),
                comt: JSON.stringify(completedtask, null, 4),
                prot: JSON.stringify(inProgress, null, 4)
            }
        });
    }
}

var f = 0;
function foo() {
    $('#AllTasks').find('tr').each(function () {
        row = $(this);
        if (row.find('input[type="checkbox"]').is(':checked')) {
            f = 1;
            $('.btn-info').show();
        }
    });
    if (!f) {
        $('.btn-info').hide();
    }
}
function editTask() {
    var txt = "<table id=\"editTaskTable\">" +
        "<tr><td/><td><input type=\"text\" placeholder=\"Desgin meeting at 11pm....\" id=\"editTaskName\"style=\"width: 100%;\"></td><td><input type=\"text\" placeholder=\"Schedule...\" id=\"editDatepicker\"></td></tr><tr><td>" +
        "<button type=\"button\" id=\"editButton\">edit this Task</button><button type=\"button\" id=\"cancelEdit\">cancel</button>" +
        "</td></tr><tr><td><br></td></tr></table>";
    document.getElementById("row_" + (rowIndex - 1)).innerHTML = txt;
    $('#editDatepicker').datepicker({minDate: 0});
    $('#editButton').click(function () {
        var n;
        var myDate;
        n = document.getElementById("editTaskName").value;
        myDate = document.getElementById("editDatepicker").value;
        $('#editTaskName').val('');
        $('#editDatepicker').val('');
        $('#editTaskTable').hide();
        taskslist[rowIndex - 1].name = n;
        taskslist[rowIndex - 1].date = myDate;
        drawTable(taskslist);
        $.ajax({
            url: 'http://127.0.0.1:8080/save',
            type: 'POST',
            data: {
                curr: index_authenticatedUser,
                allt: JSON.stringify(taskslist, null, 4),
                art: JSON.stringify(archive, null, 4),
                comt: JSON.stringify(completedtask, null, 4),
                prot: JSON.stringify(inProgress, null, 4)
            }
        });
    });

    $('#editDatepicker').keypress(function (e) {
        var key = e.which;
        if (key == 13) { // the enter key code
            var n;
            var myDate;
            n = document.getElementById("editTaskName").value;
            myDate = document.getElementById("editDatepicker").value;
            $('#editTaskName').val('');
            $('#editDatepicker').val('');
            $('#editTaskTable').hide();
            taskslist[rowIndex - 1].name = n;
            taskslist[rowIndex - 1].date = myDate;
            drawTable(taskslist);
            $.ajax({
                url: 'http://127.0.0.1:8080/save',
                type: 'POST',
                data: {
                    curr: index_authenticatedUser,
                    allt: JSON.stringify(taskslist, null, 4),
                    art: JSON.stringify(archive, null, 4),
                    comt: JSON.stringify(completedtask, null, 4),
                    prot: JSON.stringify(inProgress, null, 4)
                }
            });
        }
    });
    $('#editTaskName').keypress(function (e) {
        var key = e.which;
        if (key == 13) { // the enter key code
            var n;
            var myDate;
            n = document.getElementById("editTaskName").value;
            myDate = document.getElementById("editDatepicker").value;
            $('#editTaskName').val('');
            $('#editDatepicker').val('');
            $('#editTaskTable').hide();
            taskslist[rowIndex - 1].name = n;
            taskslist[rowIndex - 1].date = myDate;
            drawTable(taskslist);
            $.ajax({
                url: 'http://127.0.0.1:8080/save',
                type: 'POST',
                data: {
                    curr: index_authenticatedUser,
                    allt: JSON.stringify(taskslist, null, 4),
                    art: JSON.stringify(archive, null, 4),
                    comt: JSON.stringify(completedtask, null, 4),
                    prot: JSON.stringify(inProgress, null, 4)
                }
            });
        }
    });
    $('#cancelEdit').click(function () {
        $('#editTaskTable').hide();
        drawTable(taskslist);
    });
}
$(document).ready(function () {
    $(function () {
        $("#datepicker").datepicker({
            minDate: 0
        });
    });
    $.getJSON('users.json', function (data) {
        var i = 0;
        data.forEach(function (item) {
            if (item.authenticated == true) {
                index_authenticatedUser = i;
                found = true;
            }
            i++;
        });
        if (found) {
            $.getJSON('users.json', function (data) {
                var currentUser = data[index_authenticatedUser].username;
                $('#name_authenticatedUser').text(currentUser);
                // console.log("1");
            }).done(function () {
                $.getJSON('UsersCompletedTasks.json', function (data) {
                    var list = data[index_authenticatedUser]
                    for (var i = 0; i < list.length; i++) {
                        completedtask[i] = list[i];
                    }
                    noCompleted = completedtask.length;
                    // console.log("2");
                }).done(function () {
                    $.getJSON('UsersProgressTasks.json', function (data) {
                        var list = data[index_authenticatedUser]
                        for (var i = 0; i < list.length; i++) {
                            inProgress[i] = list[i];
                        }
                        noInProgress = inProgress.length;
                        // console.log("3");
                    }).done(function () {
                        $.getJSON('UsersArchivedTasks.json', function (data) {
                            var list = data[index_authenticatedUser];
                            for (var i = 0; i < list.length; i++) {
                                archive[i] = list[i];
                            }
                            noArchived = archive.length;
                            // console.log("4");
                        }).done(function () {
                            $.getJSON('UsersAllTasks.json', function (data) {
                                var list = data[index_authenticatedUser];
                                for (var i = 0; i < list.length; i++) {
                                    taskslist[i] = list[i];
                                }
                                noAllTasks = taskslist.length;
                                // console.log("5");
                            }).done(function () {
                                // console.log(noAllTasks+" "+noCompleted+" "+noInProgress+" "+noArchived);
                                // console.log("6");
                                drawTable(taskslist);
                            });
                        });
                    });
                });
            });
        }
    });
});
