function colbertSS(){

  var numResults = 10;
  var colbertChannelId = "UCMtFAi84ehTSYSE9XoHefig"; //insert different channel ID
  var link = "https://www.youtube.com/watch?v="
  
  var colbertResults = YouTube.Channels.list("contentDetails", {id: colbertChannelId}); 
  var colbertUploadsId = colbertResults.items[0].contentDetails.relatedPlaylists.uploads;
  var colbertMostRecentDetails = YouTube.PlaylistItems.list("contentDetails", 
                                                            {playlistId: colbertUploadsId,
                                                             maxResults: numResults}); // this is where the video id's are
  var colbertMostRecentSnippet = YouTube.PlaylistItems.list("snippet", 
                                                            {playlistId: colbertUploadsId,
                                                             maxResults: numResults}); // this is where the dates are
  var dates = [];
  var videoIDs = [];
  var titles = [];
  var views = [];
  
  for (var i in colbertMostRecentSnippet.items){
      dates[i] = colbertMostRecentSnippet.items[i].snippet.publishedAt;
  }

  for(var i = 0; i < dates.length; i++){
    videoIDs[i] = colbertMostRecentDetails.items[i].contentDetails.videoId; // Get Vid IDs
  }
  
  var colbertMostRecentVideoIdsStr = videoIDs.toString();
  var colbertTitles = YouTube.Videos.list('snippet', {id: colbertMostRecentVideoIdsStr});
  var colbertViews = YouTube.Videos.list('statistics', {id: colbertMostRecentVideoIdsStr});
  
  for(var i in colbertViews.items){
    views[i] = colbertViews.items[i].statistics.viewCount;
    titles[i] = colbertTitles.items[i].snippet.title; // Get the Titles
  }
 
  // Create the Spreadsheet
  var currentdate = new Date();
  var datetime = (currentdate.getMonth()+1) + "/" + currentdate.getDate()
  
  var ssName = "Colbert Videos from " + datetime;
  var numRows = titles.length;
  var numCols = 4;
  var ssNew = SpreadsheetApp.create(ssName, numRows + 1, numCols);
  var sheet = ssNew.getSheets()[0];
  
  // Headers and Formatting, Make it Pretty
  sheet.appendRow(["Date", "Title", "Views","Link"]);
  sheet.getRange("A1:D1").setFontWeight('bold');
  sheet.getRange("A:B").setHorizontalAlignment("left");
  sheet.getRange("C:D").setHorizontalAlignment("right");
  sheet.setColumnWidth(1, 125);
  sheet.setColumnWidth(2, 650);
  sheet.setColumnWidth(3, 100);
  sheet.setColumnWidth(4, 400);
  
  // Fill the Sheet
  for(var i = 0; i < numRows; i++){
    var date = dates[i].substring(0,16);
    var title = titles[i];
    var view = views[i];
    var ids = link.concat(videoIDs[i]);
    sheet.getRange(i+2, 1).setValue(date);
    sheet.getRange(i+2, 2).setValue(title);
    sheet.getRange(i+2, 3).setValue(view);
    sheet.getRange(i+2, 4).setValue(ids);
  }
  
  // Delete rows NOT from the desired date and sort by views
  var allDates = [];
  var rowsDeleted = 0;
  for(var i = 0; i < numRows; i++){
    var counter = i+2;
    allDates[i] = sheet.getRange(counter,1).getValue().toString().substring(0,10);
   }
  for(var i = 0; i < numRows; i++){
    if (allDates[i] != allDates.sort().reverse()[0]){
      sheet.deleteRow((i+2) - rowsDeleted);
      rowsDeleted++;
    }
  }
  sheet.sort(3, false);
  sheet.setFrozenRows(1);
}
