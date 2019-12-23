
var sideex_wait = {
    next_command_wait: false,
    done: true
};

var sideex_testCase = {
    count: 0
};

var sideex_testSuite = {
    count: 0
};

function clean_panel() {
    emptyNode(document.getElementById("records-grid"));
    emptyNode(document.getElementById("command-target-list"));
    emptyNode(document.getElementById("target-dropdown"));
    document.getElementById("command-command").value = "";
    document.getElementById("command-target").value = "";
    document.getElementById("command-value").value = "";
}
