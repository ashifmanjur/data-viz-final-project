class NeighbourhoodsController < ApplicationController
  def show
    @neighboorhood_id = params[:id]
  end
end
