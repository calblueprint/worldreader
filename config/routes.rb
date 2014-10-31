Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    root :to => "devise/sessions#new"
  end
  devise_for :users

  resources :users

  post "/add_to_cart/:book_id" => "carts#add", :as => "add_to_cart"
  
  resources :books

  resources :carts

  namespace :admin do
    resources :dashboard do
      collection do
        get "display_partners", :as => "display_partners"
      end
    end
  end
end
