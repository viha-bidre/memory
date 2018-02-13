defmodule Memory.Game do
	
	def new do
		%{
			tiles: next_tiles(),
			flippedTiles: [],
			clicks: 0,
		}
	end

	def client_view(game) do
		%{
			tiles: game.tiles,
			flippedTiles: game.flippedTiles,
			clicks: game.clicks,
		}
	end

	

	def checkForMatch(game, flippedTiles) do
		
		{x,tile1Val} = Enum.at(game.tiles, Enum.at(flippedTiles, 0))
					|> Map.fetch(:val)

		{y,tile2Val} = Enum.at(game.tiles, Enum.at(flippedTiles, 1))
					|> Map.fetch(:val)

		if (tile1Val === tile2Val) do
			tile1 = Enum.at(game.tiles, Enum.at(flippedTiles, 0))
					|> Map.replace(:status, "matched")
			tile2 = Enum.at(game.tiles, Enum.at(flippedTiles, 1))
					|> Map.replace(:status, "matched")
			update_tiles1 = List.replace_at(game.tiles, Enum.at(flippedTiles,0), tile1)
			update_tiles2 = List.replace_at(update_tiles1, Enum.at(flippedTiles,1), tile2)
			%{
				tiles: update_tiles2,
				flippedTiles: [],
				clicks: game.clicks + 1,
			}
		else
			%{
				tiles: game.tiles,
				flippedTiles: game.flippedTiles,
				clicks: game.clicks + 1,
			}
		end
	end

	def next_tiles do
		list = ["A", "B", "C", "D", "E", "F", "G", "H"];
		list2 = list ++ list
		list3 = Enum.map list2 , fn v -> %{val: v, status: "hidden"} end
		Enum.shuffle(list3)
	end
end
