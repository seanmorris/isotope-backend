$(function()
{
	var lastMove = null;

	var update = function()
	{
		var currentState = $.ajax({
			url: window.location.href + '?api'
			, async: false
			, dataType: 'json'
		}).responseJSON;

		currentState = currentState.body;

		if(lastMove != currentState.moves && (lastMove !== null))
		{
			for(var i in currentState.boardData.data)
			{
				for(var j in currentState.boardData.data[i])
				{
					$('.IsotopeBoard td[data-x="'+i+'"][data-y="'+j+'"] a').html(
						currentState.boardData.data[i][j]['mass']
					);

					$('.IsotopeBoard td[data-x="'+i+'"][data-y="'+j+'"]').attr(
						'data-claim'
						, currentState.boardData.data[i][j]['claimed']
					);
				}
			}
			for(var i in currentState.chain)
			{
				var explX = currentState.chain[i][0];
				var explY = currentState.chain[i][1];
				/*
				$('.IsotopeBoard td[data-x="'+explX+'"][data-y="'+explY+'"] a').html(
					currentState.boardData.data[explX][explY]['mass']
				);

				$('.IsotopeBoard td[data-x="'+explX+'"][data-y="'+explY+'"]').attr(
					'data-claim'
					, currentState.boardData.data[explX][explY]['claimed']
				);
				*/

				$('.IsotopeBoard td[data-x="'+explX+'"][data-y="'+explY+'"]').addClass('exploding');

				setTimeout(
					(function(explX, explY)
					{
						return function()
						{
							$('.IsotopeBoard td[data-x="'+explX+'"][data-y="'+explY+'"]').removeClass('exploding');
						}
					})(explX, explY)
					, 500 + (i*75)
				);
			}
		}

		lastMove = currentState.moves;

		var status = '';

		if(lastMove % currentState.maxPlayers == 1)
		{
			status = 'Blue player\'s turn';
		}
		else if(lastMove % currentState.maxPlayers == 0)
		{
			status = 'Red player\'s turn';
		}
		else if(lastMove % currentState.maxPlayers == 2)
		{
			status = 'Green player\'s turn';
		}

		if(Math.floor(currentState.moves / currentState.maxPlayers) == currentState.maxMoves)
		{
			status = 'Red player wins.';

			if(currentState.scores[1] > currentState.scores[0])
			{
				status = 'Blue player wins.';
			}

			if(currentState.scores[2] > currentState.scores[0] && currentState.scores[2] > currentState.scores[1])
			{
				status = 'Green player wins.';
			}
		}

		status += ' (' + Math.floor(currentState.moves / currentState.maxPlayers) + ' / ' + (currentState.maxMoves) + ' turns)';

		status += '<br />Red: ' + currentState.scores[0] + ' / Blue: ' + (currentState.scores[1] ? currentState.scores[1] : 0);

		if(currentState.maxPlayers > 2)
		{
			status += ' / Green: ' + (currentState.scores[2] ? currentState.scores[2] : 0);
		}

		if(currentState.mode == 2)
		{
			$('.IsotopeBoard .IsotopeStatus').html(status);
		}
	};

	update();

	setInterval(update, 3500);

	$('.IsotopeBoard td[data-x]').click(function(e)
	{
		$.ajax({
			url: window.location.href + '/move'
				+ '?api&x='
				+ $(this).data('x')
				+ '&y=' + $(this).data('y')
			, async: false
		});
		update();
		e.preventDefault();
	});
});