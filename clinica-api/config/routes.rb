Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post '/login', to: 'auth#login'
  post '/signup', to: 'users#create'

  # root "posts#index"
end
