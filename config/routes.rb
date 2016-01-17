Rails.application.routes.draw do
  root "demo#index"
  mount ActionCable.server => '/cable'
end
