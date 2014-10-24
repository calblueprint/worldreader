Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    get "/login" => "devise/sessions#new"
  end
  devise_for :users

  resources :users do
    post "cart"
  end

  resources :books

  namespace :admin do
    resources :dashboard
  end

  root to: "books#index"
end
