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
    resources :dashboard do
      collection do
        get "display_partners", :as => "display_partners"
      end
      member do
        get "partner_information", :as => "partner_information"
        get "display_groups", :as => "display_groups"
        get "display_purchases", :as => "display_purchases"
        get "display_books", :as => "display_books"
        get "display_book", :as => "display_book"
      end
    end
    resources :recommendations do
      collection do
        get "display_partners", :as => "display_partners"
        get "display_books", :as => "display_books"
        get "display_partner_categories", :as => "display_partner_categories"
        get "display_recommendations", :as => "display_recommendations"
        post "/add", :to => "recommendations#add_recommendation"
      end
      member do
        post "/edit", :to => "recommendations#edit_recommendation"
      end
    end
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
