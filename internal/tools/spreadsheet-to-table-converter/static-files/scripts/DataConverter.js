//
//  DataConverter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//  Modified by Kevin Schaul.
//


function DataConverter(nodeId) {

//---------------------------------------
// PUBLIC PROPERTIES
//---------------------------------------

    this.outputDataTypes = [
        {"text":"HTML", "id":"html", "notes":""},
    ];
    this.outputDataType         = "html";
    this.id                     = "table-1";

    this.columnDelimiter        = "\t";
    this.rowDelimiter           = "\n";

    this.inputTextArea          = $("#dataInput");
    this.outputTextArea         = $("#dataOutput");
    this.dataSelect             = $("#dataSelector");
    this.previewDiv             = "#preview";

    this.inputText              = "";
    this.outputText             = "";

    this.newLine                = "\n";
    this.indent                 = "  ";

    this.commentLine            = "//";
    this.commentLineEnd         = "";
    this.tableName              = "MrDataConverter"

    this.useUnderscores         = true;
    this.headersProvided        = true;
    this.downcaseHeaders        = false;
    this.upcaseHeaders          = false;
    this.includeWhiteSpace      = true;
    this.useTabsForIndent       = false;

    this.sortable               = true;
    this.sortColumn             = 0;
    this.sortOrder              = 0;
    this.sortOptions            = {sortOrder: [[0,0]]};

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function() {
    var self = this;

    this.outputTextArea.click(function(evt) {
        this.select();
    });

    $("#dataInput").keyup(function() {
        self.convert();
    });

    $("#dataInput").change(function() {
        self.convert();
    });

    $("#dataSelector").bind("change",function(evt){
        self.outputDataType = $(this).val();
        self.convert();
    });

    $("#select-sort").change(function() {
        self.sortColumn = $("#select-sort").val();
        self.sort();
    });
    $("#select-sort-order").change(function() {
        self.sortOrder = $("#select-sort-order").val();
        self.sort();
    });
    $("#checkbox-sortable").change(function() {
        self.sortable = $("#checkbox-sortable").val();
        self.sort();
    });
}


DataConverter.prototype.convert = function() {

    this.inputText = this.inputTextArea.val();
    this.outputText = "";

    if (this.inputText.length > 0) {

        if (this.includeWhiteSpace) {
            this.newLine = "\n";
        } else {
            this.indent = "";
            this.newLine = "";
        }

        CSVParser.resetLog();
        var parseOutput = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders);

        var dataGrid = parseOutput.dataGrid;
        var headerNames = parseOutput.headerNames;
        var headerTypes = parseOutput.headerTypes;
        var errors = parseOutput.errors;

        this.outputText = DataGridRenderer[this.outputDataType](dataGrid, headerNames, headerTypes, this.indent, this.newLine, this.id);


        var scripts = "";
/*

        not gonna run the sortable option for now...

        if (this.sortable) {
            scripts += "<script type=\"text/javascript\" src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js\></script>\n";
        }
        scripts += "<script type=\"text/javascript\">\n";

        if (this.sortable) {
            scripts += "$(\"#table-1\").tablesorter("
                    + JSON.stringify(this.sortOptions) + ");\n";
        }

        scripts += "</script>\n";
*/

        this.outputTextArea.val(errors + scripts + this.outputText);

        $(this.previewDiv).html(this.outputText);

    };


//TODO if we want to sort..
    var selectOptions = "";
    for (i in headerNames) {
        selectOptions += "<option value=\"" + i + "\">"
                + headerNames[i] + "</option>";
    }
    $("#select-sort").html(selectOptions);

    this.sort();
}

DataConverter.prototype.sort = function() {
    //TODO sorting breaks even/odd classes
    //TODO is this the correct way to do checkboxes?
    if (this.sortable === "on") {
        this.sortOptions = {
            sortList: [
                [this.sortColumn, this.sortOrder]
            ]
        };
        $("#table-1").tablesorter(this.sortOptions);
    }
    //TODO else refresh content from input (overrides preview sort
}

