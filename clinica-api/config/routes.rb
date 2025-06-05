Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post '/login', to: 'auth#login'
  post '/signup', to: 'users#create'
  get 'appointments/all', to: 'appointments#all'

  resources :users, only: [:index, :show, :update, :destroy]
  resources :doctors
  resources :appointments, only: [:index, :show, :create, :destroy]
end
