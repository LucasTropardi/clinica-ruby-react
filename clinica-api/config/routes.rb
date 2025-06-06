Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  post '/login', to: 'auth#login'
  post '/signup', to: 'users#create'
  get 'appointments/all', to: 'appointments#all'

  get '/doctors/:id/available_times', to: 'appointments#available_times'

  resources :doctors
  resources :users, only: [:index, :show, :update, :destroy]
  resources :appointments, only: [:index, :show, :create, :destroy]
end
