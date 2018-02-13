defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:"<> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.GameBackup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" =>Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("reset", payload, socket) do
    game = Game.new()
    Memory.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  def handle_in("checkForMatch", %{"flippedTiles" => flippedTiles}, socket) do
    game = Game.checkForMatch(socket.assigns[:game], flippedTiles)
    Memory.GameBackup.save(socket.assigns[:name],game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end
  
  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
