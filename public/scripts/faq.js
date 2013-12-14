(function($) {
	var $search;
	var $questions;
	var $answers;

	var init = function() {
		if ($('#faq').length < 1) {
			return;
		}
		
		$search = $('#search');
		$questions = $('.question');
		$answers = $('.answer');

		$search.keyup(function(err, key) {
			var val = $search.val();

			if (val.length > 0) {
				$questions.hide();
				$questions.filter(':contains("' + val + '")').show();

				$questions.filter(':visible').children('.answer').collapse('show');
				$questions.filter(':hidden').children('.answer').collapse('hide');
			} else {
				$questions.show();
				$questions.children('.answer').collapse('hide');
			}
		});

		if (window.location.hash) {
			var $q = $(window.location.hash);
			if ($q.length > 0) {
				$q.collapse('show');
			}
		}
	};

	$(init);
}(jQuery));