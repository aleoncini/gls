var STORE_ORIGIN = window.location.origin;

function displayHole(info) {
    var td_id = '#' + info.roundId + '_' + info.hole;
    var b_g_color = '#d7edef';
    var net_result = calculateMedal(info.hole, info.strokes, info.phcp);
    if(net_result > 0){
        b_g_color = '#dfdfdf';
    }
    if(net_result < 0){
        b_g_color = '#fbfabc';
    }
    $(td_id).css("background-color", b_g_color);
    $(td_id).html(info.strokes);

    // !!!!!!!!!!!!!!!!!
    // bisogna ricalcolare tutti i totali e rifare il sort della tabella
    if(info.day == 1){
        setTotalsFirstDay(info.roundId, info.phcp, info.playerId);
    }
    if(info.day == 2){
        setTotalsSecondDay(info.roundId, info.phcp, info.playerId);
    }
};

function displayTournaments(tournaments) {
    $("#tbody_leaderboards").empty();
    $.each(tournaments, function (index, tournament) {
        addTournamentToTable(tournament);
    });
};

function addTournamentToTable(tournament) {
    var rowContent = '<tr class="view_livescore" data-id="' + tournament.id + '">';
    rowContent += '<td class="t_list_table">' + tournament.title + '</td>';
    rowContent += '<td class="t_list_table">' + tournament.location + '</td>';
    rowContent += '<td class="t_list_table_rgt">' + tournament.date + '</td>';
    rowContent += '</tr>';
    $('#tbl_leaderboards tbody').append(rowContent);
};

function displayTournament(tournament) {
    $('#p_ls_title').text(tournament.title);
    $('#p_ls_location').text(tournament.location);
    $('#p_ls_date').text(tournament.date);
    $('#p_ls_formula').text(tournament.formula);
    loadRounds(tournament.id, displayRounds);
};

function displayRounds(rounds) {
    $("#t_ls_body").empty();
    $.each(rounds, function (index, round) {
        addRoundToTable(round);
    });
    sortTable(1);
    sortTable(2);
};

function addRoundToTable(round) {
    var theDay = 'fr';
    if(round.day == 2){
        theDay = 'sr';
    }

    var rowContent = '<tr>';
    rowContent += '<td class="t_ls_pla">' + round.playerName + '</td>';
    rowContent += '<td class="t_ls_hd_bld">' + round.phcp + '</td>';

    for(let i=1; i<= 18; i++){
        var td_id = round.id + '_' + i;
        if(round.holes !== null){
            if(round['holes'][i] !== undefined){
                var strk = round.holes[i];
                var net_result = calculateMedal(i, strk, round.phcp);
                var b_g_color = 'd7edef';
                if(net_result > 0){
                    b_g_color = 'dfdfdf';
                }
                if(net_result < 0){
                    b_g_color = 'fbfabc';
                }
                rowContent += '<td id="' + td_id + '" style="cursor: pointer; background-color: #' + b_g_color + ';" class="t_ls_hd active_hole" data-id="' + round.id + '" data-hole="' + i + '" data-par="' + getHolePar(i) + '" data-hcp="' + holeHcp + '" data-add="' + calculateAdditionalStrokes(round.phcp, holeHcp) + '">' + strk + '</td>';
                //       PAR: d7edef
                //  over PAR: dfdfdf
                // under PAR: fbfabc
                //rowContent += '<td style="cursor: pointer;" class="view_timetable" data-id="' + info.id + '"><img src="../images/file-text.svg" alt="view" width="32" height="32"></a></td>';
            }else{
                var holeHcp = getHoleHcp(i);
                rowContent += '<td id="' + td_id + '" style="cursor: pointer;" class="t_ls_empty active_hole" data-id="' + round.id + '" data-hole="' + i + '" data-par="' + getHolePar(i) + '" data-hcp="' + holeHcp + '" data-add="' + calculateAdditionalStrokes(round.phcp, holeHcp) + '">&nbsp</td>';
            }
        }else{
            var holeHcp = getHoleHcp(i);
            rowContent += '<td id="' + td_id + '" style="cursor: pointer;" class="t_ls_empty active_hole" data-id="' + round.id + '" data-hole="' + i + '" data-par="' + getHolePar(i) + '" data-hcp="' + holeHcp + '" data-add="' + calculateAdditionalStrokes(round.phcp, holeHcp) + '">&nbsp</td>';
        }
    }

    if(round.day == 1){
        rowContent += '<td id="tot_1_' + round.playerId + '" class="t_ls_hd_bld">#</td>';
        rowContent += '<td id="mdl_1_' + round.playerId + '" class="t_ls_hd_bld">#</td>';
    }

    if(round.day == 2){
        rowContent += '<td id="tot_2_' + round.playerId + '" class="t_ls_hd_bld">#</td>';
        rowContent += '<td id="tot_all_' + round.playerId + '" class="t_ls_hd_bld">#</td>';
        rowContent += '<td id="mdl_2_' + round.playerId + '" class="t_ls_hd_bld">#</td>';
    }

    rowContent += '</tr>';
    var the_table = '#tbl_rounds_' + round.day + ' tbody';
    $(the_table).append(rowContent);

    // now that the round is part of the table we can execute calculations
    if(round.day == 1){
        setTotalsFirstDay(round.id, round.phcp, round.playerId);
    }
    if(round.day == 2){
        setTotalsSecondDay(round.id, round.phcp, round.playerId);
    }
};

