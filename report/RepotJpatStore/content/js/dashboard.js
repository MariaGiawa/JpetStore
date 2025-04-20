/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.92343032159265, "KoPercent": 0.07656967840735068};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.782556270096463, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.48757309941520466, 500, 1500, "01_01_Open Url"], "isController": true}, {"data": [1.0, 500, 1500, "04_07_Click On Process To Checkout"], "isController": true}, {"data": [0.45161290322580644, 500, 1500, "03_01_Open URL"], "isController": true}, {"data": [0.46715328467153283, 500, 1500, "02_01_Open Url"], "isController": true}, {"data": [1.0, 500, 1500, "04_06_Click On Add To Cart"], "isController": true}, {"data": [1.0, 500, 1500, "03_07_Click On Sign Out-1"], "isController": false}, {"data": [1.0, 500, 1500, "03_07_Click On Sign Out-0"], "isController": false}, {"data": [1.0, 500, 1500, "04_08_Key In Payment Detail and Click On Continue"], "isController": true}, {"data": [0.985553772070626, 500, 1500, "01_02_Search"], "isController": true}, {"data": [1.0, 500, 1500, "03_02_Click On Sign In"], "isController": true}, {"data": [1.0, 500, 1500, "04_04_Click On Category "], "isController": true}, {"data": [0.9375, 500, 1500, "03_05_Click On Product Id"], "isController": true}, {"data": [1.0, 500, 1500, "04_03_Enter Username & Password, Click On Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_02_Click On Sign In"], "isController": true}, {"data": [0.9961538461538462, 500, 1500, "02_02_Click On Category"], "isController": true}, {"data": [0.0, 500, 1500, "04_09_Click On Confirm"], "isController": true}, {"data": [1.0, 500, 1500, "03_03_Enter Username & Password, Click on Login"], "isController": true}, {"data": [1.0, 500, 1500, "04_05_Click On Product Id"], "isController": true}, {"data": [1.0, 500, 1500, "04_10_Click On SignOut-1"], "isController": false}, {"data": [0.5, 500, 1500, "04_10_Click On SignOut-0"], "isController": false}, {"data": [0.9865470852017937, 500, 1500, "02_04_Click On Iteam Id"], "isController": true}, {"data": [1.0, 500, 1500, "03_04_Click On Category"], "isController": true}, {"data": [0.9794238683127572, 500, 1500, "02_03_Click On Product Id"], "isController": true}, {"data": [0.875, 500, 1500, "03_06_Add To Cart"], "isController": true}, {"data": [0.875, 500, 1500, "03_07_Click On Sign Out"], "isController": true}, {"data": [0.5, 500, 1500, "04_10_Click On SignOut"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "04_01_Open Url"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1306, 1, 0.07656967840735068, 437.41347626339973, 0, 8484, 190.0, 771.0, 899.5999999999995, 1732.5800000000004, 13.347778095744244, 52.96284575127244, 8.33687186362986], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["01_01_Open Url", 684, 0, 0.0, 800.0482456140343, 0, 6309, 724.0, 937.0, 1543.0, 2055.0, 7.142558790359634, 34.61022996637568, 3.8478177799068547], "isController": true}, {"data": ["04_07_Click On Process To Checkout", 2, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 0.34106412005457026, 1.4068894952251023, 0.21449735675306958], "isController": true}, {"data": ["03_01_Open URL", 31, 0, 0.0, 918.7096774193549, 0, 1735, 760.0, 1609.0, 1735.0, 1735.0, 0.32733224222585927, 1.6523967517554512, 0.17005932896890344], "isController": true}, {"data": ["02_01_Open Url", 274, 0, 0.0, 819.948905109489, 706, 1944, 723.0, 1069.0, 1643.0, 1790.25, 2.874015335074525, 14.382184218876196, 1.5896733429833119], "isController": true}, {"data": ["04_06_Click On Add To Cart", 2, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 0.3536067892503536, 1.617474805516266, 0.2296372215346535], "isController": true}, {"data": ["03_07_Click On Sign Out-1", 8, 0, 0.0, 220.375, 174, 352, 175.5, 352.0, 352.0, 352.0, 0.30202355783751134, 1.4888817577771067, 0.186405164602839], "isController": false}, {"data": ["03_07_Click On Sign Out-0", 8, 0, 0.0, 177.75, 174, 193, 175.5, 193.0, 193.0, 193.0, 0.30198935487524065, 0.06782964025518101, 0.18903825827639575], "isController": false}, {"data": ["04_08_Key In Payment Detail and Click On Continue", 2, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 0.30656039239730226, 1.3388067136725934, 0.3757161059166156], "isController": true}, {"data": ["01_02_Search", 623, 0, 0.0, 202.3210272873194, 0, 8484, 178.0, 200.0, 258.39999999999986, 804.0, 6.85217773867136, 22.401690703365595, 5.795917771117466], "isController": true}, {"data": ["03_02_Click On Sign In", 27, 0, 0.0, 174.66666666666666, 0, 312, 181.0, 243.19999999999993, 312.0, 312.0, 0.319009416685374, 1.1340249388565284, 0.16947375261410494], "isController": true}, {"data": ["04_04_Click On Category ", 2, 0, 0.0, 184.0, 184, 184, 184.0, 184.0, 184.0, 184.0, 0.31496062992125984, 1.2955216535433072, 0.19377460629921262], "isController": true}, {"data": ["03_05_Click On Product Id", 16, 0, 0.0, 253.25, 175, 766, 178.5, 766.0, 766.0, 766.0, 0.5131165415945097, 2.04701680857546, 0.3317218266948881], "isController": true}, {"data": ["04_03_Enter Username & Password, Click On Login", 2, 0, 0.0, 178.0, 178, 178, 178.0, 178.0, 178.0, 178.0, 0.1649212501030758, 0.6720863053516946, 0.1550968396965449], "isController": true}, {"data": ["04_02_Click On Sign In", 2, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 0.3242016534284325, 1.2964900105365538, 0.19376114443183662], "isController": true}, {"data": ["02_02_Click On Category", 260, 0, 0.0, 189.76153846153852, 0, 534, 179.0, 211.80000000000007, 352.0, 436.3999999999978, 2.759352613425312, 11.000762801804193, 1.6454132395860972], "isController": true}, {"data": ["04_09_Click On Confirm", 2, 2, 100.0, 356.0, 356, 356, 356.0, 356.0, 356.0, 356.0, 0.30907124092103233, 4.653876429454489, 0.18743480528511822], "isController": true}, {"data": ["03_03_Enter Username & Password, Click on Login", 20, 0, 0.0, 152.79999999999998, 0, 242, 180.0, 237.3000000000001, 242.0, 242.0, 0.2742393286621234, 0.8944915602846604, 0.20514387280779936], "isController": true}, {"data": ["04_05_Click On Product Id", 2, 0, 0.0, 186.0, 186, 186, 186.0, 186.0, 186.0, 186.0, 0.3928501276762915, 1.8288247642899234, 0.2539714692594775], "isController": true}, {"data": ["04_10_Click On SignOut-1", 1, 0, 0.0, 176.0, 176, 176, 176.0, 176.0, 176.0, 176.0, 5.681818181818182, 28.00958806818182, 3.456809303977273], "isController": false}, {"data": ["04_10_Click On SignOut-0", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.4245923913043478, 1.1667060491493384], "isController": false}, {"data": ["02_04_Click On Iteam Id", 223, 0, 0.0, 195.65919282511211, 0, 948, 179.0, 208.2, 247.0, 921.599999999999, 2.6568177756597366, 9.48003849705129, 1.6321455962947518], "isController": true}, {"data": ["03_04_Click On Category", 16, 0, 0.0, 187.5, 177, 218, 179.0, 218.0, 218.0, 218.0, 0.4983957885555867, 2.050042052144659, 0.30663022147462854], "isController": true}, {"data": ["02_03_Click On Product Id", 243, 0, 0.0, 224.3991769547326, 0, 5763, 180.0, 224.0, 363.0, 1024.0, 2.6963449546170746, 10.532055678691108, 1.6785839611859479], "isController": true}, {"data": ["03_06_Add To Cart", 16, 0, 0.0, 377.0, 177, 1002, 181.5, 1002.0, 1002.0, 1002.0, 0.46940092706683095, 2.137516135656868, 0.3043771636448982], "isController": true}, {"data": ["03_07_Click On Sign Out", 16, 0, 0.0, 398.37499999999994, 349, 530, 352.0, 530.0, 530.0, 530.0, 0.42122999157540014, 2.1711444292333613, 0.5236579875737152], "isController": true}, {"data": ["04_10_Click On SignOut", 2, 0, 0.0, 705.0, 705, 705, 705.0, 705.0, 705.0, 705.0, 0.24084778420038536, 1.2414009814547207, 0.29517965739402696], "isController": true}, {"data": ["04_01_Open Url", 3, 0, 0.0, 478.66666666666663, 0, 718, 718.0, 718.0, 718.0, 718.0, 0.043782837127845885, 0.16144921190893172, 0.0149648369089317], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500", 1, 100.0, 0.07656967840735068], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1306, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["04_09_Click On Confirm", 1, 1, "500", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
