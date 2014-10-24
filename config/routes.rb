Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    get "/login" => "devise/sessions#new"
  end
  devise_for :users

  resources :users

  post "/add_to_cart/:book_id" => "carts#add", :as => "add_to_cart"
  
  resources :books

  resources :carts

  namespace :admin do
    resources :dashboard
  end

  root to: "books#index"
end