function tableDataContent(roundId, phcp, hole, strokes) {
    var td_id = '#' + roundId + '_' + hole;
    var net_result = calculateMedal(hole, strokes, phcp);
    var b_g_color = 'd7edef';
    if(net_result > 0){
        b_g_color = 'dfdfdf';
    }
    if(net_result < 0){
        b_g_color = 'fbfabc';
    }
    var holeHcp = getHoleHcp(hole);
    var content = '<td id="' + td_id + '" style="cursor: pointer; background-color: #' + b_g_color + ';" class="t_ls_hd active_hole" data-id="' + roundId + '" data-hole="' + hole + '" data-par="' + getHolePar(hole) + '" data-hcp="' + holeHcp + '" data-add="' + calculateAdditionalStrokes(phcp, holeHcp) + '">' + strokes + '</td>';
    return content;
};

function setTotalsFirstDay(rid, phcp, pid) {
    var tot = calculateRoundTotalStrokes(rid);
    var mdl = calculateRoundMedal(rid, phcp);
    var td_id = '#tot_1_' + pid;
    var td_id_mdl = '#mdl_1_' + pid;
    if(tot == 0){
        $(td_id).html('&nbsp');
        $(td_id_mdl).html('&nbsp');
    }
    if(tot > 0){
        $(td_id).html(tot);
        if(mdl == 0) {
            $(td_id_mdl).html('PAR');
        }
        if(mdl > 0) {
            $(td_id_mdl).html('+' + mdl);
            $(td_id_mdl).css("color", '#A30000');
        }
        if(mdl < 0) {
            $(td_id_mdl).html(mdl);
            $(td_id_mdl).css("color", '#00a5d3');
        }
    }
};

function setTotalsSecondDay(rid, phcp, pid) {
    var r1_tot = 0;
    var td_id_tot_1 = '#tot_1_' + pid;
    var r1_tot_html = $(td_id_tot_1).html();
    if(! isNaN(r1_tot_html)){
        r1_tot = parseInt(r1_tot_html);
    }
    var r2_tot = calculateRoundTotalStrokes(rid);
    var r1_r2_tot = r1_tot + r2_tot;

    var mdl = calculateRoundMedal(rid, phcp);
    var td_id_mdl_1 = '#mdl_1_' + pid;
    var r1_mdl_html = $(td_id_mdl_1).html();
    if(! isNaN(r1_mdl_html)){
        var r1_mdl = parseInt(r1_mdl_html);
        mdl += r1_mdl;
    }

    var td_id_tot_2 = '#tot_2_' + pid;
    var td_id_mdl_2 = '#mdl_2_' + pid;
    var td_id_tot = '#tot_all_' + pid;
    if(r2_tot == 0){
        $(td_id_tot_2).html('&nbsp');
    }else{
        $(td_id_tot_2).html(r2_tot);
    }
    if(r1_r2_tot == 0){
        $(td_id_tot).html('&nbsp');
    }else{
        $(td_id_tot).html(r1_r2_tot);
    }
    if(mdl == 0){
        $(td_id_mdl_2).html('PAR');
    }
    if(mdl > 0){
        $(td_id_mdl_2).html('+' + mdl);
        $(td_id_mdl_2).css("color", '#A30000');
    }
    if(mdl < 0){
        $(td_id_mdl_2).html(mdl);
        $(td_id_mdl_2).css("color", '#00a5d3');
    }
};

function calculateRoundTotalStrokes(roundId) {
    var result = 0;
    for(let i=1; i<= 18; i++){
        var td_id = '#' + roundId + '_' + i;
        var td_html = $(td_id).html();
        if(! isNaN(td_html)){
            var strokes = parseInt(td_html);
            result += strokes;
        }
    }
    return result;
};

