Rails.application.routes.draw do
  root to: 'visitors#index'
  devise_for :users

  resources :users do
  	post "cart"
  end

  resources :books

  namespace :admin do
    resources :dashboard
  end
end
