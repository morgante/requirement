$(document).ready( function( ) {
	
	// $( "#lookup input.name" ).autocomplete({
	// 	source: "/api/people/lookup",
	// 	minLength: 2,
	// 	select: function( event, ui ) {
	// 		console.log( ui.item );
	// 	}
	// });
	
	// $('#lookup').modal( {'show': false});
	
	// fetch all names
	$.getJSON( '/api/people/search?type=simple', function( data, status ) {
		$('#lookup input.name').typeahead({
			source: data,
			updater:function (item) {
				$('#lookup input.name').val( item );
				$('#lookup').submit();
				return item;
			}
		});
	});
	
	$('#lookup').submit( function() {		
		$.getJSON( '/api/people/rank?name=' + $('#lookup input.name').val(), function( data, status ) {
			if( data.error == null )
			{
				$('#lookup .rankStat.posts span.number strong').text( data.fbPosts );
				$('#lookup .rankStat.posts span.rank strong').text( data.postRank );

				$('#lookup .rankStat.comments span.number strong').text( data.fbComments );
				$('#lookup .rankStat.comments span.rank strong').text( data.commentRank );
				
				$('.rankStat').slideDown();
			}
			else
			{
				alert( data.error );
			}			
		});
		
		return false;
	});
	
});