"use strict";
const grid = $("#grid");
const size_button = $("#size_button");
const cols_input = $("#cols_input");
const rows_input = $("#rows_input");
const color_input = $("#color_input");
const clear_command = $("#clear_command");
const toggle_border_command = $("#toggle_border_command");
const tools = $(".dropdown-item.tool");
const tools_bar = $("#navBarTools");
const draw_methods = $(".dropdown-item.draw_method");
const draw_methods_bar = $("#navBarDrawMethods");

let gridblocks = $(".gridblock");
let settings = {
    hide_border: false,
    current_tool: "Brush",
    block_color: "#4682b4",
    draw_method: "Draw On Click",
    grid_cols: 10,
    grid_rows: 10
};
const grid_max_cols = 100;
const grid_min_cols = 1;
const grid_max_rows = 100;
const grid_min_rows = 1;
const default_block_color = "rgb(255, 255, 255)";
let mouse_down = false;

$('document').ready(init);

/*
    Init
*/
function init() {
    change_default_values();
    update_grid();
    add_all_listeners();
}

/*
    Change values
*/
function change_default_values() {
    color_input.attr("value", settings["block_color"]);
    rows_input.attr("value", settings["grid_rows"]);
    cols_input.attr("value", settings["grid_cols"]);
}

/*
    Add Listeners
*/
function add_all_listeners(){

    function add_mouse_listener() {
        $(document).on("mousedown", function() {
            mouse_down = true;
        });
        $(document).on("mouseup", function () {
            mouse_down = false;
        });
    }

    function add_tool_listeners() {
        tools.each(function () {
            $(this).on("click", function () {
                let id = $(this).attr("id");
                settings["current_tool"] = id;
                tools_bar.text(id);
            });
        });
    }
    function add_draw_method_listeners() {
        draw_methods.each(function () {
            $(this).on("click", function () {
                let temp = $(this).text();
                settings["draw_method"] = temp;
                draw_methods_bar.text(temp);
                update_block_listeners();
            });
        });

    }

    function add_size_listeners(){
         function on_size_change() {
            if (!cols_input.val() ||
                cols_input.val() < grid_min_cols ||
                cols_input.val() > grid_max_cols) {
                alert("Error! Please enter a column number from "
                    + grid_min_cols + " to "
                    + grid_max_cols + ".");
            return;
            }
            if (!rows_input.val() ||
                rows_input.val() < grid_min_rows ||
                rows_input.val() > grid_max_rows) {
                alert("Error! Please enter a row number from "
                    + grid_min_rows + " to "
                    + grid_max_rows + ".");
            return;
            }
         settings["grid_cols"] = cols_input.val();
        settings["grid_rows"] = rows_input.val();
        update_grid();
        }
        size_button.on("click", on_size_change);
    }

    function add_color_listener(){
        color_input.on("change", function () {
            settings["block_color"] = color_input.val();
        });
    }

    function add_other_listeners() {
        clear_command.on("click", function () {
            gridblocks.css("backgroundColor", default_block_color);
        });
        toggle_border_command.on("click", function () {
            settings["hide_border"] = !settings["hide_border"];
            update_borders();
        });
    }
    add_mouse_listener();
    add_tool_listeners();
    add_draw_method_listeners();
    add_size_listeners();
    add_color_listener();
    add_other_listeners();
}

/*
    Update Stuff
*/
function update_block_listeners() {
    if (settings["draw_method"] == "Draw On Click") {
        gridblocks.off("mouseover");
        gridblocks.on("tap click", update_color);
    }
    else {
        gridblocks.on("mouseover", function(){
          if (mouse_down) update_color.bind($(this))();
      });
        gridblocks.off("click tap");
    }
}

function update_borders() {
    if (settings["hide_border"])
        gridblocks.css("border", "none");
    else
        gridblocks.css("border", "1px solid black");
}

function update_color() {
    if (settings["current_tool"] == "Brush")
        $(this).css("backgroundColor", settings["block_color"]);
    else if (settings["current_tool"] == "Eraser")
        $(this).css("backgroundColor", default_block_color);
}

function update_grid() {
    function update_grid_HTML() {
        let new_grid = "";
        for (let i = 0; i < settings["grid_rows"]; i++) {
            new_grid += "<tr></tr>";
            for (let j = 0; j < settings["grid_cols"]; j++) {
                new_grid += "<td class='gridblock'> </td>";
            }
        }
        grid.html(new_grid);
    }
    function update_block_CSS_size() {
        let limiting_length = Math.min(window.innerWidth * .9 / settings["grid_cols"], window.innerHeight * .8 / settings["grid_rows"]);
        gridblocks.css("width", limiting_length + "px");
        gridblocks.css("height", limiting_length + "px");
    }
    update_grid_HTML();
    gridblocks = $(".gridblock");
    update_block_CSS_size();
    update_borders();
    update_block_listeners();
}