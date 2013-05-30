$(document).ready( function( ) {
	
	$('.trainer .post select').change( function() {
		
		$.get( $(this).val(), function( data, status ) {
			
		});
		
		$(this).parent().remove();
		
	});
	
	$('#ignore_all').click( function() {		
		$.get( '/train/ignore',
		 	{ posts: $('.trainer .post').map(function() { return $(this).attr('data-post') }).get() },
			function( data, status ) {
				
			}
		);
		
		return false;
		
	});
	
});