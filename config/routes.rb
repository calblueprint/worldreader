Rails.application.routes.draw do
  devise_scope :user do
    get "/logout" => "devise/sessions#destroy"
    get "/login" => "devise/sessions#new"
  end

  devise_for :users, :skip => [:sessions]
  as :user do
    post 'users/sign_in' => 'devise/sessions#create', :as => 'user_session'
    delete 'users/sign_out' => 'devise/sessions#destroy', as: 'destroy_user_session'
  end

  resources :users

  # post "/add_to_cart/:book_id" => "carts#add", :as => "add_to_cart"

  resources :books

  resources :carts do
    post "add/:book_id" => "carts#add"
    post "remove/:book_id" => "cards#remove"
  end


  namespace :admin do
    resources :dashboard
    resources :recommendations
  end

  # API routes for react updates
  namespace :api do
    namespace :v1 do
      resources :carts do
        collection do
          post "add/:book_id" => "carts#add"
          post "remove/:book_id" => "carts#remove"
        end
      end
    end
  end

  root to: "books#index"
end
