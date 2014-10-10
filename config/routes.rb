Rails.application.routes.draw do
  root to: 'visitors#index'
  devise_for :users
  resources :users
  resources :books

  namespace :admin do
    resources :dashboard
  end
end