function calculateRoundMedal(roundId, phcp) {
    var result = 0;
    for(let i=1; i<= 18; i++){
        var td_id = '#' + roundId + '_' + i;
        var td_html = $(td_id).html();
        if(! isNaN(td_html)){
            var strokes = parseInt(td_html);
            var mdl = calculateMedal(i, strokes, phcp);
            result += mdl;
        }
    }
    return result;
};

function calculateMedal(hole, strokes, phcp) {
    var hpar = getHolePar(hole);
    var hhcp = getHoleHcp(hole);
    //console.log('===> par/hcp: ' + hpar + ' - ' + hhcp);

    var additional_strokes = calculateAdditionalStrokes(phcp, hhcp);
    return strokes - hpar - additional_strokes;
};

function calculateAdditionalStrokes(phcp, hhcp){
    if (phcp == 18){
        return 1;
    }

    if (phcp < 18){
        if (phcp >= hhcp){
            return 1;
        } else {
            return 0;
        }
    }

    if (phcp > 18){
        if ((phcp - 18) >= hhcp) {
            return 2;
        } else {
            return 1;
        }
    }
};

function getHolePar(hole) {
    var ret = 0;
    $('#tbl_rounds_1 tr').each(function() {
        if (this.rowIndex == 1){
            ret = parseInt(this.cells[hole + 1].innerHTML);
        }
    });
    return ret;
};
function getHoleHcp(hole) {
    var ret = 0;
    $('#tbl_rounds_1 tr').each(function() {
        if (this.rowIndex == 2){
            ret = parseInt(this.cells[hole + 1].innerHTML);
        }
    });
    return ret;
};

function sortTable(day) {
    var table, rows, switching, i, x, y, shouldSwitch;
    var td_id = 'tbl_rounds_' + day;
    table = document.getElementById(td_id);
    switching = true;
    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /* Loop through all table rows (except the
      first three, which contains table headers): */
      for (i = 3; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        shouldSwitch = false;
        /* Get the two elements you want to compare,
        one from current row and one from the next:
        I am using 20 + day because the column I want to use is the 21st for day 1
        and 22nd for day 2 */
        x = rows[i].getElementsByTagName("TD")[20 + day].innerHTML;
        y = rows[i + 1].getElementsByTagName("TD")[20 + day].innerHTML;
        // Check if the two rows should switch place:
        var mdl1 = 0, mdl2 = 0;
        if(isNaN(x)){
            mdl1 = 0;
        }else{
            mdl1 = parseInt(x);
        }
        if(isNaN(y)){
            mdl2 = 0;
        }else{
            mdl2 = parseInt(y);
        }
        if (mdl2 < mdl1) {
            // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
}
// --- STORAGE FUNCTIONS ----------------------------------------- 
function saveScore(score, callbackFunction) {
    var theUrl = STORE_ORIGIN + '/rounds/' + score.id + '/' + score.hole + '/' + score.strokes;
    $.ajax({
        type: "POST",
        url: theUrl,
        dataType: 'json',
        complete: function(response, status, xhr){
            var holeInfo = jQuery.parseJSON(response.responseText);
            callbackFunction(holeInfo);
        }
    });
};

function loadTournaments(callbackFunction) {
    var theUrl = STORE_ORIGIN + '/tournaments';
    $.ajax({
        url: theUrl,
        type: 'GET',
        dataType: 'json',
        complete: function(response, status, xhr){
            callbackFunction(jQuery.parseJSON(response.responseText));
        }
    });
};

function loadTournament(id, callbackFunction) {
    var theUrl = STORE_ORIGIN + '/tournaments/' + id;
    $.ajax({
        url: theUrl,
        type: 'GET',
        dataType: 'json',
        complete: function(response, status, xhr){
            callbackFunction(jQuery.parseJSON(response.responseText));
        }
    });
};

function loadRounds(tournamentId, callbackFunction) {
    var theUrl = STORE_ORIGIN + '/rounds/' + tournamentId;
    $.ajax({
        url: theUrl,
        type: 'GET',
        dataType: 'json',
        complete: function(response, status, xhr){
            callbackFunction(jQuery.parseJSON(response.responseText));
        }
    });
};

function deleteTimetable(id) {
    var theUrl = STORE_ORIGIN + '/timetables/' + id;
    $.ajax({
        url: theUrl,
        type: 'DELETE',
        dataType: 'json',
        complete: function(response, status, xhr){
            console.log('TIMETABLE ' + id + ' deleted!');
        }
    });
};