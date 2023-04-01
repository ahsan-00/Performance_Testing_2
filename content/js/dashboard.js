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

    var data = {"OkPercent": 96.96969696969697, "KoPercent": 3.0303030303030303};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7901515151515152, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.75, 500, 1500, "women-accommodation"], "isController": false}, {"data": [0.8, 500, 1500, "breast-cancer-solution"], "isController": false}, {"data": [0.925, 500, 1500, "Automotive"], "isController": false}, {"data": [0.925, 500, 1500, "Real-state"], "isController": false}, {"data": [0.85, 500, 1500, "products"], "isController": false}, {"data": [1.0, 500, 1500, "Government-defense"], "isController": false}, {"data": [0.9, 500, 1500, "Tourism"], "isController": false}, {"data": [0.85, 500, 1500, "Rmg-sector"], "isController": false}, {"data": [1.0, 500, 1500, "Retail"], "isController": false}, {"data": [0.85, 500, 1500, "ar-vr"], "isController": false}, {"data": [0.975, 500, 1500, "Education"], "isController": false}, {"data": [0.8, 500, 1500, "e-commerce-solution"], "isController": false}, {"data": [0.925, 500, 1500, "contact"], "isController": false}, {"data": [0.825, 500, 1500, "system-management-implementation"], "isController": false}, {"data": [1.0, 500, 1500, "Softwareites"], "isController": false}, {"data": [0.825, 500, 1500, "Agriculture"], "isController": false}, {"data": [0.8, 500, 1500, "Test-pupas"], "isController": false}, {"data": [0.0, 500, 1500, "Home"], "isController": false}, {"data": [0.8, 500, 1500, "education-training"], "isController": false}, {"data": [0.85, 500, 1500, "news"], "isController": false}, {"data": [0.775, 500, 1500, "virtual-tour-and-360-video"], "isController": false}, {"data": [0.75, 500, 1500, "quiz-puzzle-make"], "isController": false}, {"data": [0.0, 500, 1500, "game-development"], "isController": false}, {"data": [0.7, 500, 1500, "Media"], "isController": false}, {"data": [0.8, 500, 1500, "website-design-and-development"], "isController": false}, {"data": [0.675, 500, 1500, "About"], "isController": false}, {"data": [0.925, 500, 1500, "Partners"], "isController": false}, {"data": [0.525, 500, 1500, "Healthcare"], "isController": false}, {"data": [0.8, 500, 1500, "mobile-app-development"], "isController": false}, {"data": [0.8, 500, 1500, "consultancy-service"], "isController": false}, {"data": [0.975, 500, 1500, "Startup"], "isController": false}, {"data": [0.725, 500, 1500, "seo-service"], "isController": false}, {"data": [0.975, 500, 1500, "Career "], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 660, 20, 3.0303030303030303, 692.4378787878786, 314, 8124, 440.0, 906.4999999999999, 2320.6499999999983, 6233.17, 24.12457050954017, 1341.0632216239308, 3.3732420589955407], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["women-accommodation", 20, 0, 0.0, 560.25, 332, 1016, 517.0, 913.1, 1010.9999999999999, 1016.0, 4.4903457566232605, 155.5220728558599, 0.6621505949708127], "isController": false}, {"data": ["breast-cancer-solution", 20, 0, 0.0, 512.25, 329, 867, 444.0, 844.0000000000003, 866.65, 867.0, 3.622532149972831, 119.5329480619453, 0.5447948741170078], "isController": false}, {"data": ["Automotive", 20, 0, 0.0, 456.05000000000007, 327, 767, 420.0, 751.7, 766.25, 767.0, 11.019283746556475, 313.04881198347107, 1.5388257575757576], "isController": false}, {"data": ["Real-state", 20, 0, 0.0, 445.9, 325, 770, 440.5, 615.1000000000003, 762.8499999999999, 770.0, 10.840108401084011, 307.8633130081301, 1.5138042005420054], "isController": false}, {"data": ["products", 20, 0, 0.0, 530.1, 336, 1230, 427.0, 944.1000000000004, 1216.4999999999998, 1230.0, 8.880994671403197, 313.45401309946715, 1.1448157193605686], "isController": false}, {"data": ["Government-defense", 20, 0, 0.0, 429.99999999999994, 322, 497, 452.0, 487.9, 496.55, 497.0, 21.59827213822894, 621.4776255399568, 3.184901457883369], "isController": false}, {"data": ["Tourism", 20, 0, 0.0, 513.6, 325, 1816, 409.0, 1038.8000000000006, 1778.6999999999994, 1816.0, 9.713453132588635, 290.55935830500243, 1.3280111704711024], "isController": false}, {"data": ["Rmg-sector", 20, 0, 0.0, 492.3, 335, 902, 466.0, 841.2000000000003, 899.5999999999999, 902.0, 12.8783000643915, 365.7613288795879, 1.7984344816484226], "isController": false}, {"data": ["Retail", 20, 0, 0.0, 413.15000000000003, 332, 471, 427.0, 462.0, 470.6, 471.0, 11.299435028248588, 320.897334039548, 1.5338100282485876], "isController": false}, {"data": ["ar-vr", 20, 0, 0.0, 499.8999999999999, 330, 791, 439.5, 742.1, 788.5999999999999, 791.0, 7.877116975187082, 291.59179302875145, 1.0538720953131153], "isController": false}, {"data": ["Education", 20, 0, 0.0, 431.65, 326, 749, 439.0, 492.50000000000006, 736.2499999999998, 749.0, 10.81081081081081, 306.7039695945946, 1.4991554054054053], "isController": false}, {"data": ["e-commerce-solution", 20, 0, 0.0, 544.1, 328, 1237, 462.5, 858.8000000000003, 1218.7999999999997, 1237.0, 5.829204313611192, 187.51935477994755, 0.8595799329641504], "isController": false}, {"data": ["contact", 20, 0, 0.0, 376.75, 321, 608, 329.5, 605.0, 607.9, 608.0, 2.160293799956794, 82.66921176279975, 0.2763657107366602], "isController": false}, {"data": ["system-management-implementation", 20, 0, 0.0, 536.65, 342, 974, 455.5, 940.8000000000002, 972.75, 974.0, 5.077430820005078, 167.59488448844886, 0.8131822797664382], "isController": false}, {"data": ["Softwareites", 20, 0, 0.0, 399.4, 325, 475, 415.0, 469.6, 474.75, 475.0, 11.273957158962796, 319.9976218996618, 1.5964099492671928], "isController": false}, {"data": ["Agriculture", 20, 0, 0.0, 483.90000000000003, 325, 1084, 460.0, 786.7000000000006, 1070.4999999999998, 1084.0, 15.6128024980484, 444.5684523809524, 2.1955503512880563], "isController": false}, {"data": ["Test-pupas", 20, 0, 0.0, 572.6999999999999, 329, 1134, 455.5, 866.5000000000001, 1120.7999999999997, 1134.0, 9.229349330872173, 263.24375576834336, 1.2888642131979697], "isController": false}, {"data": ["Home", 20, 0, 0.0, 2616.55, 2133, 3114, 2631.0, 3048.7000000000003, 3111.5, 3114.0, 6.287331027978623, 397.86402664256525, 0.7613564916692864], "isController": false}, {"data": ["education-training", 20, 0, 0.0, 555.2, 334, 1297, 426.0, 1151.2000000000007, 1291.25, 1297.0, 5.313496280552604, 187.938986118491, 0.7783441817215728], "isController": false}, {"data": ["news", 20, 0, 0.0, 485.80000000000007, 321, 1344, 333.5, 868.8000000000001, 1320.2999999999997, 1344.0, 2.0491803278688527, 74.92515689036885, 0.25614754098360654], "isController": false}, {"data": ["virtual-tour-and-360-video", 20, 0, 0.0, 533.25, 327, 908, 441.0, 867.3000000000004, 906.85, 908.0, 3.9984006397441023, 137.171693822471, 0.6169407237105158], "isController": false}, {"data": ["quiz-puzzle-make", 20, 0, 0.0, 563.2999999999998, 336, 1109, 524.0, 875.4000000000001, 1097.3999999999999, 1109.0, 3.3145508783559827, 114.21605692741134, 0.47905618163738817], "isController": false}, {"data": ["game-development", 20, 20, 100.0, 4780.1, 1993, 8124, 5170.0, 7256.900000000001, 8081.799999999999, 8124.0, 1.7256255392579811, 1271.7219012888265, 0.24940681622088007], "isController": false}, {"data": ["Media", 20, 0, 0.0, 532.7499999999999, 324, 1609, 585.0, 619.3000000000001, 1559.5999999999995, 1609.0, 2.148920167615773, 120.16325077898355, 0.2707135758031589], "isController": false}, {"data": ["website-design-and-development", 20, 0, 0.0, 542.8, 336, 1020, 458.0, 767.0000000000001, 1007.4999999999998, 1020.0, 6.954102920723227, 267.18967315716276, 1.1001608136300418], "isController": false}, {"data": ["About", 20, 0, 0.0, 540.95, 323, 1167, 590.0, 628.9, 1140.1499999999996, 1167.0, 2.0504408447816282, 98.78158960426492, 0.2583074892351856], "isController": false}, {"data": ["Partners", 20, 0, 0.0, 386.3, 318, 863, 329.0, 635.1000000000001, 851.8499999999999, 863.0, 2.1128248468201987, 69.28786248151279, 0.27235632791041625], "isController": false}, {"data": ["Healthcare", 20, 0, 0.0, 599.25, 490, 953, 553.0, 883.7000000000003, 950.0999999999999, 953.0, 20.98635886673662, 655.2498688352571, 2.93071222455404], "isController": false}, {"data": ["mobile-app-development", 20, 0, 0.0, 540.4000000000001, 329, 809, 457.0, 789.2, 808.15, 809.0, 6.447453255963894, 236.49057059961316, 0.969636524822695], "isController": false}, {"data": ["consultancy-service", 20, 0, 0.0, 558.4, 332, 1178, 472.5, 983.7000000000005, 1169.6, 1178.0, 6.523157208088715, 236.1714163405088, 0.9619108773646445], "isController": false}, {"data": ["Startup", 20, 0, 0.0, 422.0, 331, 755, 415.0, 465.7, 740.5499999999997, 755.0, 11.0803324099723, 314.37197022160666, 1.5148891966759004], "isController": false}, {"data": ["seo-service", 20, 0, 0.0, 635.4500000000002, 326, 2206, 519.5, 1353.1000000000008, 2165.2999999999993, 2206.0, 3.2113037893384715, 108.70137885356455, 0.4484535565189467], "isController": false}, {"data": ["Career ", 20, 0, 0.0, 359.3, 314, 907, 326.0, 361.6, 879.7499999999997, 907.0, 2.1510002151000216, 48.2294579479458, 0.27937795762529577], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["500/Internal Server Error", 20, 100.0, 3.0303030303030303], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 660, 20, "500/Internal Server Error", 20, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["game-development", 20, 20, "500/Internal Server Error", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
